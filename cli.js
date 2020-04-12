#! /usr/bin/env node

const program = require('commander');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');

// Questioners.
const { askGeneralQuestion, askForMocking } = require('./questioners/imports');

// Detectors.
const { isLocalImport, getImportPath, isImportAliased, isMultiLineImport, getImportContext } = require('./detecters/imports');

// Snippets.
const { getGeneralImport, intl, redux, getTestFile, getMessageFile } = require('./snippets/imports');
const { defineDescribe } = require('./snippets/describe');
const { customizeRtl } = require('./snippets/customize');
const { consumedComponentMock, promiseMethodMock, hocComponentMock } = require('./snippets/mockers');

const log = console.log;
const error = (msg, canExit = true) => {
  log(chalk.white.bgRed(`Error: ${msg}`));
  canExit && process.exit();
};
const warning = chalk.keyword('orange');
const warn = (msg) => {
  log(warning(`Waning: ${msg}`));
};

const lineCounter = ((i = 0) => () => ++i)();

const getLibName = (suffix = '') => {
  return `React-Auto-TDD${suffix}`
}

program
  .option("-f, --file-name <value>", "File Name")
  .parse(process.argv);

const getSpecName = () => {
  return path.parse(path.basename(program.fileName)).name;
};

let hasError = false;

const getSpecExtn = () => {
  return path.parse(path.basename(program.fileName)).ext;
};

const absoluteFileName = `${process.cwd()}/${program.fileName}`;
const dirPath = path.dirname(absoluteFileName);
const specFileName = `${getSpecName()}.test${getSpecExtn()}`;
const jsFilePath = `${dirPath}/${program.fileName}`;
const specFilePath = `${dirPath}/${specFileName}`;
const renamedFileName = `${dirPath}/${getSpecName()}.test_old_${getSpecExtn()}`;

const specFileContent = [];
const localStore = {
  rtlRender: false,
  intl: false,
  redux: false,
};

try {
  if (!fs.existsSync(program.fileName)) {
    error(`Unable to access the provided Source File Path ! - ${program.fileName} `);
  } else if (getSpecExtn() != '.js') {
    error(`${getLibName} only support JavaScript as Source File ! `);
  }

  if (fs.existsSync(specFilePath)) {
    console.log(`Currently, '${specFileName}' Spec File is exist\n`);
    console.log(`'${specFileName}' is renamed to ${renamedFileName}\n`);
    fs.rename(specFilePath, `${renamedFileName}`, function (err) {
      if (err) {
        console.log(`Unable to Rename ${specFilePath}`, err);
        return;
      }
    });
  } else {
    console.log(`New ${specFilePath} file will be created!`);
  }
} catch (err) {
  console.error(err)
}

askGeneralQuestion({
  onCustomizeRtlRender: (rtlRender) => {
    localStore.rtlRender = rtlRender;
    specFileContent.push(...getGeneralImport({ rtlRender }));
  },
  onAddIntl: () => {
    localStore.intl = true;
    specFileContent.push(intl);
  },
  onAddStore: () => {
    localStore.redux = true;
    specFileContent.push(redux);
  },
  done: (messageFilePath) => {
    const specFileImport = getTestFile(getSpecName());
    specFileContent.push(...specFileImport);

    if (messageFilePath) {
      const intlMessageImport = getMessageFile(messageFilePath);
      specFileContent.push(...intlMessageImport);
    }

    // Customize RTL Render Method.
    if (localStore.rtlRender) {
      specFileContent.push(...customizeRtl({ intl }));
    }

    const readInterface = readline.createInterface({
      input: fs.createReadStream(`${process.cwd()}/${program.fileName}`),
      output: process.stdout,
      terminal: false
    });

    let mockList = [];

    readInterface.on("line", async function (line, lineNo = lineCounter()) {
      if (isImportAliased(line)) {
        hasError = true;
        error(`Line ${lineNo}: Alias Import is not supported yet !`);
      } else if (isMultiLineImport(line)) {
        hasError = true;
        error(`Line ${lineNo}: Import Statement in Multiple Lines is not supported yet !`);
      } else if (isLocalImport(line)) {
        mockList.push(line);
      }
    })
      .on('close', async function () {
        readInterface.close();
        if (hasError) {
          return;
        }

        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
          }
        }

        const start = async () => {
          await asyncForEach(mockList, async (line) => {
            const answers = await askForMocking(line);
            const filePath = getImportPath(line);
            const importContext = getImportContext(line);

            if (answers.importType === 'Promise Method') {
              specFileContent.push(...promiseMethodMock({
                filePath,
                importContext,
                resolveValue: null,
              }));
            } else if (answers.importType === 'Consumed Component') {
              specFileContent.push(...consumedComponentMock({
                filePath,
              }));
            } else if (answers.importType === 'HOC Component') {
              specFileContent.push(...hocComponentMock({
                filePath,
              }));
            }
          })
        }
        await start();

        // Describe, test Snippets.
        specFileContent.push(
          ...defineDescribe({
            specName: getSpecName(),
            redux: localStore.redux,
          })
        );

        fs.writeFile(specFilePath, specFileContent.join('\n'), function (err, data) {
          if (err) {
            return console.log(err);
          }
          console.log(`Happy Coding ! ${specFileName} is created`);
        });
      });
  }
});
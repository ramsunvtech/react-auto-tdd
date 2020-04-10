#! /usr/bin/env node


// const reacttdd = require('./index');

// reacttdd();

const program = require('commander');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');

// Others.
const { askGeneralQuestion, askForMocking } = require('./questioners/imports');
const { isLocalImport, getImportPath } = require('./detecters/imports');

// Snippets.
const { general, intl, redux, getTestFile, getMessageFile } = require('./snippets/imports');
const { defineDescribe } = require('./snippets/describe');
const { customizeRtl } = require('./snippets/customize');
const { consumedComponentMock, promiseMethodMock, hocComponentMock } = require('./snippets/mockers');

program
  .option("-f, --file-name <value>", "File Name")
  .parse(process.argv);

const getSpecName = () => {
  return path.parse(path.basename(program.fileName)).name;
};

const getSpecExtn = () => {
  return path.parse(path.basename(program.fileName)).ext;
};

const absoluteFileName = `${process.cwd()}/${program.fileName}`;
const dirPath = path.dirname(absoluteFileName);
const specFileName = `${dirPath}/${getSpecName()}.test${getSpecExtn()}`;
const renamedFileName = `${dirPath}/${getSpecName()}.test_old_${getSpecExtn()}`;

console.log(getSpecName());
console.log(program.fileName)
console.log(`- ${absoluteFileName}`);

let canReadFileToAppend = false;
const specFileContent = [ ...general ];
const localStore = {
  rtlRender: false,
  intl: false,
  redux: false,
};

try {
  if (fs.existsSync(specFileName)) {
    console.log('file exists');
    fs.rename(specFileName, `${renamedFileName}`, function(err) {
      if ( err ) {
        console.log('MV-ERROR: ' + err);
        return;
      }

      canReadFileToAppend = true;
    });
  } else {
    console.log('not exists');
    canReadFileToAppend = true;
  }
} catch(err) {
  console.error(err)
}

// askForSomething();

// if (canReadFileToAppend) {

  
  askGeneralQuestion({
    onCustomizeRtlRender: () => {
      localStore.rtlRender = true;
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

      readInterface.on("line", async function(line, no) {
        if (isLocalImport(line)) {

          mockList.push(line);
        }
      })
      .on('close', async function(){
        readInterface.close();

        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
          }
        }
        
        const start = async () => {
          await asyncForEach(mockList, async (line) => {
            const answers = await askForMocking(line);
            const filePath = getImportPath(line);

            if (answers.importType === 'Promise Model') {
              specFileContent.push(...promiseMethodMock({
                filePath,
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

        fs.writeFile(specFileName, specFileContent.join('\n'), function (err,data) {
          if (err) {
            return console.log(err);
          }
          console.log(data);
        });
      });
    }
  });

// }

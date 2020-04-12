#! /usr/bin/env node

const program = require('commander'),
    fs = require('fs'),
    chalk = require('chalk'),
    path = require('path'),
    readline = require('readline'),
    inquirer = require('inquirer');

// Others.
const {
    askGeneralQuestion,
    askForMocking
} = require('./questioners/imports'), {
    isLocalImport,
    getImportPath,
    getImportContext
} = require('./detecters/imports');

// Snippets.
const {
    getGeneralImport,
    intl,
    redux,
    getTestFile,
    getMessageFile
} = require('./snippets/imports'), {
    defineDescribe
} = require('./snippets/describe'), {
    customizeRtl
} = require('./snippets/customize'), {
    consumedComponentMock,
    promiseMethodMock,
    hocComponentMock
} = require('./snippets/mockers');

program
    .option("-f, --file-name <value>", "File Name")
    .parse(process.argv);

const getSpecName = () => {
    return path.parse(path.basename(program.fileName)).name;
};

const getSpecExtn = () => {
    return path.parse(path.basename(program.fileName)).ext;
};

const absoluteFileName = `${process.cwd()}/${program.fileName}`,
    dirPath = path.dirname(absoluteFileName),
    specFileName = `${getSpecName()}.test${getSpecExtn()}`,
    specFilePath = `${dirPath}/${specFileName}`,
    renamedFileName = `${dirPath}/${getSpecName()}.test_old_${getSpecExtn()}`;

let canReadFileToAppend = false;
const specFileContent = [];
const localStore = {
    rtlRender: false,
    intl: false,
    redux: false,
};

try {
    if (fs.existsSync(specFilePath)) {
        console.log(`Currently, '${specFileName}' Spec File is exist\n`);
        fs.rename(specFilePath, `${renamedFileName}`, function(err) {
            if (err) {
                console.log('MV-ERROR: ' + err);
                return;
            }

            canReadFileToAppend = true;
            console.log(`'${specFileName}' is renamed to ${renamedFileName}\n`);
        });
    } else {
        console.log(`New ${specFilePath} file will be created!`);
        canReadFileToAppend = true;
    }
} catch (err) {
    console.error(err)
}

askGeneralQuestion({
    onCustomizeRtlRender: (rtlRender) => {
        localStore.rtlRender = rtlRender;
        specFileContent.push(...getGeneralImport({
            rtlRender
        }));
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
            specFileContent.push(...customizeRtl({
                intl
            }));
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
            .on('close', async function() {
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

                fs.writeFile(specFilePath, specFileContent.join('\n'), function(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`Happy Coding ! ${specFileName} is created`);
                });
            });
    }
});

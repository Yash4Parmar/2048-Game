const { lstatSync, readdir, readFile, writeFile } = require('fs');
const { extname, resolve } = require('path');
// import { lstatSync, readdir, readFile, writeFile } from 'fs';
// import { extname, resolve } from 'path';

const parentDir = process.cwd();

const infoData = {
    jpgImagesStr: "",
    pngImagesStr: "",
    soundStr: "",
}

// console.log(infoData);
const onGfnComplete = (objStr, finalStr) => {
    count++;
    // console.log('completedGFNs - ', count);
    infoData[objStr] = finalStr;
    if (count === 3) {
        // console.log(infoData);
        readFile(parentDir + '/src/app/data/assets.js', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            const regex = /(?<=\[).*(?=\])/;
            let result = data.split('\n');
            result[3] = result[3].replace(regex, infoData.pngImagesStr);
            result[4] = result[4].replace(regex, infoData.jpgImagesStr);
            result[9] = result[9].replace(regex, infoData.soundStr);
            result = result.join('\n');
            // console.log('infoData.jpgImagesStr', result, infoData.soundStr);

            writeFile(parentDir + '/src/app/data/assets.js', result, err => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log('Info updated successfully!');
            })
        });
    }
}

const gfn = (dir, fileExtension, keepExtension, cbk, ctxt, objStr, forSoundFile = false, forBGM = false) => {
    let finalStr = "";
    readdir(dir, (err, files) => {
        // handling error
        if (err) {
            cbk.call(ctxt, objStr, finalStr);
            return console.log('Unable to scan directory: ' + err);
        }
        // listing all files using forEach
        files.forEach(file => {
            if (lstatSync(resolve(dir, file)).isFile()) {
                const currentExtension = extname(file);

                if (fileExtension.includes(currentExtension)) {
                    // console.log(currentExtension);
                    const fileName = keepExtension ? file : file.split('.')[0];
                    finalStr += ("'" + fileName + "', ");
                }
            }
        });

        finalStr = finalStr.substring(0, finalStr.length - 2);
        // console.log(finalStr);
        cbk.call(ctxt, objStr, finalStr);
    })
}

let count = 0;

gfn(parentDir + '/src/assets', ['.jpg', ".JPG", ".JPEG", ".jpeg"], false, onGfnComplete, this, 'jpgImagesStr');
gfn(parentDir + '/src/assets', ['.png', ".PNG"], false, onGfnComplete, this, 'pngImagesStr');
gfn(parentDir + '/src/assets/sounds', ['.mp3'], false, onGfnComplete, this, 'soundStr', true, false);
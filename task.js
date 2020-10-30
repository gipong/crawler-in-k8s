const puppeteer = require("puppeteer");
const crypto = require('crypto');
const fetch = require('node-fetch');
const path = require('path');
const fs = require("fs");

let target_image_folder = process.argv[2];
let target_folder = process.argv[3];

let dirs = 0

const randomAccessIndex = (length) => {
    return Math.floor(Math.random() * length)
};

    dirs = fs.readdirSync(target_image_folder);

    let target_image = path.resolve(target_image_folder, dirs[randomAccessIndex(dirs.length)]);

    (async (target_image, target_folder) => {
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
        const page = await browser.newPage();
        const base_url = 'https://www.bing.com/?scope=images&nr=1&FORM=NOFORM';

        let richImgLnk_clear = [];

        await page.goto(base_url, { waitUntil:"networkidle2" });
        await page.waitForSelector("input#sb_fileinput[type=file]");
        await page.waitForTimeout(1000);
        const inputUploadHandle = await page.$('input#sb_fileinput[type=file]');
        await inputUploadHandle.uploadFile(target_image);
        await page.waitForTimeout(5 * 1000);

        fs.unlink(target_image, (err) => {
            if (err) console.log(err);
        });

        await page.evaluate(() => {
            let scroll_height = 1000;
            let count = 1;
            let timer = setInterval(() => {
                if (count > 20) {
                    clearInterval(timer);
                }

                window.scrollTo(0, document.body.clientHeight + scroll_height);
                scroll_height += 1000;
                count += 1;
            }, 500);
        });

        await page.waitForTimeout(20 * 1000);

        richImgLnk_clear = await page.evaluate(() => {
            const richImgLnk = Array.apply(null, document.querySelectorAll('a.richImgLnk')).filter((imgLnk) => {
                return imgLnk.href.indexOf('mediaurl=') > -1;
            });

            return richImgLnk.map((imgLnk) => {
                return decodeURIComponent(imgLnk.href.split('mediaurl=')[1]);
            });
        });

        let timer;

        async function download(url, path, index, total_length) {
            console.log(url, path, index, total_length);
            try {
                clearTimeout(timer);
                timer = setTimeout((function() {
                    return process.exit(22);
                }), 60 * 1000);
                const response = await fetch(url);
                if (response.status === 200) {
                    const buffer = await response.buffer();
                    fs.writeFile(path, buffer, () => {
                        console.log('finished')
                    });
                }

            } catch (e) {
                console.log(e);
            }
        }

        for (let i = 0; i < richImgLnk_clear.length; i++) {
            const target_path = path.format({
	     	    dir: target_folder, 
		    name: crypto.createHash('md5').update(richImgLnk_clear[i]).digest("hex"),
		    ext: '.jpeg'
	    });
            await download(richImgLnk_clear[i], target_path, i, richImgLnk_clear.length);
        }

        await browser.close();
    })(target_image, target_folder);


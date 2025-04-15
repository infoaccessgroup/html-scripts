import projectFolder from "../config.mjs";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

export const runCheerio = async ({ functions, test, fromOriginal }) => {
	const indexFile = fromOriginal
		? `output/${projectFolder}/original.html`
		: `output/${projectFolder}/index.html`;

	const indexContent = fs.readFileSync(indexFile, "utf8");

	let $ = cheerio.load(indexContent);

	for (let i = 0; i < functions.length; i++) {
		const func = functions[i];
		$ = func($);
	}

	if (test) {
		fs.writeFileSync(`output/${projectFolder}/test.html`, $.html());
	} else {
		fs.writeFileSync(`output/${projectFolder}/index.html`, $.html());
	}
};

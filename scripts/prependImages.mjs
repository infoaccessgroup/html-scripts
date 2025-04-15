// prepend image names with a string

import fs from "fs/promises";
import path from "path";
import * as cheerio from "cheerio";
import projectName from "../config.mjs";

const prependImageNames = async () => {
	const imageFolder = `output/${projectName}/images`;
	const prepend = `${projectName}-`;

	const indexFile = path.resolve(`output/${projectName}/index.html`);
	const html = await fs.readFile(indexFile, "utf-8");

	const $ = cheerio.load(html);

	const dir = path.resolve(imageFolder);
	const files = await fs.readdir(dir);

	for (const file of files) {
		const newFile = prepend + file;
		// const newFile = file.replaceAll(prepend, "");
		await fs.rename(dir + "/" + file, dir + "/" + newFile);

		const imgSrc = `images/${file}`;
		const newImgSrc = `images/${newFile}`;

		$(`img[src="${imgSrc}"]`).attr("src", newImgSrc);
	}

	// write the updated html to index.html
	fs.writeFile(indexFile, $.html());
};

await prependImageNames();

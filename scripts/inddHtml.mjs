import projectName from "../config.mjs";
import fs from "fs";
import * as cheerio from "cheerio";

const inputFolder = `input/${projectName}`;
const inputHtmlFile = `${inputFolder}/index.html`;
const inputHtml = fs.readFileSync(inputHtmlFile, "utf8");

// create output folder
const outputFolder = `output/${projectName}`;
if (!fs.existsSync(outputFolder)) {
	fs.mkdirSync(outputFolder, { recursive: true });
}

const $ = cheerio.load(inputHtml);

const functions = `${inputFolder}/functions.mjs`;
if (fs.existsSync(functions)) {
	const { runFunctions } = await import(`../${functions}`);
	await runFunctions($);
}

const body = $("body").html();
const title = $("h1").text();
const templateHtml = fs.readFileSync("template.html", "utf8");
const html = templateHtml.replace("{{content}}", body).replace("{{title}}", title);

const outputHtmlFile = `output/${projectName}/index.html`;
fs.writeFileSync(outputHtmlFile, html);

//copy the images
const inputImagesFolder = `${inputFolder}/index-web-resources/image`;
const outputImagesFolder = `${outputFolder}/images`;
if (fs.existsSync(inputImagesFolder)) {
	fs.mkdirSync(outputImagesFolder, { recursive: true });
	fs.readdirSync(inputImagesFolder).forEach((file) => {
		fs.copyFileSync(`${inputImagesFolder}/${file}`, `${outputImagesFolder}/${file}`);
	});
}

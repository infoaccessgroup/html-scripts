import projectName from "../config.mjs";
import fs from "fs";
import mammoth from "mammoth";
import * as cheerio from "cheerio";

const inputFolder = `input/${projectName}`;
const wordDocFile = fs.readdirSync(inputFolder).find((file) => file.endsWith(".docx"));
const wordDoc = `${inputFolder}/${wordDocFile}`;

// create output folder
const outputFolder = `output/${projectName}`;
if (!fs.existsSync(outputFolder)) {
	fs.mkdirSync(outputFolder, { recursive: true });
}

// create output images folder
const imagesFolder = `${outputFolder}/images`;
if (!fs.existsSync(imagesFolder)) {
	fs.mkdirSync(imagesFolder, { recursive: true });
}

const styleMapPath = `${inputFolder}/styleMap.json`;
const styleMapFile = fs.readFileSync(styleMapPath, "utf8");
const styleMap = fs.existsSync(styleMapPath) ? JSON.parse(styleMapFile) : [];
const options = {
	styleMap,
	convertImage: writeImageFiles(imagesFolder)
};

mammoth.convertToHtml({ path: wordDoc }, options).then(async function (result) {
	let html = result.value;

	const templateHtmlFile = fs.readFileSync("template.html", "utf8");
	const $ = cheerio.load(html);
	const functions = `${inputFolder}/functions.mjs`;
	if (fs.existsSync(functions)) {
		const { runFunctions } = await import(`../${functions}`);
		html = await runFunctions($);
	}

	html = templateHtmlFile.replace("{{content}}", $("body").html());
	const htmlPath = `${outputFolder}/index.html`;
	fs.writeFileSync(htmlPath, html);
	console.log(`HTML file created: ${htmlPath}`);
});

function writeImageFiles(imagesFolder) {
	const imagesFolderName = imagesFolder.split("/").pop();
	let imageCounter = 0;

	return mammoth.images.imgElement(async (image) => {
		const buffer = await image.read();
		const ext = image.contentType.split("/").pop();
		const fileName = `image-${imageCounter}.${ext}`;
		const imagePath = `${imagesFolder}/${fileName}`;
		fs.writeFileSync(imagePath, buffer);
		imageCounter++;
		return { src: `${imagesFolderName}/${fileName}` };
	});
}

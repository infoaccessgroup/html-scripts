import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import projectName from "../config.mjs";

const generateWpHtml = async () => {
	const outputFolder = path.resolve(`output/${projectName}`);
	const indexFile = path.resolve(outputFolder + "/index.html");
	const cssFilePath = path.resolve(outputFolder + "/styles.css");

	const cssFile = fs.readFileSync(cssFilePath, "utf-8");

	const minifiedStyle = cssFile
		.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "") // remove comments
		.replace(/\n/g, "")
		.replace(/\s\s+/g, " ");

	let html = fs.readFileSync(indexFile, "utf-8");
	const $ = cheerio.load(html);

	const anrowsMediaLinks = await getMediaItemLinks();

	for (let i = 0; i < anrowsMediaLinks.length; i++) {
		const link = anrowsMediaLinks[i];
		const linkArray = link.split("/");
		const imageName = linkArray[linkArray.length - 1];
		const imgSrc = `images/${imageName}`;

		$(`img[src="${imgSrc}"]`).attr("src", link);
	}

	html = $("main").html().trim().replaceAll("    ", "").replaceAll("\n", "");

	const wpHtml = `<style>
    ${minifiedStyle}
</style>
<div class="iag-word-to-html max-w-800">
    ${html}
</div>`;

	// write the wpHtml to wordpress.html
	fs.writeFileSync(outputFolder + "/wordpress.html", wpHtml);
};

const getMediaItemLinks = async () => {
	const mediaItemsFile = path.resolve(`output/${projectName}/mediaItems.html`);
	let html = fs.readFileSync(mediaItemsFile, "utf-8");

	const $ = cheerio.load(html);

	const links = [];

	$("button[data-clipboard-text]").each((_, el) => {
		links.push($(el).attr("data-clipboard-text"));
	});

	return links;
};

generateWpHtml();

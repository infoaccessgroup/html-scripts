import fs from "fs";
import path from "path";
import projectName from "../config.mjs";
import cssToJsObject from "css-to-js-object";
import * as cheerio from "cheerio";

const deleteUnusedStyles = () => {
	const cssFile = path.resolve(`output/${projectName}/styles.css`);

	const cssData = fs.readFileSync(cssFile, "utf8");
	const cssObject = cssToJsObject(cssData);
	const classes = new Set();

	for (const key in cssObject) {
		const classNames = key.split(" ");
		classNames.forEach((name) => {
			if (name.startsWith(".")) {
				classes.add(name);
			}
		});
	}

	//convert set to array
	const classesArray = Array.from(classes);

	const htmlFile = path.resolve(`output/${projectName}/index.html`);
	const htmlData = fs.readFileSync(htmlFile, "utf8");

	const $ = cheerio.load(htmlData);

	// get all classes from html
	$("*").each((i, el) => {
		const classList = $(el).attr("class");
		if (classList) {
			const classes = classList.split(" ");
			classes.forEach((name) => {
				// if name is in classesArray, remove it
				const index = classesArray.indexOf("." + name);
				if (index > -1) {
					classesArray.splice(index, 1);
				}
			});
		}
	});

	console.log("Unused classes: ", classesArray);
};

deleteUnusedStyles();

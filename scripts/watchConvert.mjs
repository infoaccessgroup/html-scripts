import chokidar from "chokidar";
import { exec } from "child_process";
import projectName from "../config.mjs";

const inputFolder = `input/${projectName}`;

const inputWatcher = chokidar.watch(inputFolder, {
	ignored: /(^|[\/\\])\../, // Ignore dotfiles
	persistent: true,
	ignoreInitial: true
});

inputWatcher.on("change", (filePath) => {
	if (filePath.endsWith(".docx")) {
		console.log(`Word document changed: ${filePath}`);
		runConvert();
	}
});

const outputFolder = `output/${projectName}`;

const outputWatcher = chokidar.watch(outputFolder, {
	ignored: /(^|[\/\\])\../, // Ignore dotfiles
	persistent: true,
	ignoreInitial: true
});

outputWatcher.on("change", (filePath) => {
	if (filePath.includes("functions.mjs")) {
		console.log(`Functions updated: ${filePath}`);
		runConvert();
	}
});

function runConvert() {
	// Run your script (replace 'node process.js' with your actual script)
	exec("node scripts/convert.mjs", (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing script: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`Script stderr: ${stderr}`);
			return;
		}
		console.log(`Script output:\n${stdout}`);
	});
}

console.log(`Watching for changes in ${inputFolder} and ${outputFolder}...`);

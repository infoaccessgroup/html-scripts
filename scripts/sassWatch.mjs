import { spawn } from "child_process";
import projectName from "../config.mjs";

const sassWatch = () => {
	const inputFile = `input/${projectName}/styles.scss`;
	const outputFile = `output/${projectName}/styles.css`;
	const command = `sass`;
	const args = [`--watch`, `${inputFile}:${outputFile}`];

	console.log(`Starting sass watch for: ${inputFile} -> ${outputFile}`);

	const process = spawn(command, args, { shell: true });

	process.stdout.on("data", (data) => {
		console.log(`[SASS]: ${data.toString()}`);
	});

	process.stderr.on("data", (data) => {
		console.error(`[SASS ERROR]: ${data.toString()}`);
	});

	process.on("close", (code) => {
		console.log(`Sass watch process exited with code ${code}`);
	});

	process.on("error", (error) => {
		console.error(`Failed to start sass watch: ${error.message}`);
	});
};

sassWatch();

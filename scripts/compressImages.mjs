#!/usr/bin/env node

import fs from "fs";
import path from "path";
import sharp from "sharp";
import minimist from "minimist";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// Emulate __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const argv = minimist(process.argv.slice(2));

const IMAGE_DIR = "output/6225-city-of-newcastle-csp-2/images";
const MAX_SIZE = (argv["max-size"] || 500) * 1024; // default 500 KB
const QUALITY = argv["quality"] || 70;

async function compressImage(filePath) {
	const { dir, name, ext } = path.parse(filePath);
	const tempPath = path.join(dir, `${name}-compressed${ext}`);

	try {
		const image = sharp(filePath);
		const metadata = await image.metadata();

		if (metadata.format === "jpeg" || metadata.format === "jpg") {
			await image.jpeg({ quality: QUALITY }).toFile(tempPath);
		} else if (metadata.format === "png") {
			await image.png({ quality: QUALITY }).toFile(tempPath);
		} else {
			console.log(`Unsupported format: ${filePath}`);
			return;
		}

		const originalSize = fs.statSync(filePath).size;
		const newSize = fs.statSync(tempPath).size;

		if (newSize < originalSize) {
			fs.renameSync(tempPath, filePath);
			console.log(`Compressed: ${filePath} (${(newSize / 1024).toFixed(1)} KB)`);
		} else {
			fs.unlinkSync(tempPath);
			console.log(`Skipped (not smaller): ${filePath}`);
		}
	} catch (err) {
		console.error(`Error compressing ${filePath}:`, err.message);
	}
}

function scanAndCompress(dir) {
	fs.readdirSync(dir).forEach((file) => {
		const fullPath = path.join(dir, file);
		const stats = fs.statSync(fullPath);

		if (stats.isDirectory()) {
			scanAndCompress(fullPath);
		} else if (/\.(jpg|jpeg|png)$/i.test(file) && stats.size > MAX_SIZE) {
			compressImage(fullPath);
		}
	});
}

scanAndCompress(IMAGE_DIR);

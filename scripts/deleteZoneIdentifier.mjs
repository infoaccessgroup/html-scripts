import fs from "fs";
import path from "path";
import projectName from "../config.mjs";

const deleteZoneIdentifierFiles = (folderPath) => {
	if (!fs.existsSync(folderPath)) {
		console.error(`The folder "${folderPath}" does not exist.`);
		return;
	}

	fs.readdir(folderPath, (err, files) => {
		if (err) {
			console.error(`Error reading the folder "${folderPath}":`, err);
			return;
		}

		files.forEach((file) => {
			const filePath = path.join(folderPath, file);

			// Check if the file has the .Zone.Identifier extension
			if (file.endsWith("Zone.Identifier")) {
				fs.unlink(filePath, (err) => {
					if (err) {
						console.error(`Error deleting file "${filePath}":`, err);
					} else {
						console.log(`Deleted: ${filePath}`);
					}
				});
			}
		});
	});
};

// Replace this with your folder path
const folderPath = `output/${projectName}/images`;

deleteZoneIdentifierFiles(folderPath);

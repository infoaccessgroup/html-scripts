import { runCheerio } from "../utils/runCheerio.mjs";
import cssToJs from "css-to-js-object";
import fs from "fs";

const css = fs.readFileSync("output/cn-newcastle-2040-csp/idGeneratedStyles.css", "utf8");
const cssObj = cssToJs(css);
function getImageSizes($) {
	$("figure img").each((_, el) => {
		const $el = $(el);
		const figureId = $el.closest("figure").attr("id");
		const styles = cssObj[`#${figureId}`];

		if (styles) {
			const { width, height } = styles;
			$el.attr("width", width);
			$el.attr("height", height);
			$el.unwrap();
			$el.removeAttr("class");
		}
	});

	return $;
}

function unwrapDivs($) {
	$("body > div").each((_, el) => {
		const $el = $(el);
		$el.replaceWith($el.html());
	});

	$("body > *").wrapAll('<div class="iag-indd-to-html"></div>');

	$("body").removeAttr("id");

	return $;
}

function unwrapFigures($) {
	$("figure").each((_, el) => {
		const $el = $(el);
		$el.replaceWith($el.html());
	});

	return $;
}

function setHeadings($) {
	const classMap = {
		"Community-Strategic-Plan-H1": "h1",
		"Main-Header---H2": "h2",
		"Sub-heading---H3": "h3",
		"H4s-in-text": "h4",
		"Sub-heading---level-2---H4": "h4",
		"Sub-heading---level-4---H4": "h4",
		"acknowledgement-title": "h3",
		"Sub-heading---level-3--H5": "h5",
		"sub-heading---level-5---h6": "h6",
		"black---h4": "h4",
		"little-h5s": "h5",
		"main-header---themes---h3": "h3",
		"sub-heading---themes---h4": "h4",
		"above-line-h4": "h4"
	};

	Object.entries(classMap).forEach(([className, heading]) => {
		$(`.${className}`).each((_, el) => {
			const $el = $(el);
			$el.replaceWith(`<${heading} class="${className}">${$el.html()}</${heading}>`);
		});
	});

	return $;
}

function removeBasicTableClasses($) {
	$(".basic-table").each((_, el) => {
		const $el = $(el);
		if (!$el.is("table")) {
			$el.removeAttr("class");
		}
	});

	return $;
}

function removeIds($) {
	$("*").each((_, el) => {
		const $el = $(el);
		let id = $el.attr("id");
		if (id && id.includes("_id")) {
			$el.removeAttr("id");
		}
	});

	return $;
}

function slugifyClasses($) {
	$("*").each((_, el) => {
		const $el = $(el);
		let classes = $el.attr("class");
		if (classes) {
			classes = classes.split(" ").map(slugify).join(" ");
			$el.attr("class", classes);
		}
	});

	return $;
}

function removelang($) {
	$("*").each((_, el) => {
		const $el = $(el);
		let lang = $el.attr("lang");
		if (lang) {
			$el.removeAttr("lang");
		}
	});

	return $;
}

function removeEmptyAs($) {
	$("a").each((_, el) => {
		const $el = $(el);
		if (!$el.text().trim()) {
			$el.remove();
		}
	});

	return $;
}

function slugify(text) {
	return text
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^\w-]+/g, "");
}

function colourBoxNumbers($) {
	$(".colour-box p").each((_, el) => {
		const $el = $(el);
		const text = $el.text();
		const num = text.split(" ")[0];
		const nums = num.split(".");
		if (nums.length == 2) {
			$el.addClass("bold");
		}
	});

	return $;
}

function removeClasses($) {
	$("body *").each((_, el) => {
		const $el = $(el);
		const classes = $el.attr("class");

		if (classes && classes.includes("basic-paragraph")) {
			$el.removeClass("basic-paragraph");
		}
	});

	return $;
}

function styleStrongSpans($) {
	$("*").each((_, el) => {
		const $el = $(el);
		const classes = $el.attr("class");
		if (classes && classes.includes("CharOverride")) {
			// get the classname that includes CharOverride
			const charOverrideClass = classes.split(" ").find((c) => c.includes("CharOverride"));
			const style = cssObj[`span.${charOverrideClass}`];
			if (style && style.fontWeight) {
				if (style.fontWeight !== "normal") {
					$el.replaceWith(`<strong>${$el.html()}</strong>`);
					// remove the charOverride class
				}
			}
		}
	});

	return $;
}

function convertToTable($) {
	const table = $("#the-table tbody");
	$(".convert-to-table .infographics_infographic-subheadings").each((index, el) => {
		if (index % 2 == 0) {
			const text = $(el).text().trim();
			const newText = text.replace("-", " to ").replace("yrs", " years");

			const data = $(el).next().text().trim();

			const tr = $("<tr></tr>");
			tr.append(`<td>${newText}</td>`);
			tr.append(`<td>${data}</td>`);

			table.append(tr);
		}
	});

	return $;
}

function priorityDivs($) {
	// Iterate through each priority-heading paragraph
	$("p.priority-headings").each((_, el) => {
		const $el = $(el);
		const followingImgs = [];

		// Find all immediate sibling `img` elements
		let sibling = $el.next();
		while (sibling.is("img")) {
			followingImgs.push(sibling);
			sibling = sibling.next();
		}

		// Wrap the images if there are any
		if (followingImgs.length > 0) {
			const wrapper = $("<div></div>");
			followingImgs.forEach((img) => {
				wrapper.append($(img));
			});

			// Insert the wrapper after the current priority-heading
			$el.after(wrapper);
		}
	});

	$("p.priority-headings").each(function () {
		const heading = $(this);
		const nextDiv = heading.next("div");

		// Check if the parent is already an <li>
		if (!heading.parent().is("li")) {
			// Wrap the heading and the following div in an <li>
			const li = $("<li class='wrap-me'></li>");
			heading.before(li);
			li.append(heading);
			if (nextDiv.length) {
				li.append(nextDiv);
			}
		}
	});

	let buffer = [];

	$("li.wrap-me").each(function () {
		const li = $(this);
		const next = li.next("li.wrap-me");

		buffer.push(li); // Add the current <li> to the buffer

		// If there's no consecutive <li.wrap-me>, or it's the last one, wrap the buffer
		if (!next.length) {
			if (buffer.length > 1) {
				const ul = $("<ul></ul>");
				buffer.forEach((el) => ul.append(el.clone())); // Clone the elements into the <ul>
				buffer[0].before(ul); // Insert the <ul> before the first buffered <li>
				buffer.forEach((el) => el.remove()); // Remove the original <li> elements
			}
			buffer = []; // Clear the buffer
		}
	});

	$("li.wrap-me").each((_, el) => {
		const $el = $(el);
		$el.removeClass("wrap-me");
	});

	$(".sub-heading---level-5---h6").each(function () {
		const subHeading = $(this);
		const siblingUl = subHeading.next("ul");

		// Only proceed if the next sibling is a <ul>
		if (siblingUl.length) {
			const wrapperDiv = $('<div class="priorities-and-objectives"></div>');

			// Append the sub-heading and the sibling <ul> to the wrapper div
			wrapperDiv.append(subHeading.clone());
			wrapperDiv.append(siblingUl.clone());

			// Insert the wrapper div before the sub-heading
			subHeading.before(wrapperDiv);

			// Remove the original sub-heading and <ul>
			subHeading.remove();
			siblingUl.remove();
		}
	});

	return $;
}

function formatTables($) {
	$(".sub-heading---h3, .sub-heading---themes---h4").each(function () {
		const heading = $(this);
		let nextElement = heading.next();

		// Loop through and wrap each consecutive <table>
		while (nextElement.is("table")) {
			nextElement.addClass("large-table theme-colour");
			const wrapperDiv = $('<div class="table-wrapper"></div>');
			wrapperDiv.append(nextElement.clone()); // Clone and wrap the table
			nextElement.before(wrapperDiv); // Insert the wrapper div before the table
			nextElement.remove(); // Remove the original table
			nextElement = wrapperDiv.next(); // Move to the next sibling
		}
	});

	return $;
}

function formatLinks($) {
	$("p.tables_table---body---smaller").each((_, el) => {
		const $el = $(el);
		const text = $el.text();
		const link = text.match(/https?:\/\/[^\s]+/);
		if (link) {
			$el.html(`<a href="${link[0]}">${link[0]}</a>`);
		}
	});

	return $;
}

function deleteEmptyFigures($) {
	$("figure").each((_, el) => {
		const $el = $(el);
		if (!$el.html().trim()) {
			$el.remove();
		}
	});

	return $;
}

function deleteEmptyDivs($) {
	$("div").each((_, el) => {
		const $el = $(el);
		if (!$el.html().trim()) {
			$el.remove();
		}
	});

	return $;
}

function textOnly($) {
	$("img").each((_, el) => {
		$(el).remove();
	});

	return $;
}

function removeAs($) {
	$("a").each((_, el) => {
		const $el = $(el);
		const href = $el.attr("href").trim();
		if (href === "http://") {
			const text = $el.text().trim();
			$el.replaceWith(`<a href="${text}>${text}</a>`);
		}
	});

	return $;
}

function unboldTableText($) {
	$(".anrows-table").each((_, el) => {
		const $el = $(el);
		$el.find("strong").each((_, strong) => {
			const $strong = $(strong);
			$strong.replaceWith($strong.text());
		});
	});
}

function linkReferences($) {
	$(".reference").each((_, el) => {
		const $el = $(el);
		const text = $el.text().trim();
		const link = text.match(/https?:\/\/[^\s]+/);
		if (link) {
			const newHtml = $el.html().replace(link[0], `<a href="${link[0]}">${link[0]}</a>`);
			$el.html(newHtml);
		}
	});

	return $;
}

function addSrText($) {
	$(".table-9 td").each((_, el) => {
		const $el = $(el);
		const className = $el.attr("class");
		if (className === "orange") {
			$el.append('<span class="sr-only">Amber shading</span>');
		} else if (className === "grey") {
			$el.append('<span class="sr-only">Grey shading</span>');
		}
	});

	return $;
}

function findImgs($) {
	$("img").each((_, el) => {
		const $el = $(el);
		const src = $el.attr("src");
		console.log(src);
	});

	return $;
}

function transformBreakoutTables($) {
	$(".table-wrapper:has(.breakout-box-mid-blue)").each((_, table) => {
		const $tableWrapper = $(table);
		const $table = $tableWrapper.find("table.breakout-box-mid-blue");

		// Find the first <td> inside the table
		const $td = $table.find("td").first();
		if ($td.length) {
			// Wrap the contents of <td> inside a div with class breakout-box-mid-blue
			const newDiv = $("<div>").addClass("breakout-box-mid-grey").html($td.html());

			// Replace the table with the new div
			$tableWrapper.replaceWith(newDiv);
		}
	});

	return $;
}

function unwrapBreakoutTables($) {
	$(".table-wrapper .breakout-box-white").each((_, el) => {
		const $el = $(el);
		$el.replaceWith($el.html());
	});

	return $;
}

function addEmptyAlt($) {
	$("img").each((_, el) => {
		const $el = $(el);
		if (!$el.attr("alt")) {
			$el.attr("alt", "");
		}
	});

	return $;
}

function replaceSdgIcons($) {
	$(".sdg-images p").each((_, el) => {
		const text = $(el).text().trim();
		const number = text.split(" ")[0];
		if (!isNaN(number)) {
			const img = `<img src="images/E_SDG_PRINT-${number}.jpg" alt="${text}">`;
			$(el).replaceWith(img);
		}
	});

	return $;
}

function getHeadings($) {
	const toc = $(".table-of-contents");
	const ul = $("<ul class='table-of-contents'></ul>");

	let textNumber = "";
	$("h1, h2, h3").each((_, el) => {
		const $el = $(el);
		const text = $el.text().trim();
		const level = $el.prop("tagName").toLowerCase().substring(1);
		const id = slugify(text);
		$el.attr("id", id);

		// if text starts with a number
		if (/^\d/.test(text)) {
			console.log(textNumber, text);

			const currentNumber = text.split(" ")[0];
			if (currentNumber !== textNumber) {
				// make text title case
				const titleCaseText = text
					.toLowerCase()
					.split(" ")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ");

				let toc = `<li class="toc-${level}"><a href="#${id}">${titleCaseText}</a></li>`;
				if (currentNumber.length === 5) {
					toc = `<li class="toc-4"><a href="#${id}">${titleCaseText}</a></li>`;
				}

				// add to toc
				ul.append(toc);
			}

			textNumber = currentNumber;
		}
	});

	toc.replaceWith(ul);

	return $;
}

function deleteUnusedImages($) {
	const usedImages = new Set();
	$("img").each((_, el) => {
		const $img = $(el);
		const src = $img.attr("src");
		const file = src.split("/").pop();
		usedImages.add(file);
	});

	const allImages = fs.readdirSync("output/6225-civic-precinct-plan/images");
	const unusedImages = allImages.filter((img) => !usedImages.has(img));

	for (const img of unusedImages) {
		const imgPath = `output/6225-civic-precinct-plan/images/${img}`;
		fs.unlink(imgPath, (err) => {
			if (err) {
				console.error(`Error deleting ${imgPath}:`, err);
			} else {
				console.log(`Deleted unused image: ${imgPath}`);
			}
		});
	}

	return $;
}

runCheerio({
	functions: [deleteUnusedImages],
	test: false,
	fromOriginal: false
});

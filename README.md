# How to convert ANROWS documents from Word to HTML

## Step 1: Convert word doc to HTML

1. Copy the Word document to the `input` folder.
2. Rename the Word document to something short, eg. 'ncas-states-and-territories'.
3. Open the `config.mjs` file, and set `projectName` to the same short name.
4. Open a terminal window and do `npm run convert`.

## Step 2: Apply the stylesheet using SASS

1. If the HTML can use the same stylesheet as a previous job, copy the `styles.scss` file from the previous job's output folder to the new output folder.
2. If not, create a new `styles.scss` file in the new output folder.
3. To run the SASS compiler, open a terminal window and do `npm run sass:watch`.
    - This will continuously watch for changes to the `styles.scss` file and compile it to `styles.css`.
4. Use the `Live server` extension in VS Code to view the HTML file with the stylesheet applied.
5. Write your CSS in the `.scss` file. Do not write CSS in the `.css` file.

## Step 3: Upload the images to the ANROWS WordPress site

1. Check the `images` folder to see if the image names include a prefix, eg. `ncas-states-and-territories-image1.jpg`.
2. If it doesn't, open a terminal window and do `npm run prependimages`.
    - This will prepend the project name to all image names in the `images` folder, and update the `index.html` file.
3. Log in to the ANROWS Wordpress admin. Go to 'Media' and click 'Add New Media File' in the LEFT SIDE BAR.
4. Open the `images` folder in your File explorer and drag all the images into the upload area. If you have to wait a while for all the images to upload, you can do Step 4 while you wait.
5. Once all the images are uploaded, right-click and inspect the page.
6. Find `<div id="media-items"> ... </div>` element.
7. Right-click on the element and go to 'Copy' > 'Copy element'.
8. Paste the Element into the `mediaItems.html` file in your project's output folder. Save the file.

## Step 4: Set up the Wordpress page

1. Log in to the ANROWS Wordpress admin.
2. Go to 'Publications' and find the publication that you're doing. (You may find the link to the publication in the Excel spreadsheet);
3. Duplicate the Publication page and go to its edit page.
4. In the right sidebar, find 'Page Attributes' and set the 'Parent' to the publication you're doing.
5. Click 'Save draft'.
6. Next to 'Permalink', click 'Edit' and change the end of URL to 'read'.
7. Click 'Save draft'.
8. Under 'Inner Page With Sidebar', click 'Sidebar'.
9. Delete 'Downloads', 'See also', and 'Support box' layouts.
10. Click 'Add Widget' > 'Table of contents'.
11. Under 'Title', type 'Contents'. Save draft.
12. Under 'Inner Page With Sidebar', click 'Main'.
13. If 'Small Heading' is empty, type in whatever type of document it is, eg. 'Research Report', 'Research Summary', 'Research Brief', etc.
14. Delete everything in the 'Main text'.

## Step 5: Convert the HTML into HTML to insert into WordPress

Make sure you do step 3 before this step.

1. Open a terminal window and do `npm run wordpress`.
    - This will convert the HTML file into a format that can be pasted into the WordPress editor.
2. Open the `wordpress.html` file.
3. Copy the contents of the file.
4. Go back to the Wordpress editor and paste the contents into the 'Main text' area.
5. Click 'Save draft'.
6. Click 'Preview' to see how the page looks.
7. If you need to make style changes, go back to the `styles.scss` file and make the changes. Save the file. Then, repeat steps 1-6 of this step until you're happy with the page.

## Step 6: Finishing off

1. Once you're happy with the page, copy the preview link and paste it into the Excel spreadsheet - this link will be sent to the client.
2. Open the `output` folder in your File explorer.
3. Copy the project folder and paste it into the `Working folder` on the S: drive.

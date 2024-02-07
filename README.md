# Elice Coding Editor Homework

## Purpose

1. The goal of this PA is to implement part of the features of Elice.
2. The main evaluation criteria for this PA will be not only the use of React but also the
   understanding of complex external libraries that are difficult to handle.
3. Development must be done using git, and after working on GitHub (https://github.com), please share the project with the @elice-frontend account and send an email.
4. This PA is for senior engineers. For this project we are not requiring a pixel-perfect CSS.

## Function Requirements

1. At the top, there should be a UI that allows users to upload a file (zip file) and, after editing in the bottom editor, download the modified zip file again (OPTIONAL: Upload via drag-drop is possible).
2. After uploading a file, the contents inside the zip file are displayed as a tree in the left File tree.
3. You may use a library for the UI, but you must write the logic for parsing the zip file and creating the subsequent tree structure yourself.
4. When a file from the left file tree is clicked, its contents are added to a tab and opened in the Monaco editor. Binary files, including images, are displayed directly on the screen. Editable text is shown in the editor.
5. Please write logic to determine whether a file is binary or editable.
6. Files in the Tab can be closed.
7. If there are changes to a file, you can download it by pressing the download button at the top.
8. The Monaco editor should provide undo/redo functionality and be bound to the ctrl(cmd)+z and ctrl(cmd)+shift+z keys.

## Covered features

1. Uploading a zip file and be able to parse this zip file into file tree.
2. Adding a new file and new folder to file tree on the left menu.
3. When clicking on each editable file, user can see the content and edit the content of this file.
4. When click on each binary file such as image files, user can see the image directly.
5. Allow editing multiple files at the same time.
6. Download as a zip file to local.
7. Syntax highlight for the following file extensions: Javascript, Typescript, HTML, CSS, JSON.

## Extra features

8. Simple Unit testing and E2E testing are covered.
9. Highlight selected file or hovered file on the left menu.
10. After creating a new file, automatically open this file's content on the main monaco editor.

## Technologies

- ReactJS.
- Typescript.
- CSS: Styled Component.
- Redux, Redux Toolkit.
- Monaco editor.
- Jest/Cypress.

## Setting up and running locally

1. ### `npm install` : install required dependencies and libraries
2. ### `npm start`: start application locally at [http://localhost:3000](http://localhost:3000)

## Zipping & Unzipping file Explanation

All functional logic related to handling zip & unzip file are implemented inside /src/lib/zip

### Details

- `src/services/zip-reader.ts`: Handling reading a zipped file and output will be a files tree with detail file content.
- `src/services/zip-writer.ts`: Handling Compress the file as a Zip format.
- `src/types/types.ts`: Defining necessary types.
- `src/utils/index.ts`: Including some helper functions.

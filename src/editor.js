import { uploadImage } from "./uploadProcess.js";
// Disable page reload prompt
chrome.storage.local.get(["image"]).then((result) => {
    if (result.image) {
        const image = new Image();
        image.className = 'quick-image-prv';
        image.onload = function () {
            document.getElementById('canvasContainer').appendChild(image);
        };
        image.src = result.image;
        uploadImage('imgur', result);
    } else {
        document.getElementById('qs-heading').innerHTML = '<h2>Oops! Image not found.</h2>';
        document.getElementById('editor-tools-sec').style.display = 'none';
      }
});

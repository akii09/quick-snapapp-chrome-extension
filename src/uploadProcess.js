import { albumHash, clientID } from "./storage/chrome.js";
import { uploadImageToAlbum } from "./imgur/upload.js";
// Uploading process
export function uploadImage(where, imageData){
    if(where === 'imgur') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const pageTitle = tabs[0].title; // Get the title of the current active tab
            uploadImageToAlbum(albumHash, imageData, clientID, pageTitle)
              .then((result) => {
                if (result) {
                //   console.log('Image Uploaded:', result);
                  setToInputField(result.imageUrl) 
                  // Handle the uploaded image URL as needed
                //   Set Image delete hash
                const imageDetails = {
                    imageId: result.imageId,
                    deleteHash: result.deleteHash
                };
                // Store the image details in chrome.storage.local
                chrome.storage.local.set({ imageDetails: imageDetails }, function () {
                    console.log('Image details stored successfully!');
                });
                } else {
                  console.error('Failed to upload image.');
                }
              });
          });
    }
}
function setToInputField(url) {
    document.getElementById('urlInp').setAttribute('value', url);
    var deleteBtn = document.getElementById("deleteBtn");
    deleteBtn.style.display = 'block';
}

var urlInp = document.getElementById("urlInp");
var copy = document.getElementById("copyUrl");
var answer = document.getElementById("copyAnswer");
copy.addEventListener('click', function (e) {
    const textToCopy = urlInp.value;
    // Create a textarea element dynamically to copy the text to the clipboard
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);

    // Select and copy the text
    textarea.select();
    //    urlInp.setSelectionRange(0, 99999);
    try {
        var ok = document.execCommand('copy');
        console.log(ok, 'ok')
        if (ok) answer.innerHTML = 'Copied !';
        else answer.innerHTML = 'Unable to copy!';
    } catch (err) {
        answer.innerHTML = 'Unsupported Browser!';
    }

    setTimeout(() => {
        answer.innerHTML = '';
    }, 2500);
});
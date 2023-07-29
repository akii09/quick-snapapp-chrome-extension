import { albumHash, albumID, userEmail, watermarkName, clientID } from "./storage/chrome.js";
import { uploadImageToAlbum } from "./imgur/upload.js";
import { dataURLtoFile } from "./utils/functions.js";
// Uploading process
export function uploadImage(where, imageData){
    if(where === 'imgur') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const pageTitle = tabs[0].title; // Get the title of the current active tab
            uploadImageToAlbum(albumHash, imageData, clientID, pageTitle)
              .then((result) => {
                if (result) {
                  console.log('Image Uploaded:', result.imageUrl);
                  // Handle the uploaded image URL as needed
                } else {
                  console.error('Failed to upload image.');
                }
              });
          });
    }
}
/**
function uploadImage(imgData) {
      // Create a file input element dynamically
    var file = dataURLtoFile(imgData.image, "screenshot.jpg");

    if (file) {
        chrome.storage.sync.get(["album_id"]).then((result) => {
            if(result.album_id){
                // uploadImageToAlbum('2aa42594970b8f4',result.album_id, file);
                // Usage example:
                const imageData = "data:image/png;base64, ..."; // Replace with the data URL of the image you want to upload
                const albumHash = "wCKmBBD72EqP2Un"; // Replace with the hash of your target album
                // {
                //     "data": {
                //         "id": "LeXjckM",
                //         "deletehash": "wCKmBBD72EqP2Un"
                //     },
                //     "success": true,
                //     "status": 200
                // }
                // Upload the image to the album without authentication
                uploadImageToAlbum(file, albumHash).then((data) => {
                if (data.imageUrl) {
                        setToInputField(data.imageUrl);
                        chrome.storage.local.set({ url: data.imageUrl }).then(() => {
                            console.log('Image uploaded successfully:', data.imageUrl);
                        });
                        const imageDetails = {
                            imageId: data.imageId,
                            deleteHash: data.deleteHash
                        };
                        // Store the image details in chrome.storage.local
                        chrome.storage.local.set({ imageDetails: imageDetails }, function () {
                            console.log('Image details stored successfully!');
                        });
                        console.log('Image uploaded successfully!');
                    }
                });
                
            } else {
                chrome.runtime.openOptionsPage();
                return;
            }
        })
    } else {
        alert("Opps domething went wrong!")
    }
}

async function uploadToImgur(file) {
    const formData = new FormData();
    formData.append('image', file);
    // Get API Key
    let apiKey;
    let clientId;
    chrome.storage.sync.get(["apiKey", "clientID"]).then((result) => {
        if(result.apiKey && result.clientID){
            apiKey = result.apiKey;
            clientId = result.clientID;
        } else {
            chrome.runtime.openOptionsPage();
            return;
        }
    }).then(()=>{
        fetch(apiKey, {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${clientId}`,
            },
            body: formData,
        }).then(response => response.json()).then(data => {
            const imageUrl = data.data.link;
            setToInputField(imageUrl);
            chrome.storage.local.set({ url: imageUrl }).then(() => {
                console.log('Image uploaded successfully:', imageUrl);
            });
            // Do something with the image URL, such as displaying it or sending it to your server
            if (data.success) {
                const imageDetails = {
                    imageId: data.data.id,
                    deleteHash: data.data.deletehash
                };
                // Store the image details in chrome.storage.local
                chrome.storage.local.set({ imageDetails: imageDetails }, function () {
                    console.log('Image details stored successfully!');
                });
                console.log('Image uploaded successfully!');
            } else {
                console.log('Image upload failed.');
            }
        }).catch(error => {
            console.error('Error uploading image:', error);
        });
    });
}

// Upload in album
function uploadImageToAlbum(imageData, albumHash) {
    const apiUrl = `https://api.imgur.com/3/album/${albumHash}/add`;
  
    const formData = new FormData();
    formData.append("image", imageData);
  
    return fetch(apiUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          return {
            imageId: data.data.id,
            deleteHash: data.data.deletehash,
            imageUrl: data.data.link // Return the direct URL of the uploaded image
          } 
        } else {
          console.error("Failed to upload image to album:", data);
          return null;
        }
      })
      .catch((error) => {
        console.error("An error occurred while uploading image to album:", error);
        return null;
      });
  }

function uploadImageToAlbum(clientId, albumId, imageFile) {
    const apiUrl = `https://api.imgur.com/3/image`; // API endpoint to upload an image
    const headers = {
      Authorization: `Client-ID ${clientId}`,
    };
    const formData = new FormData();
    formData.append("album", albumId);
    formData.append("image", imageFile);
  
    return fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
            const imageUrl = data.data.link;
            setToInputField(imageUrl);
            chrome.storage.local.set({ url: imageUrl }).then(() => {
                console.log('Image uploaded successfully:', imageUrl);
            });
            const imageDetails = {
                imageId: data.data.id,
                deleteHash: data.data.deletehash
            };
            // Store the image details in chrome.storage.local
            chrome.storage.local.set({ imageDetails: imageDetails }, function () {
                console.log('Image details stored successfully!');
            });
            console.log('Image uploaded successfully!');
        } else {
          console.error("Failed to upload image to album:", data);
          return null;
        }
      })
      .catch((error) => {
        console.error("An error occurred while uploading the image:", error);
        return null;
      });
  }


function dataURLtoFile(dataURL, fileName) {
    var arr = dataURL.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
}

function setToInputField(url) {
    document.getElementById('urlInp').setAttribute('value', url);
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

**/
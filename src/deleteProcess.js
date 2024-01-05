import { albumHash, clientID } from "./storage/chrome.js";

var deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener('click', function (e) {
  proceedDeleteImage();
});

function proceedDeleteImage() {
  // Retrieve image details from chrome.storage.local
  chrome.storage.local.get(['imageDetails'], function (result) {
    console.log(result, 'imageDetails')
    if (result.imageDetails) {
      const { imageId, deleteHash } = result.imageDetails;
      deleteImage(imageId, deleteHash);
    } else {
      console.log('No image details found.');
    }
  });
}

// Delete function using Imgur API
function deleteImage(imageId, deleteHash) {
  const apiUrl = `https://api.imgur.com/3/image/${deleteHash}`;
  console.log(clientID, 'clientID')
  const headers = {
    Authorization: `Client-ID ${clientID}`
  };

  fetch(apiUrl, {
    method: 'DELETE',
    headers: {
      Authorization: `Client-ID ${clientID}`
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Image deleted successfully!');
        const canvasContainer = document.getElementById('canvasContainer');
        canvasContainer.textContent = 'Image deleted';
        // Delete image
        chrome.storage.local.remove(["image", 'url'], function () {
          var error = chrome.runtime.lastError;
          if (error) {
            console.error(error);
          }
        });
        document.getElementById('qs-heading').innerHTML = '<h2>Oops! Image not found.</h2>';
        document.getElementById('editor-tools-sec').style.display = 'none';
      } else {
        console.log('Image deletion failed.');
      }
    })
    .catch(error => {
      console.error('An error occurred during image deletion:', error);
    });
}

document.querySelector('.openDashboard').addEventListener('click', openDashboardPage);

function openDashboardPage() {
  window.open("https://quicksnap.akashpise.tech/login/", "_blank");
}
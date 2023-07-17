var deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener('click', function (e) {
    proceedDeleteImage();
});

function proceedDeleteImage(){
    // Retrieve image details from chrome.storage.local
chrome.storage.local.get(['imageDetails'], function(result) {
    console.log(result, 'imageDetails')
  if (result.imageDetails) {
    const { imageId, deleteHash } = result.imageDetails;
    const clientId = '2aa42594970b8f4'; // Replace with your Imgur client ID

    // Call the deleteImage function with the retrieved image details
    deleteImage(imageId, deleteHash, clientId);
  } else {
    console.log('No image details found.');
  }
});
}

// Delete function using Imgur API
function deleteImage(imageId, deleteHash, clientId) {
    const apiUrl = `https://api.imgur.com/3/image/${imageId}`;
    const headers = {
      Authorization: `Client-ID ${clientId}`
    };
  
    fetch(apiUrl, {
      method: 'DELETE',
      headers: headers
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Image deleted successfully!');
        const canvasContainer = document.getElementById('canvasContainer');
        canvasContainer.textContent = 'Image deleted';
      } else {
        console.log('Image deletion failed.');
      }
    })
    .catch(error => {
      console.error('An error occurred during image deletion:', error);
    });
  }
  
// const ImageKit = require("imagekit-javascript")


document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('captureBtn').addEventListener('click', captureScreenshot);
  document.getElementById('settingsIcon').addEventListener('click', openOptionsPage);
});

// Open option page
function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}

function captureScreenshot() {
  chrome.storage.local.remove(["image"],function(){
    var error = chrome.runtime.lastError;
       if (error) {
           console.error(error);
       }
   })

  chrome.tabs.captureVisibleTab(null, { format: 'png' }, function(dataUrl) {
    openEditorPage(dataUrl);
  });
}

function openEditorPage(dataUrl) {
  chrome.storage.local.set({ image: dataUrl }).then(() => {
    console.log("Value is set");
    chrome.tabs.create({ url: './views/editor.html' }, function(tab) {
      chrome.storage.local.set({ image: dataUrl }).then(() => {
        console.log("Value is set");
      }); 
    });
  });
}


// function uploadImage() {
//   // Replace 'YOUR_CLIENT_ID' with your actual Imgur API client ID
//   const clientId = '2aa42594970b8f4';

//   // Create a file input element dynamically
//   const input = document.createElement('input');
//   input.type = 'file';
//   input.accept = 'image/*';
//   input.addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (file) {
//       uploadToImgur(file, clientId);
//     }
//   });
//   input.click();
// }

// function uploadToImgur(file, clientId) {
//   const formData = new FormData();
//   formData.append('image', file);

//   fetch('https://api.imgur.com/3/image', {
//     method: 'POST',
//     headers: {
//       Authorization: `Client-ID ${clientId}`,
//     },
//     body: formData,
//   })
//     .then(response => response.json())
//     .then(data => {
//       const imageUrl = data.data.link;
//       console.log('Image uploaded successfully:', imageUrl);
//       // Do something with the image URL, such as displaying it or sending it to your server
//     })
//     .catch(error => {
//       console.error('Error uploading image:', error);
//     });
// }

// function uploadImage() {
//   // Replace 'YOUR_FILESTACK_API_KEY' with your actual Filestack API key
//   const apiKey = 'AuBS4ycpfQ26SkxZYBHfcz';

//   // Initialize Filestack client
//   const client = filestack.init(apiKey);

//   // Options for file upload
//   const options = {
//     onUploadDone: handleUploadDone,
//     onUploadError: handleUploadError,
//     onFileUploadFailed: handleUploadFailed,
//     accept: 'image/*', // Specify that only image files can be selected
//     maxFiles: 1, // Limit the picker to select a maximum of 1 file
//   };

//   // Open file picker for image selection
//   client.picker(options).open();
// }

// function handleUploadDone(result) {
//   console.log('File uploaded successfully:', result);
//   // Retrieve the uploaded image URL from the result object and use it as needed
//   const imageUrl = result.filesUploaded[0].url;
//   // Do something with the image URL, such as displaying it or sending it to your server
// }

// function handleUploadError(error) {
//   console.error('Error uploading file:', error);
// }

// function handleUploadFailed(file, error) {
//   console.error('File upload failed:', file, error);
// }

// // Initialize Image KIT
// var imagekit = new ImageKit({
//   publicKey: "public_X4h8Qsq4X/0cBfUxxaCArqLA2K4=",
//   urlEndpoint: "https://ik.imagekit.io/jmzec5j7b",
//   authenticationEndpoint: "http://www.yourserver.com/auth",
// });

// function upload(data) {
//   var file = dataURLtoFile(data, "screenshot.jpg"); // Convert the data URL to a file object
//   imagekit.upload({
//     file: file,
//     fileName: "abc1.jpg",
//     tags: ["tag1"],
//   }, function(err, result) {
//     if (err) {
//       console.error('Error uploading image:', err);
//     } else {
//       console.log('Image uploaded successfully:', result);
//       console.log(imagekit.url({
//         src: result.url,
//         transformation: [{ height: 300, width: 400 }]
//       }));
//     }
//   });
// }

// // Helper function to convert data URL to a file object
// function dataURLtoFile(dataURL, fileName) {
//   var arr = dataURL.split(',');
//   var mime = arr[0].match(/:(.*?);/)[1];
//   var bstr = atob(arr[1]);
//   var n = bstr.length;
//   var u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], fileName, { type: mime });
// }

// function uploadScreenshot(dataUrl) {
//   console.log(dataUrl, 'dataUrl')
//   // Get the API key and other settings from storage
//   chrome.storage.sync.get(['apiKey', 'watermark', 'secretKey'], function(items) {
//     // Make the API request to upload the screenshot
//     // Replace <endpoint> with your actual endpoint URL
//     fetch('<endpoint>', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': items.apiKey
//       },
//       body: JSON.stringify({
//         screenshot: dataUrl,
//         watermark: items.watermark,
//         secretKey: items.secretKey
//       })
//     })
//     .then(response => {
//       // Handle the response
//       if (response.ok) {
//         console.log('Screenshot uploaded successfully');
//       } else {
//         console.error('Error uploading screenshot:', response.statusText);
//       }
//     })
//     .catch(error => {
//       console.error('Error uploading screenshot:', error);
//     });
//   });
// }


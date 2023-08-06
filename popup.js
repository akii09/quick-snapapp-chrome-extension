document.addEventListener('DOMContentLoaded', function() {
  // Add click event listeners to the capture button and settings icon
  document.getElementById('captureBtn').addEventListener('click', captureScreenshot);
  document.getElementById('settingsIcon').addEventListener('click', openOptionsPage);
  document.getElementById('openDashboard').addEventListener('click', openDashboardPage);
});

// Open options page
function openOptionsPage() {
  // Open the options page using the Chrome runtime API
  chrome.runtime.openOptionsPage();
}
function openDashboardPage() {
  window.open("https://quicksnap-5a79a.web.app/", "_blank");
}

function captureScreenshot() {
  // Remove the previously stored image and URL from local storage
  chrome.storage.local.remove(["image", "url"], function() {
    var error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });

  // Capture the visible tab as a PNG image
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, function(dataUrl) {
    // Get the watermark text from storage
    chrome.storage.sync.get(["watermark_name"], function(result) {
      // Set the default watermark text if not found in storage
      let printWM = 'QuickSnap';
      if (result.watermark_name) {
        printWM = result.watermark_name;
      }

      // Add the text watermark to the captured image
      addTextWatermark(dataUrl, printWM, function(watermarkedImage) {
        // Open the editor page with the watermarked image
        openEditorPage(watermarkedImage);
      });
    });
  });
}

function addTextWatermark(imageSrc, watermarkText, callback) {
  const image = new Image();
  image.crossOrigin = "Anonymous"; // Enable cross-origin access to the image

  image.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const fontSize = Math.floor(image.width / 65);
    const fontFamily = 'Arial';
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

    const textX = image.width - 10; // Adjust the X position for padding from the right edge
    const textY = image.height - 10; // Adjust the Y position for padding from the bottom edge
    ctx.fillText(watermarkText, textX, textY);

    const watermarkedImage = canvas.toDataURL('image/png');
    callback(watermarkedImage);
  };

  image.src = imageSrc;
}

function openEditorPage(dataUrl) {
  chrome.storage.local.set({ image: dataUrl }, function() {
    // Log a message when the value is successfully set in local storage
    console.log("Value is set");

    // Create a new tab with the editor page URL and pass the image data URL to it
    chrome.tabs.create({ url: './views/editor.html' }, function(tab) {
      // Set the image data URL in local storage for the editor page to access
      chrome.storage.local.set({ image: dataUrl }, function() {
        // Log a message when the value is successfully set in local storage
        console.log("Value is set");
      });
    });
  });
}

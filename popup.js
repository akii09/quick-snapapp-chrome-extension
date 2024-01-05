document.addEventListener('DOMContentLoaded', function() {
  // Add click event listeners to the capture button and settings icon
  document.getElementById('captureBtn').addEventListener('click', captureScreenshot);
  // document.getElementById('selectBtn').addEventListener('click', captureAreaScreenshot);
  document.getElementById('settingsIcon').addEventListener('click', openOptionsPage);
  document.getElementById('openDashboard').addEventListener('click', openDashboardPage);
});

// Open options page
function openOptionsPage() {
  // Open the options page using the Chrome runtime API
  chrome.runtime.openOptionsPage();
}
function openDashboardPage() {
  window.open("https://quicksnap.akashpise.tech/login/", "_blank");
}

function captureScreenshot() {
  // First check user had created an account or not
  chrome.storage.sync.get(["user_email"]).then((result) => {
    if (result.user_email) {
      // User has created an account
      // Capture the visible tab as a PNG image
      captureVisibleTab();
    } else {
      // User has not created an account
      // Open the options page to let the user create an account
      openOptionsPage();
      const alertElement = document.getElementById('alert');
      if (alertElement) {
        alertElement.style.display = 'block';
      }
      return;
    }
  });

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

  // Selected area

  function captureAreaScreenshot() {
    // Remove the previously stored image and URL from local storage
    chrome.storage.local.remove(["image", "url"], function() {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
  
    // Inject a content script into the current tab to handle the area selection
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: startAreaSelection
      });
    });
  }
  
  function startAreaSelection() {
    var selection = document.createElement("div");
    selection.style.position = "absolute";
    selection.style.border = "2px solid red";
    selection.style.background = "rgba(255, 0, 0, 0.2)";
    document.body.appendChild(selection);
  
    var startX, startY;
  
    document.addEventListener("mousedown", function(e) {
      startX = e.clientX;
      startY = e.clientY;
  
      selection.style.left = startX + "px";
      selection.style.top = startY + "px";
      selection.style.width = "0";
      selection.style.height = "0";
      selection.style.display = "block";
    });
  
    document.addEventListener("mousemove", function(e) {
      if (startX === undefined || startY === undefined) return;
  
      var currentX = e.clientX;
      var currentY = e.clientY;
  
      var width = currentX - startX;
      var height = currentY - startY;
  
      selection.style.width = width + "px";
      selection.style.height = height + "px";
    });
  
    document.addEventListener("mouseup", function(e) {
      var endX = e.clientX;
      var endY = e.clientY;
  
      var left = Math.min(startX, endX);
      var top = Math.min(startY, endY);
      var width = Math.abs(endX - startX);
      var height = Math.abs(endY - startY);
  
      captureSelectedArea(left, top, width, height);
    });
  
    function captureSelectedArea(left, top, width, height) {
      // Capture the selected area as a PNG image
      chrome.scripting.captureVisibleTab(null, { format: 'png' }, function(dataUrl) {
        // Crop the captured image to the selected area
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
  
        var image = new Image();
        image.src = dataUrl;
        image.onload = function() {
          ctx.drawImage(image, left, top, width, height, 0, 0, width, height);
  
          // Convert the cropped area to a data URL (PNG format)
          var croppedDataUrl = canvas.toDataURL('image/png');
  
          // Remove the selection div from the page
          selection.remove();
  
          // Get the watermark text from storage
          chrome.storage.sync.get(["watermark_name"], function(result) {
            // Set the default watermark text if not found in storage
            let printWM = 'QuickSnap';
            if (result.watermark_name) {
              printWM = result.watermark_name;
            }
  
            // Add the text watermark to the captured image
            addTextWatermark(croppedDataUrl, printWM, function(watermarkedImage) {
              // Open the editor page with the watermarked image
              openEditorPage(watermarkedImage);
            });
          });
        };
      });
    }
  }


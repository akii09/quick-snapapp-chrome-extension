// let color = '#3aa757';

// chrome.runtime.onInstalled.addListener(()=>{
//     chrome.storage.sync.set({color: color}, ()=>{
//         chrome.storage.sync.set({ color });
//         console.log('Default background color set to %cgreen', `color: ${color}`);
//     });
// });

// Initialize the Google API client
function init() {
    var api_key = "YOUR_API_KEY";
    var discovery_docs = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
    var scopes = "https://www.googleapis.com/auth/drive";
    gapi.client.init({
      apiKey      : api_key,
      discoveryDocs: discovery_docs,
      clientId: chrome.runtime.getManifest().oauth2.client_id,
      scope: scopes
    }).then(function() {
      console.log("Google API client initialized");
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log("Received OAuth2 access token:", token);
        gapi.auth.setToken({
          access_token: token
        });
      });
    }, function(error) {
      console.error("Error initializing Google API client:", error);
    });
  }
 
  // Take a screenshot of the current tab and upload it to Google Drive
  function takeScreenshot() {
    chrome.tabs.captureVisibleTab(null, {format: "png"}, function(imageData) {
      console.log("Captured screenshot:", imageData);
      var metadata = {
        name: "Screenshot.png"
      };
      var base64Data = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
      var data = {
        data: base64Data,
        mimeType: "image/png",
        uploadType: "media"
      };
      gapi.client.drive.files.create({
        resource: metadata,
        media: data,
        fields: "id,webViewLink"
      }).then(function(response) {
        console.log("Uploaded screenshot to Google Drive:", response);
        var shareLink = "https://drive.google.com/open?id=" + response.result.id;
        chrome.tabs.create({url: shareLink});
      }, function(error) {
        console.error("Error uploading screenshot to Google Drive:", error);
      });
    });
  }
 
  // Authorize the user and initialize the Google API client
  function authorize() {
    gapi.load("client:auth2", function() {
      gapi.auth2.init({
        client_id: chrome.runtime.getManifest().oauth2.client_id,
        scope: chrome.runtime.getManifest().oauth2.scopes.join(" ")
      }).then(function() {
        console.log("Google API client authorized");
        init();
      }, function(error) {
        console.error("Error authorizing Google API client:", error);
      });
    });
  }
 
  // Add a click listener to the browser action icon
  chrome.browserAction.onClicked.addListener(function(tab) {
    authorize();
    takeScreenshot();
  });

//   Replace `YOUR_API_KEY` with your actual API key, which you can obtain from the Google Cloud Console.
 
  
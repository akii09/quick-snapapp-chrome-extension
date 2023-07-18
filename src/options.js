document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
  
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
  });
  
  function loadSettings() {
    // Get the stored settings and populate the input fields
    chrome.storage.sync.get(['apiKey', 'watermark', 'clientID'], function(items) {
      document.getElementById('apiKey').value = items.apiKey || '';
      document.getElementById('watermark').value = items.watermark || '';
      document.getElementById('clientID').value = items.clientID || '';
    });
  }
  
  function saveSettings() {
    // Get the input values
    var apiKey = document.getElementById('apiKey').value;
    var watermark = document.getElementById('watermark').value;
    var clientID = document.getElementById('clientID').value;
  
    // Save the settings to storage
    chrome.storage.sync.set({
      'apiKey': apiKey,
      'watermark': watermark,
      'clientID': clientID
    }, function() {
      alert('Settings saved');
    });
  }
  
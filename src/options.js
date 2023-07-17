document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
  
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
  });
  
  function loadSettings() {
    // Get the stored settings and populate the input fields
    chrome.storage.sync.get(['apiKey', 'watermark', 'secretKey'], function(items) {
      document.getElementById('apiKey').value = items.apiKey || '';
      document.getElementById('watermark').value = items.watermark || '';
      document.getElementById('secretKey').value = items.secretKey || '';
    });
  }
  
  function saveSettings() {
    // Get the input values
    var apiKey = document.getElementById('apiKey').value;
    var watermark = document.getElementById('watermark').value;
    var secretKey = document.getElementById('secretKey').value;
  
    // Save the settings to storage
    chrome.storage.sync.set({
      'apiKey': apiKey,
      'watermark': watermark,
      'secretKey': secretKey
    }, function() {
      console.log('Settings saved');
    });
  }
  
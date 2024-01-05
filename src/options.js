import { createAlbum } from "./supabase/createUser.js";

document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    // Check user account is created or not
    chrome.storage.sync.get(["user_email"]).then((result) => {
      if (!result.user_email) {
        const alertElement = document.getElementById('alert');
        if (alertElement) {
          alertElement.style.display = 'block';
          // Hide the alert after 5 seconds
          setTimeout(function() {
            alertElement.style.display = 'none';
          }, 5000);
        }
      }
    });
  });
  
  function loadSettings() {
    // Get the stored settings and populate the input fields
    chrome.storage.sync.get(['user_email', 'watermark_name', 'album_name', 'album_id'], function(items) {
      document.getElementById('user_email').value = items.user_email || '';
      document.getElementById('watermark_name').value = items.watermark_name || '';
      document.getElementById('album_name').value = items.album_name || '';
      document.getElementById('token').value = items.album_id || 'NA';
    });
  }
  
  function saveSettings() {
    // Get the input values
    var user_email = document.getElementById('user_email').value;
    var watermark_name = document.getElementById('watermark_name').value;
    var album_name = document.getElementById('album_name').value;
    if(user_email &&
      album_name) {
        if(validEmail(user_email)) {
           // Create user in Supabase
          const settings_data = {
            clientID: '592d7cf9cad8076',
            album_name,
            watermark_name,
            user_email,
            album_desc: 'Created by QuickSnap Chrome Extension'
          }
          createAlbum(settings_data);
          // Save the settings to storage
        } else {
          alert('Please enter valid email');
        }
      } else {
        alert('Please enter required fields');
      }
  }

function validEmail(email){
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

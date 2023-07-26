import { createAlbum } from "./supabase/createUser.js";

document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
  });
  
  function loadSettings() {
    // Get the stored settings and populate the input fields
    chrome.storage.sync.get(['user_email', 'watermark_name', 'album_name'], function(items) {
      document.getElementById('user_email').value = items.user_email || '';
      document.getElementById('watermark_name').value = items.watermark_name || '';
      document.getElementById('album_name').value = items.album_name || '';
    });
  }
  
  function saveSettings() {
    // Get the input values
    var user_email = document.getElementById('user_email').value;
    var watermark_name = document.getElementById('watermark_name').value;
    var album_name = document.getElementById('album_name').value;
    if(user_email &&
      album_name) {
        // Create user in Supabase
        const settings_data = {
          clientID: '2aa42594970b8f4',
          album_name,
          watermark_name,
          user_email,
          album_desc: 'Created by QuickSnap Chrome Extension'
        }
        createAlbum(settings_data);
        // Save the settings to storage
      } else {
        alert('Please enter required fields');
      }
  }
  
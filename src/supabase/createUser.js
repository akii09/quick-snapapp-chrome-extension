const API_URL = "https://jqamqmqvaprltjzxvpap.supabase.co/rest/v1/Albums";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxYW1xbXF2YXBybHRqenh2cGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzOTA1MTgsImV4cCI6MjAwNTk2NjUxOH0.5mAc-DzsfmYienAyxjLeOUie58Nbm6aC-rCky8sRhTc";

// Create User
async function createUser(settings_data, albumID) {
  delete settings_data.album_desc;
  delete settings_data.clientID;
  settings_data.album_id = albumID;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
      body: JSON.stringify(settings_data),
    }).then((res=>{
      if(res.code === "23505"){
        alert("This Email is already exist !")
        // Now we can get user data from here
      } else {
        chrome.storage.sync.set({
          'user_email': settings_data.user_email,
          'watermark_name': settings_data.watermark_name,
          'album_name': settings_data.album_name,
          'album_id': albumID
          }, function() {
          alert('Settings saved');
      });
      }
    }));

    if (!response.ok) {
      throw new Error("Insertion failed");
    }

    const responseData = await response.json();
    console.log("Data inserted successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

export async function getUsers() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Fetching data failed");
    }

    const responseData = await response.json();
    console.log("Data fetched successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


// Function to create a new album (gallery)
export function createAlbum(settings_data) {
  const apiUrl = "https://api.imgur.com/3/album"; // API endpoint to create an album
  const headers = {
    Authorization: `Client-ID ${settings_data.clientID}`,
  };
  const formData = new FormData();
  formData.append("title", settings_data.album_name);
  formData.append("description", settings_data.album_desc);

  return fetch(apiUrl, {
    method: "POST",
    headers: headers,
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        createUser(settings_data, data.data.id);
        // return data.data.id; // Return the album ID of the newly created album
      } else {
        console.error("Failed to create album:", data);
        return null;
      }
    })
    .catch((error) => {
      console.error("An error occurred while creating the album:", error);
      return null;
    });
}
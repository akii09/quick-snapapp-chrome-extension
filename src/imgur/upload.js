import { dataURLtoFile } from "../utils/functions.js";
// Function to upload an image to an Imgur album
export async function uploadImageToAlbum(albumDeleteHash, imgData, clientId, pageTitle) {
    const apiUrl = `https://api.imgur.com/3/image`;
    const file = dataURLtoFile(imgData.image, `${pageTitle}.jpg`);
    console.log(file, 'file')
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("album", albumDeleteHash); // Add the album delete hash to the request body
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        console.log('Image Uploaded done', data)
        return {
          imageId: data.data.id,
          deleteHash: data.data.deletehash,
          imageUrl: data.data.link, // Return the direct URL of the uploaded image
        };
      } else {
        console.error("Failed to upload image:", data);
        return null;
      }
    } catch (error) {
      console.error("An error occurred during image upload:", error);
      return null;
    }
}

const getAlbumID = () => {
  return chrome.storage.sync.get(["album_id"]).then((result) => {
    return result.album_id;
  });
};

const getAlbumHash = () => {
  return chrome.storage.sync.get(["album_delete_hash"]).then((result) => {
    return result.album_delete_hash;
  });
};

const getUserEmail = () => {
  return chrome.storage.sync.get(["user_email"]).then((result) => {
    return result.user_email;
  });
};

const getWatermarkName = () => {
  return chrome.storage.sync.get(["watermark_name"]).then((result) => {
    return result.watermark_name;
  });
};

export const albumID = await getAlbumID();
export const albumHash = await getAlbumHash();
export const userEmail = await getUserEmail();
export const watermarkName = await getWatermarkName();
console.log(albumHash,albumID,watermarkName, 'albumHash')
export const clientID = '592d7cf9cad8076';
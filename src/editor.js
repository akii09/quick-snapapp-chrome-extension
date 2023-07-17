chrome.storage.local.get(["image"]).then((result) => {
    // console.log("Value currently is " + result.image);
    if (result.image) {
        const image = new Image();
        image.className = 'quick-image-prv';
        image.onload = function () {
            document.getElementById('canvasContainer').appendChild(image);
        };
        image.src = result.image;
        uploadImage(result);
    }
});

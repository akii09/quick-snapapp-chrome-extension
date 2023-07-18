function uploadImage(imgData) {
    processUploading(imgData);
    return;
    chrome.storage.local.get(["image"]).then((result) => {
        if (result.image === imgData.image) {
            chrome.storage.local.get(["url"]).then((img) => {
                console.log(img, 'pp')
                setToInputField(img.url)
            });
        } else {
        }
    });
}

function processUploading(imgData) {
    // Replace 'YOUR_CLIENT_ID' with your actual Imgur API client ID
    // const clientId = '2aa42594970b8f4';

    // Create a file input element dynamically
    var file = dataURLtoFile(imgData.image, "screenshot.jpg");

    console.log(file, 'file')
    if (file) {
        uploadToImgur(file);
    }
}

async function uploadToImgur(file) {
    const formData = new FormData();
    formData.append('image', file);
    // Get API Key
    let apiKey;
    let clientId;
    chrome.storage.sync.get(["apiKey", "clientID"]).then((result) => {
        if(result.apiKey && result.clientID){
            apiKey = result.apiKey;
            clientId = result.clientID;
        } else {
            chrome.runtime.openOptionsPage();
            return;
        }
    }).then(()=>{
        fetch(apiKey, {
            method: 'POST',
            headers: {
                Authorization: `Client-ID ${clientId}`,
            },
            body: formData,
        }).then(response => response.json()).then(data => {
            const imageUrl = data.data.link;
            setToInputField(imageUrl);
            chrome.storage.local.set({ url: imageUrl }).then(() => {
                console.log('Image uploaded successfully:', imageUrl);
            });
            // Do something with the image URL, such as displaying it or sending it to your server
            if (data.success) {
                const imageDetails = {
                    imageId: data.data.id,
                    deleteHash: data.data.deletehash
                };
                // Store the image details in chrome.storage.local
                chrome.storage.local.set({ imageDetails: imageDetails }, function () {
                    console.log('Image details stored successfully!');
                });
                console.log('Image uploaded successfully!');
            } else {
                console.log('Image upload failed.');
            }
        })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    });
}


function dataURLtoFile(dataURL, fileName) {
    var arr = dataURL.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
}

function setToInputField(url) {
    document.getElementById('urlInp').setAttribute('value', url);
}

var urlInp = document.getElementById("urlInp");
var copy = document.getElementById("copyUrl");
var answer = document.getElementById("copyAnswer");
copy.addEventListener('click', function (e) {
    const textToCopy = urlInp.value;
    // Create a textarea element dynamically to copy the text to the clipboard
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);

    // Select and copy the text
    textarea.select();
    //    urlInp.setSelectionRange(0, 99999);
    try {
        var ok = document.execCommand('copy');
        console.log(ok, 'ok')
        if (ok) answer.innerHTML = 'Copied !';
        else answer.innerHTML = 'Unable to copy!';
    } catch (err) {
        answer.innerHTML = 'Unsupported Browser!';
    }

    setTimeout(() => {
        answer.innerHTML = '';
    }, 2500);
});
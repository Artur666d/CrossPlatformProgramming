var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

var deferredPrompt;
if ("serviceWorker" in navigator) {
 navigator.serviceWorker.register("/sw.js").then(function() {
 console.log("Service worker зарегистрирован!");
 });
}
window.addEventListener("beforeinstallprompt", function(event) 
{
 console.log("beforeinstallprompt отменен");
 event.preventDefault();
 deferredPrompt = event;
 return false;
});

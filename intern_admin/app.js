// ********************* //
// ****** CLASSES ****** //
// ********************* //

function randomString(){
  return Math.random().toString(36).substring(7);
}

// Object List
function initializePageContent(){
  firebase.database().ref().once("value", function(snap){
    var key = Object.keys(snap.val())[0];
    pageContent = new PageContent(key);
  });
};

function PageContent(key){
  this.initializeWithKey(key);
  this.loadExistingContent();
  this.initializeSaveButton(key);
};
PageContent.prototype.initializeWithKey = function(key){
  // Get the subfolder with the given key
  this.database_parent = firebase.database().ref(key);
};
PageContent.prototype.loadExistingContent = function(){
  // Get the `body` property and add it to the text editor
  this.database_parent.once('value', function(snapshot){
    console.log(snapshot.val());
    document.getElementById("edit").classList.remove('hidden');
    tinymce.activeEditor.setContent(snapshot.val().body);
    prependServerURLtoEditorImages();
  });
};
PageContent.prototype.initializeSaveButton = function(key){
  document.getElementById('input_submit').onclick = function(){
    firebase.database().ref(key).update({
      body: tinymce.activeEditor.getContent()
    });
    initializePageContent();
    document.getElementById('input_submit_confirmation').classList.remove('hidden');
    setTimeout(function(){
      document.getElementById('input_submit_confirmation').classList.add('hidden');
    }, 5000);
  }
};

// Prepend URL to images in textarea and titelimage
function prependServerURL(img_element){
  var server_url = "/";
  img_element.src = img_element.src.replace(/.*(?=uploads\/)/, server_url);
};

function prependServerURLtoEditorImages(){
  for (image_element of tinymce.activeEditor.selection.getNode().querySelectorAll('img')) {
    prependServerURL(image_element);
  }
};

var pageContent;
window.onload = function(){
  // Firebase authantication
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      if(typeof pageContent == "undefined"){
        // Toggle views
        document.querySelector('main').classList.remove('hidden');
        document.getElementById('require_login').classList.add('hidden');
        // Get pageContent from firebase
        initializePageContent();
      }
    } else {
      document.getElementById('require_login').classList.remove('hidden');
      document.querySelector('main').classList.add('hidden');
    }
  });
  // Textarea initialize
  tinymce.init({
    selector:'textarea',
    menubar: false,
    toolbar: "undo redo | bold italic underline | removeformat | alignleft aligncenter alignright bullist numlist outdent indent | link image media",
    height: 300,
    plugins: "image link media",
    image_prepend_url: "http://gentle-raven.cloudvent.net/"
  });

  // Listen: Admin access
  document.getElementById('admin_access_submit').onclick = function(){
    var password = document.getElementById('admin_access_pw').value;
    firebase.auth().signInWithEmailAndPassword('admin_access@bioprojet.de', password).then(function(){
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  };
}

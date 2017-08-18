// ********************* //
// ****** CLASSES ****** //
// ********************* //

function randomString(){
  return Math.random().toString(36).substring(7);
}

// Object List
function initializeObjectList(){
  document.getElementById("list").innerHTML = "";
  firebase.database().ref().once("value", function(snap){
    var key = Object.keys(snap.val())[0];
    list = new ObjectList("list", key);
  });
};

function ObjectList(name, key){
  this.name = name;
  this.html_parent = document.getElementById(name);

  this.initializeWithKey(key);
  this.getOnceAndAppend();
  this.initializeSaveButton(key);
  this.initializeDeleteButton(key);
};
ObjectList.prototype.initializeWithKey = function(key){
  this.database_parent = firebase.database().ref(key);
};
ObjectList.prototype.getOnceAndAppend = function(){
  var object_name = this.name,
      html_parent = this.html_parent;

  this.database_parent.child('product_list').once('value', function(snapshot){
    snapshot.forEach(function(child_s){
      var element = new ListItem(child_s.val(), object_name, child_s.key);
      // console.log(object_name);
      html_parent.appendChild(element);
    });
    html_parent.appendChild(new ListItem({
      name: "",
      bild_url: "",
      beschreibung: ""
    }, object_name, randomString()));
  });
};
ObjectList.prototype.initializeSaveButton = function(key){
  document.getElementById('input_submit').onclick = function(){
    firebase.database().ref(key + '/product_list').child(document.getElementById('input_id').value).update({
      name: document.getElementById('input_name').value,
      bild_url: document.getElementById('input_bild').value,
      beschreibung: tinymce.activeEditor.getContent()
    });
    initializeObjectList();
    document.getElementById('input_submit_confirmation').classList.remove('hidden');
    setTimeout(function(){
      document.getElementById('input_submit_confirmation').classList.add('hidden');
    }, 5000);
  }
};
ObjectList.prototype.initializeDeleteButton = function(key){
  document.getElementById('input_delete').onclick = function(){
    var are_you_sure = confirm("Der Löschvorgang ist permanent und kann nicht rückgängig gemacht werden! Bist du sicher, du willst dieses Produkt löschen?");
    if (are_you_sure) {
      firebase.database().ref(key + '/product_list').child(document.getElementById('input_id').value).remove();
      document.getElementById('edit').classList.add('hidden');
      initializeObjectList();
      alert("Produkt erfolgreich entfernt.");
    }
  }
};

// Object
function ListItem(item_data, id, parent_key){
  this.element = document.createElement('div');
  // Include content
  this.html_content = (item_data.name.length < 1) ? document.createTextNode("+ Neues Produkt") : document.createTextNode(item_data.name);
  this.element.appendChild(this.html_content);
  // Set ID
  this.element_id = id + "_" + item_data.name.toLowerCase();
  this.element.setAttribute("id", this.element_id);
  // Set onClick EventListener
  this.element.onclick = function() {
    document.getElementById('edit').classList.remove('hidden');
    document.getElementById('input_name').value = item_data.name;
    document.getElementById('input_id').value = parent_key;
    document.getElementById('input_bild').value = item_data.bild_url;
    document.getElementById('input_bild_current').src = item_data.bild_url;
    prependServerURL(document.getElementById('input_bild_current'));
    tinymce.activeEditor.setContent(item_data.beschreibung);
    prependServerURLtoEditorImages();
  };

  return this.element;
}

// Prepend URL to images in textarea and titelimage
function prependServerURL(img_element){
  var server_url = "http://gentle-raven.cloudvent.net/";
  img_element.src = img_element.src.replace(/.*(?=uploads\/)/, server_url);
};

function prependServerURLtoEditorImages(){
  for (image_element of tinymce.activeEditor.selection.getNode().querySelectorAll('img')) {
    prependServerURL(image_element);
  }
};

var list;
window.onload = function(){
  // Firebase authantication
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      if(typeof list == "undefined"){
        // Toggle views
        document.querySelector('main').classList.remove('hidden');
        document.getElementById('require_login').classList.add('hidden');
        // Get content from firebase
        initializeObjectList();
      }
    } else {
      document.getElementById('require_login').classList.remove('hidden');
      document.querySelector('main').classList.add('hidden');
    }
  });
  // Update Image on input_bild change
  document.getElementById('input_bild').addEventListener("focusout", function(){
    document.getElementById('input_bild_current').src = document.getElementById('input_bild').value;
    prependServerURL(document.getElementById('input_bild_current'));
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

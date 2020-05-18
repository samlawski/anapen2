// Initialize Firebase
var config = {
  apiKey: "AIzaSyDkOT5kb42Olm6_54TBVRErqseT_hqZNGw",
  authDomain: "anapen2-88bb5.firebaseapp.com",
  databaseURL: "https://anapen2-88bb5.firebaseio.com",
  projectId: "anapen2-88bb5",
  storageBucket: "anapen2-88bb5.appspot.com",
  messagingSenderId: "662667251692"
};
firebase.initializeApp(config);

// Check if parameter from DocCheck exist
if(typeof getUrlParameter('key') != "undefined"){
  sessionStorage.doccheck_key = getUrlParameter("key");
  window.history.replaceState('produkte-login', 'Produkte', '/intern');
};

// Append DocCheck login form
function appendLoginForm(){
  $('.intern__content').html(
    '<div class="text-center">' +
      '<div class="lead">Die folgenden Inhalte sind nur für Ärzte und Apotheker zugänglich. Bitte loggen Sie sich ein und/oder klicken Sie auf "Weiter", um die Inhalte sehen zu können.</div>' +
      '<iframe align="center" frameborder="0" scrolling="no" width="311" height="188" name="dc_login_iframe" id="dc_login_iframe" src="https://login.doccheck.com/code/de/2000000014225/login_xl/" ><a href="https://login.doccheck.com/code/de/2000000014225/login_xl/" target="_blank">LOGIN</a></iframe>' +
    '</div>'
  );
};


// Check if doccheck_key already exists in session storage
if(sessionStorage.doccheck_key && sessionStorage.doccheck_key.length > 0){
  // Get page content form Firebase using the doccheck_key as a path
  firebase.database().ref(sessionStorage.doccheck_key).once('value', function(snapshot){
    if(snapshot.val()){
      // Append body
      $('.intern__content').append(snapshot.val().body);

      // dynamically adjust HTML in Beschreibung
      $(".intern__content a").attr('target', '_new');
    }else{
      appendLoginForm();
    }
  }).then(function(success){});
}else{
  // Display Admin options inside vidual editor
  if (window.location.host === "app.cloudcannon.com") {
    $('.intern__content').html(
      '<div class="text-center" style="border: 3px solid #5bc0de; padding: 20px;">' +
        '<div class="lead">Die Produkte sind in einer separaten, geschützten Datenbank gesichert und können daher nur über den folgenden Button bearbeitet werden:</div>' +
        '<a href="/intern_admin" class="btn btn-info" style="color: white"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Produkte Bearbeiten</a>' +
      '</div>'
    )
  }else{
    appendLoginForm();
  }
};

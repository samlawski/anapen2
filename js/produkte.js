// Initialize Firebase
var config = {
  apiKey: "AIzaSyBlqels-GUR3vVCerItjATd5B24r4IN_dg",
  authDomain: "bioprojet-45ecf.firebaseapp.com",
  databaseURL: "https://bioprojet-45ecf.firebaseio.com",
  storageBucket: "bioprojet-45ecf.appspot.com",
  messagingSenderId: "511400272750"
};
firebase.initializeApp(config);

// Check if parameter from DocCheck exist
if(typeof getUrlParameter('key') != "undefined"){
  sessionStorage.doccheck_key = getUrlParameter("key");
  window.history.replaceState('produkte-login', 'Produkte', '/produkte');
};

// Append DocCheck login form
function appendLoginForm(){
  $('#produkte-login').html(
    '<div class="text-center">' +
      '<div class="lead">Die folgenden Inhalte sind nur für Ärzte und Apotheker zugänglich. Bitte loggen Sie sich ein und/oder klicken Sie auf "Weiter", um die Inhalte sehen zu können.</div>' +
      '<iframe align="center" frameborder="0" scrolling="no" width="311" height="188" name="dc_login_iframe" id="dc_login_iframe" src="https://login.doccheck.com/code/de/2000000009691/m_red/" ><a href="https://login.doccheck.com/code/de/2000000009691/m_red/" target="_blank">LOGIN</a></iframe>' +
    '</div>'
  );
};

// Check if doccheck_key already exists in session storage
if(sessionStorage.doccheck_key && sessionStorage.doccheck_key.length > 0){
  // Get "Produkte" form Firebase using the doccheck_key as a path
  firebase.database().ref(sessionStorage.doccheck_key + '/product_list').once('value', function(snapshot){
    if(snapshot.val()){
      snapshot.forEach(function(child){
        // Append Tab select
        $('#produkte-login .product-select').append(
          '<li class="product text-center">' +
            '<a class="thick text-center" href="#medikament-' + child.val().name + '" aria-controls="medikament-' + child.val().name + '" role="tab" data-toggle="tab">' +
              '<img src="' + child.val().bild_url + '" class="img-responsive" alt="' + child.val().name + ' Verpackung" />' +
              '<div class="product-label">' + child.val().name + '</div>' +
            '</a>' +
          '</li>'
        );
        // Append Tab body
        $('#produkte-login .tab-content').append(
          '<div role="tabpanel" class="tab-pane" id="medikament-' + child.val().name + '">' +
            '<h1>' + child.val().name + '®</h1>' +
            '<div class="produkt_beschreibung">' + child.val().beschreibung + '</div>' +
          '</div>'
        );
      }); // / foreach
      // dynamically adjust HTML in Beschreibung
      $(".produkt_beschreibung a").attr('target', '_new');
      $('#produkte-login .product').first().addClass('active');
      $('#produkte-login .tab-pane').first().addClass('active');
    }else{
      appendLoginForm();
    }
  }).then(function(success){});
}else{
  // Display Admin options inside vidual editor
  if (window.location.host === "app.cloudcannon.com") {
    $('#produkte-login').html(
      '<div class="text-center" style="border: 3px solid #5bc0de; padding: 20px;">' +
        '<div class="lead">Die Produkte sind in einer separaten, geschützten Datenbank gesichert und können daher nur über den folgenden Button bearbeitet werden:</div>' +
        '<a href="/produkte_admin" class="btn btn-info" style="color: white"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> Produkte Bearbeiten</a>' +
      '</div>'
    )
  }else{
    appendLoginForm();
  }
};

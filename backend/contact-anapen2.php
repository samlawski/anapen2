<?php
// Get secret passwords etc. 
// (The file `backend/secrets.php` is NOT in the git repository. It needs to be added manually!)
require 'secrets-anapen2.php';

// Get parameters from the form
$name = $_POST['name'];
$email = $_POST['email_echt'];
$nachricht = $_POST['nachricht'];

$honeypot = trim($_POST['email']); // SPAM protection

$body="Name: $name \n Email: $email \n Nachricht: \n $nachricht";
$subject = "Neue Kontaktanfrage von $name";

// Load PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'php_mailer/Exception.php';
require 'php_mailer/PHPMailer.php';
require 'php_mailer/SMTP.php';

$mail = new PHPMailer(true);

try {
  // Throw an error if origin isn't correct
  $url_whitelist = array("https://bioprojet.de", "http://bioprojet.de", "https://www.bioprojet.de", "http://www.bioprojet.de", "https://anapen2.de", "http://anapen2.de", "https://www.anapen2.de", "http://www.anapen2.de"); 
  $header_origin = $_SERVER['HTTP_ORIGIN'];
  if(in_array($header_origin,$url_whitelist)){
    throw new Exception("False Origin! $header_origin");
  };
  if(!empty($honeypot)){
    throw new Exception("Wenn Sie das hier lesen, dachte unser Computer (vielleicht fälschlicherweise?), dass Sie ein Spam-Bot sind. Bitte schreiben Sie uns doch direkt eine Email. $header_origin");
  }

  // Try to send the email
  // $mail->SMTPDebug = SMTP::DEBUG_SERVER; // verbose response for debugging
  $mail->isSMTP();              
  $mail->SMTPAuth   = true; 
  $mail->SMTPSecure = 'tls'; // $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
  $mail->Port       = 587; // TCP port. Use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
  // $mail->isHTML(true); // Set email format to HTML
  
  // Format Email text correctly
  $mail->Encoding = 'base64';
  $mail->CharSet = 'UTF-8';

  $mail->Host       = $secret_host; // SMTP server
  $mail->Username   = $secret_username; // SMTP username
  $mail->Password   = $secret_password; // SMTP password
  
  $mail->setFrom($secret_sender_email, $secret_sender_name);
  $mail->addAddress($secret_recipient_email);
  
  $mail->Subject = $subject;
  $mail->Body    = $body;

  $mail->send();
  header('Location: https://anapen2.de/danke/');
  exit();
} catch (Exception $e) {
  // echo "Message could not be sent. \n $titel  , $vorname , $nachname , $email \n Error: {$mail->ErrorInfo} \n\n $e";
  echo "Leider konnte die Nachricht nicht verschickt werden.\n\nBitte senden Sie uns eine Email, indem Sie einfach direkt <a href=\"mailto:info@bioprojet.de?subject=Kontaktanfrage von $name&body=$nachricht\">HIER klicken</a>.";
  exit();
}
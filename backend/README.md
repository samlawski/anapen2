The contents of this folder are uploaded separately via FTP to a server that has PHP installed. 

The URL to the contact.php file is used on the ./kontakt.html page.

**Important:** Not included in the repository is the `./backend/secrets.php` file. Its kept separate from the repo for security reasons and also uploaded to the server manually. Here is its format: 

```php
<?php

$secret_host = 'smtp.some-server.com';
$secret_username = 'smtp-user-name';
$secret_password = 'smtp-password';
$secret_sender_email = 'smtp-sender-email-address-must-exist';
$secret_sender_name = 'smtp-sender-name-can-be-anything';
$secret_recipient_email = 'recipient-email@can-be-anything.com';
```
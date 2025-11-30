<?php
declare(strict_types=1);
mb_internal_encoding('UTF-8');
header('Content-Type: text/html; charset=UTF-8');


$h = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');


$full_name = $_POST['full_name'] ?? '';
$pin = $_POST['pin'] ?? '';
$fruit = $_POST['fruit'] ?? '';
$age = $_POST['age'] ?? '';
$shoe_size = $_POST['shoe_size'] ?? '';
$confidence = $_POST['confidence'] ?? '';
?>
<!doctype html>
<html lang="hu">
<meta charset="utf-8">
<title>Feldolgozó</title>
<body>
<h1>Űrlap adatok (kliens oldali ellenőrzéssel)</h1>
<table border="1" cellpadding="6" cellspacing="0">
<tr><th>Név</th><td><?= $h($full_name) ?></td></tr>
<tr><th>Pin kód</th><td><?= $h($pin) ?></td></tr>
<tr><th>Kedvenc gyümölcs</th><td><?= $h($fruit) ?></td></tr>
<tr><th>Életkor</th><td><?= $h($age) ?></td></tr>
<tr><th>Lábméret</th><td><?= $h($shoe_size) ?></td></tr>
<tr><th>Önbizalom</th><td><?= $h($confidence) ?></td></tr>
</table>
<p><a href="HLFA5R_urlap.html">Vissza az űrlapra</a></p>
</body>
</html>
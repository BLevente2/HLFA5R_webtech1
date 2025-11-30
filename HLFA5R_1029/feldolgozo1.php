<?php
declare(strict_types=1);
mb_internal_encoding('UTF-8');
header('Content-Type: text/html; charset=UTF-8');
date_default_timezone_set('Europe/Budapest');


$h = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');


$full_name = trim($_POST['full_name'] ?? '');
$pin = trim($_POST['pin'] ?? '');
$fruit = trim($_POST['fruit'] ?? '');
$age = trim($_POST['age'] ?? '');
$shoe_size = trim($_POST['shoe_size'] ?? '');
$confidence = trim($_POST['confidence'] ?? '');


$errors = [];
if ($full_name === '') { $errors[] = 'A név megadása kötelező.'; }
if (!preg_match('/^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(?:[ -][A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*$/u', $full_name)) { $errors[] = 'A név formátuma hibás.'; }
if (!preg_match('/^\d{4}$/', $pin)) { $errors[] = 'A PIN formátuma hibás (4 számjegy).'; }


?>
<!doctype html>
<html lang="hu">
<meta charset="utf-8">
<title>Feldolgozó 1</title>
<body>
<h1>Űrlap adatok (szerver oldali ellenőrzéssel)</h1>
<?php if ($errors): ?>
<h2>Hibák</h2>
<ul>
<?php foreach ($errors as $e): ?>
<li><?= $h($e) ?></li>
<?php endforeach; ?>
</ul>
<p><a href="HLFA5R_urlap.html">Vissza az űrlapra</a></p>
<?php else: ?>
<table border="1" cellpadding="6" cellspacing="0">
<tr><th>Név</th><td><?= $h($full_name) ?></td></tr>
<tr><th>Pin kód</th><td><?= $h($pin) ?></td></tr>
<tr><th>Kedvenc gyümölcs</th><td><?= $h($fruit) ?></td></tr>
<tr><th>Életkor</th><td><?= $h($age) ?></td></tr>
<tr><th>Lábméret</th><td><?= $h($shoe_size) ?></td></tr>
<tr><th>Önbizalom</th><td><?= $h($confidence) ?></td></tr>
</table>
<?php
$line = implode(';', [
$full_name, $pin, $fruit, $age, $shoe_size, $confidence, date('Y-m-d H:i:s')
]) . PHP_EOL;
file_put_contents('HLFA5R_adatok.txt', $line, FILE_APPEND | LOCK_EX);
?>
<p>Az adatok mentésre kerültek a HLFA5R_adatok.txt fájlba.</p>
<p><a href="HLFA5R_urlap.html">Vissza az űrlapra</a></p>
<?php endif; ?>
</body>
</html>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<h1> Some Skulpt/Processing demo programs </h1>
<h3> Click one of the following </h3>
<?php
$dir    = './demoSketches';
echo "<ul>";
foreach (scandir($dir) as $i => $filename) {
    if ($i>=2) {
    	$url = rawurlencode("$dir/$filename");
        echo "<li> <a href=index.html?autorun&program=$url> $filename </a></li>";
    }
}
echo "</ul>";
?>
</body>
</html>

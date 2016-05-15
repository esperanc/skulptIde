<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css" href="style/codemirror.css">
    <link rel="stylesheet" type="text/css" href="style/solarized.css"> 
    <link rel="stylesheet" type="text/css" href="style/skulptide.css"> 
    <script src="javascript/jquery.min.js"></script>
    <script src="javascript/codemirror.js"></script>
    <script src="javascript/matchbrackets.js"></script>
    <script src="javascript/python.js"></script>
    <script src="javascript/skulpt.min.js"></script>
    <script src="javascript/skulpt-stdlib.js"></script>
    <script src="javascript/processing.min.js"></script>
    <script src="javascript/pythonide.js"></script>
    <script src="javascript/lz-string.min.js"></script>
    <script src="javascript/base64-string.js"></script>
    <script src="javascript/FileSaver.min.js"></script>
</head>
<body>

    <div class="maindiv">
        <div class="IDE">
            <?php if (!isset($_GET['notitle'])):?> 
            <h3>Online Python IDE</h3>
            <p>Implemented with <a href="http://www.skulpt.org/">Skulpt</a> and <a href="https://codemirror.net/">CodeMirror</a></p> 
            <?php endif; ?>
            <?php if (!isset($_GET['nogui'])):?> 
            <div id="menu">
                <label class="button" onclick="runit()">Run</label> 
                <label class="button" onclick="stopit()">Stop</label> 
                <label class="button" onclick="clearit()">Clear</label> 
                <label class="button" for="loadfile">Upload</label>
                    <input type="file" id="loadfile" name="files[]" style="visibility:hidden;display:none;" onchange="loadit(this)"></input>
                <label class="button" onclick="saveit()">Download as</label>
                <input id="savefilename" type="text" value="saveprogram.py"/>
                <br/><br/>
            </div>
            <?php endif; ?>
        </div>
        
        <div id="centralarea">
            <div id="canvas">
            </div>
            <div class="editor IDE">
                <textarea id="code">
                </textarea><br /> 
            </div>
        </div>
    </div>

    <?php if (!isset($_GET['notitle'])):?> 
    <h4 class="IDE">Output</h4>
    <?php endif;?>

    <pre id="output"></pre> 
    
    <?php if (isset($_GET['showurl'])):?> 
    <div id="showurl">
        <label class="button" onclick="showUrl()">Show URL for this sketch</label><br/>
        <a id="myurl" href="" title=""></a>
    </div>
    <?php endif;?>

<?php 
    $parms = array(
        "program"=>"from processing import *\n".
                   "\n".
                   "def draw():\n".
                   "    line(0,0,100,100)\n".
                   "\n".
                   "run()\n\n",
        "autoRun"=>false,
        "hideIde"=>false,
        "height"=>"400px");
    if (isset($_GET['autorun'])) $parms["autoRun"] = true;
    if (isset($_GET['hideide']) || isset($_GET["noide"])) $parms["hideIde"] = true;
    if (isset($_GET['program'])) {
        $prog = file_get_contents($_GET['program']);
        if ($prog) $parms["program"] = $prog;
    }
    if (isset($_GET['source'])) {
        $parms["program"] = $_GET['source'];
    }
    if (isset($_GET['lzsrc'])) {
        $parms["lzsrc"] = $_GET['source'];
    }
    if (isset($_GET['height'])) {
        $parms["height"]=$_GET['height'];
    }
?>

    <script type="text/javascript"> 


    // These control the behavior of the script
    var parms = <?php echo json_encode($parms) ?>;

    // Obtain the url parameter with name theParameter. Returns false
    // if not specified.
    function getParameter(theParameter) { 
        var params = window.location.search.substr(1).split('&');

        for (var i = 0; i < params.length; i++) {
            var p=params[i].split('=');
            if (p[0] == theParameter) {
              return decodeURIComponent(p[1]);
          }
      }
      return false;
    }

    // Callback for "load"
    function loadit(input) {
        var fileobj = input.files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                var text = e.target.result;
                setProgram(text);
                // clear the input element so that a new load on the same file will work
                input.value = "";
            };
        }) (fileobj);

        // Read in the file as a data URL.
        reader.readAsText(fileobj);
    }

    // Callback for "download as"
    function saveit() {

        var data = getProgram();
        var filename = document.getElementById("savefilename").value;
        var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    }

    // Setup 
    function setup () {

        // Setup skulpt and editor
        setupPythonIDE('code','output','canvas');

        // Set the height
        $(".CodeMirror").css("height", parms.height);

        // Set the initial program
        setProgram (parms.program);

        // Arrange to run it automatically if requested
        if (parms.autoRun) {
            setTimeout(function() { runit() }, 50)
        }
    }

    // Loads program from a given url using XMLHttprequest (must be on the same domain)
    function loadUrl (url) {
        function reqListener () {
            console.log(url+" loaded");
            parms.program = this.responseText;
            setup ();
        }

        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", reqListener);
        oReq.open("GET", url); 
        oReq.send();
    }

    function showUrl() {
        var link = document.URL;
        var i = link.indexOf("?");
        if (i>=0) link = link.substr(0,i);
        link = link+"?source="+encodeURIComponent(getProgram());
        $("#myurl").attr("href",link).text(link);
    }

    if (parms.autoRun && parms.hideIde) {
        var elements = document.getElementsByClassName('IDE');
        for(var i=0; i<elements.length; i++) {
            elements[i].style.display = "none";
        }
    }

    // Load the initial program
    setup();

</script>

</body>
</html>

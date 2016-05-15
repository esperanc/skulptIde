/*****
*
*   Typical usage:
* 
*   <form> 
*   <textarea id="code" cols="40" rows="10">import turtle
*
*   t = turtle.Turtle()
*   t.forward(100)
*
*   print "Hello World" 
*   </textarea><br /> 
*   <button type="button" onclick="runit()">Run</button> 
*   </form> 
*   <pre id="output" ></pre> 
*   <div id="canvas"></div> 
*
*   <script>
*       setupPythonIDE('code','output','canvas');
*   </script>
**/


// These will hold handles to asynchronous code that skulpt sets up. We need them to
// implement the stopit function
var intervalFuncVars = [];

// Stops any asynchronous functions still running
var stopit = function () {
    for (var i = 0; i < intervalFuncVars.length; i++) {
        window.clearInterval (intervalFuncVars[i]);
    }
}

//
// Temporary functions  overwritten by setupPythonIDE
//

// Runs the program loaded in the editor
var runit = function () {};

// Clears the output (both text and graphical)
var clearit = function () {};

// Sets the contents of the editor to program
var setProgram = function (program) {}

// Returns the contents of the editor
var getProgram = function () {}

// 
// Call this function after setting up a <textarea> for the program (id=codeId),
// a <pre> for text output (id=outputId) and a <div> for the graphical output (id = canvasId).
// It creates a codemirror-based text editor, and several functions for managing the 
// skulpt based python environment (runit,stopit,clearit,setProgram,getProgram)
//
function setupPythonIDE (codeId,outputId,canvasId) {

    codeId = codeId || 'code';         // Id of a <textarea> where the code is edited
    outputId = outputId || 'output';   // Id of a <pre> tag where the output of the code is printed
    canvasId = canvasId || 'canvas';   // Id of a <div> where graphical output is to be presented

    // output functions are configurable.  This one just appends some text
    // to a pre element.
    function outf(text) { 
        var mypre = document.getElementById(outputId); 
        mypre.innerHTML = mypre.innerHTML + text; 
    } 


    // What to use to read from input
    function builtinRead(x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    }


    // Clears outputId and canvasId
    clearit = function () {
        var mypre = document.getElementById(outputId); 
        mypre.innerHTML = "";   
        var can = document.getElementById(canvasId);
        can.innerHTML = "";     
    }

    

    // Here's everything you need to run a python program in skulpt
    // grab the code from your textarea
    // get a reference to your pre element for output
    // configure the output function
    // call Sk.importMainWithBody()
    runit = function () { 

        stopit();
        clearit();

        var prog = editor.getValue(); 
        var mypre = document.getElementById(outputId); 
        mypre.innerHTML = ''; 
        Sk.pre = outputId;
        Sk.canvas = canvasId;
        var can = document.getElementById(Sk.canvas);
        can.style.display = 'table';
        if (can) {
           can.width = can.width;
           if (Sk.tg) {
               Sk.tg.canvasInit = false;
               Sk.tg.turtleList = [];
           }
        }
        Sk.configure({output:outf, read:builtinRead}); 
        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = canvasId;

        // Must capture the setInterval function so that processing errors
        // are caught and sent to the output and so we know which asynchronous
        // processes were started
        var oldSetInterval = window.setInterval;

        window.setInterval = setInterval = function (f,t) {
            var handle = 
            oldSetInterval (function () {
                try {
                    f()
                } catch (err) {
                    // Restore the old setInterval function
                    window.setInterval = setInterval = oldSetInterval;
                    outf(err.toString());
                    stopit();
                }
            },t);
            intervalFuncVars.push(handle);
        }


           var myPromise = Sk.misceval.asyncToPromise(function() {
               return Sk.importMainWithBody("<stdin>", false, prog, true);
           });

           myPromise.then(function(mod) {
               // console.log('success');
           },
               function(err) {
                var msg = err.toString();
                console.log(msg);
                outf(msg);
           });

        // Restore the old setInterval function
        window.setInterval = setInterval = oldSetInterval;
    } 

    //
    // Replace the textarea by a codemirror editor
    // 
    function createEditor () {
        var textarea = document.getElementById(codeId);
        editor = CodeMirror.fromTextArea(textarea, {
            mode: {name: "python",
                   version: 2,
                   singleLineStringErrors: false
               },
            lineNumbers: true,
            textWrapping: false,
            indentUnit: 4,
            indentWithTabs: false,
            fontSize: "10pt",
            autoMatchParens: true,
            matchBrackets: true,
            theme: "solarized",
            extraKeys:{
                Tab: function (cm) {
                    if (cm.doc.somethingSelected()) {
                        return CodeMirror.Pass;
                    }
                    var spacesPerTab = cm.getOption("indentUnit");
                    var spacesToInsert = spacesPerTab - (cm.doc.getCursor("start").ch % spacesPerTab);    
                    var spaces = Array(spacesToInsert + 1).join(" ");
                    cm.replaceSelection(spaces, "end", "+input");
                }
            }
        });
    }

    createEditor ();

    // export the function to get contents of the editor
    getProgram = function () { return editor.getValue() };

    // export the function to set the contents of the editor
    setProgram = function (prog) { editor.setValue(prog); }
}

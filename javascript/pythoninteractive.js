CodeMirrorREPL.prototype.isBalanced = function () {
    return true;
};

CodeMirrorREPL.prototype.eval = function () {};

function CodeMirrorREPL(textareaId, options) {
    var textarea = document.getElementById(textareaId);
    options = options || {};
    textarea.value = "";

    var keymap = {
        "Up": up,
        "Down": down,
        "Delete": del,
        "Ctrl-Z": undo,
        "Enter": enter,
        "Ctrl-A": select,
        "Ctrl-Delete": del,
        "Shift-Enter": enter,
        "Backspace": backspace,
        "Ctrl-Backspace": backspace
    };

    var options = {
        electricChars: false,
        theme: options.theme,
        mode: options.mode,
        smartIndent: false,
        lineWrapping: false,
        extraKeys: keymap,
        onChange: change,
        indentUnit: 4,
        undoDepth: 1,
        autofocus: true,
        //gutter: true,
        gutters: ["note-gutter"],
        lineNumbers: false,
    };

    var mirror  = CodeMirror.fromTextArea(textarea, options);

    var history = [];
    var buffer = [];
    var repl = this;
    var user = true;
    var text = "";
    var line = 0;
    var ch = 0;
    var n = 0;

    repl.print = print;
    repl.setMode = setMode;
    repl.setTheme = setTheme;
    mirror.setGutterMarker(line, "note-gutter", document.createTextNode(">>>"));

    function undo() {}

    function to(line) {
        return { line: line, ch: mirror.getLine(line).length };
    }
    
    function from(line) {
        return { line: line, ch: 0 };
    }
    
    function up() {
        switch (n--) {
            case 0:
                n = 0;
                return;
            case history.length:
                text = mirror.getLine(line).slice(ch);
        }

        mirror.replaceRange(history[n], from(line), to(line));
    }

    function down() {
        switch (n++) {
            case history.length:
                n--;
                return;
            case history.length - 1:
                mirror.replaceRange(text, from(line), to(line));
                return;
        }

        mirror.replaceRange(history[n], from(line), to(line));
    }

    function enter(cm) {
        var text = mirror.getLine(line);
        var input = text.slice(ch);
        user = false;

        ch = 0;
        buffer.push(input);
        n = history.push(input);
        
        mirror.replaceRange(text + '\n', { line: line++, ch: 0 }, { line: line, ch: 0 });
        
        var code = buffer.join('\n').replace(/\r/g, '\n');
        var balanced = repl.isBalanced(code);

        if (balanced) {
            repl.eval(code);
            buffer.length = 0;
            mirror.setGutterMarker(line, "note-gutter", document.createTextNode(">>>"));
        } else {
            if (balanced === null) {
                buffer.pop();
                code = buffer.join('\n').replace('\r', '\n');
                mirror.setGutterMarker(line, "note-gutter", repl.isBalanced(code) ? document.createTextNode(">>>") : document.createTextNode("..."));
            } else mirror.setGutterMarker(line, "note-gutter", document.createTextNode("..."));
        }

        mirror.scrollIntoView(from(line));
        
        setTimeout(function () {
            user = true;
        }, 0);
    }

    function select() {
        var length = mirror.getLine(line).slice(ch).length;
        mirror.setSelection(from(line), {line: line, ch: length});
    }

    function backspace() {
        var selected = mirror.somethingSelected();
        var cursor = mirror.getCursor(true);
        var ln = cursor.line;
        var c = cursor.ch;

        if (ln === line && c >= ch + (selected ? 0 : 1)) {
            if (!selected) mirror.setSelection({line: ln, ch: c - 1}, cursor);
            mirror.replaceSelection("");
        }
    }

    function del() {
        var cursor = mirror.getCursor(true);
        var ln = cursor.line;
        var c = cursor.ch;

        if (ln === line && c < mirror.getLine(ln).length && c >= ch) {
            if (!mirror.somethingSelected()) mirror.setSelection({line: ln, ch: c + 1}, cursor);
            mirror.replaceSelection("");
        }
    }
    
    function change(mirror, changes) {
        var to = changes.to;
        var from = changes.from;
        var text = changes.text;
        var next = changes.next;
        var length = text.length;

        if (user) {
            if (from.line < line || from.ch < ch) mirror.undo();
            else if (length-- > 1) {
                mirror.undo();

                var ln = mirror.getLine(line).slice(ch);
                text[0] = ln.slice(0, from.ch) + text[0];

                for (var i = 0; i < length; i++) {
                    mirror.replaceRange(text[i],from(line), to(line));
                    enter();
                }
                var l = text[length] + ln.slice(to.ch);
                mirror.replaceRange(l, from(line), to(line));
            }
        }

        if (next) change(mirror, next);
    }

    function print(message, className) {
        var mode = user;
        var ln = line;
        user = false;

        message = String(message);
        var text = mirror.getLine(line);
        message = message.replace(/\n/g, '\r') + '\n';

        if (text) {
            mirror.setGutterMarker(line, "note-gutter", document.createTextNode(""));
            var cursor = mirror.getCursor().ch;
        }

        mirror.replaceRange(message, { line: line++, ch: 0 }, { line:line, ch:0 });
        if (className) mirror.markText({line: ln, ch: 0}, {line: ln, ch: message.length}, className);

        if (text) {
            mirror.replaceRange(text, from(line), to(line));
            mirror.setGutterMarker(line, "note-gutter", document.createTextNode(">>>"));
            mirror.setCursor({line: line, ch: cursor});
        }
        
        mirror.scrollIntoView(from(line));
        
        setTimeout(function () {
            user = mode;
        }, 0);
    }

    function setMode(mode) {
        mirror.setOption("mode", mode);
    }

    function setTheme(theme) {
        mirror.setOption("theme", theme);
    }
}

function setupPythonShell (textArea) {
    textArea = textArea || 'interactive';

    var repl = new CodeMirrorREPL(textArea, {
            mode: "python",
            theme: "solarized"
        });

    var compilableLines = [],
        //finds lines starting with "print" 
        re = new RegExp("\\s*print"),
        //finds import statements
        importre = new RegExp("\\s*import"),
        //finds multuline string constants
        mls = new RegExp("'''"),
        //finds defining statements
        defre = new RegExp("def.*|class.*"),
        //test for empty line.
        emptyline = new RegExp("^\\s*(\\#.*)?$"),
        //a regex to check if a line is an assignment
        //this regex checks whether or not a line starts with 
        //an identifier followed with some whitspace and then an = and then some more white space.
        //it also checks if the identifier is a tuple.
        assignment = /^((\s*\(\s*(\s*((\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*)|(\s*\(\s*(\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*,)*\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*\)\s*))\s*,)*\s*((\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*)|(\s*\(\s*(\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*,)*\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*\)\s*))\s*\)\s*)|(\s*\s*(\s*((\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*)|(\s*\(\s*(\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*,)*\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*\)\s*))\s*,)*\s*((\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*)|(\s*\(\s*(\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*,)*\s*((\s*[_a-zA-Z]\w*\s*)|(\s*\(\s*(\s*[_a-zA-Z]\w*\s*,)*\s*[_a-zA-Z]\w*\s*\)\s*))\s*\)\s*))\s*\s*))=/;

  
    repl.print("Python 2.6(ish) (skulpt, " + new Date() + ")");
    repl.print("[" + navigator.userAgent + "] on " + navigator.platform);
    //repl.print('Don\'t type "help", "copyright", "credits" or "license" unless you\'ve assigned something to them');

    repl.isBalanced = function (code) {
        var lines = code.split('\n'),
            depth = 0,
            mlsopened = false,
            l;
        
        for (l = 0; l < lines.length; l = l + 1) {
            if (lines[l].match(/'''/) !== null && lines[l].match(/'''/).length === 1) {
                mlsopened = !mlsopened;
            }
            if (!mlsopened && lines[l].substr(lines[l].length - 1) === ":") {
                depth = depth + 1;
            }
            if (!mlsopened && lines[l] === "" && depth > 0) {
                depth = 0   ;
            }
        }
        return depth === 0 && !mlsopened;
    };

    //Loop
    repl.eval = function (code) {
        Sk.configure({ 
            output: function(str) {
                //strip out line-feeds
                if (str.replace(/\n/g, "") !== "") {
                    repl.print(str);
                }
            },
            read: function (x) {
                if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined) {
                    throw "File not found: '" + x + "'";
                }
                return Sk.builtinFiles["files"][x];
            },
            retainglobals: true
        });
            
        //split lines on linefeed
        var lines = code.split('\n'), index = -1, line = 0;

        //it's a onliner
        if (lines.length === 1) {
            //if it's a statement that should be printed (not containing an = or def or class or an empty line)
            if (!assignment.test(lines[0]) && !defre.test(lines[0]) && !emptyline.test(lines[0]) && !importre.test(lines[0]) && lines[0].length > 0) {
                //if it doesn't contain print make sure it doesn't print None
                if (!re.test(lines[0])) {
                    //remove the statement
                    //evaluate it if nessecary
                    lines.push("evaluationresult = " + lines.pop());
                    //print the result if not None
                    lines.push("if not evaluationresult == None: print repr(evaluationresult)");
                }
            }
        }

        try {
            //Evaluate
            if (!lines || /^(\s|\#)*$/.test(lines)) {
                return;
            }
            else {
                Sk.importMainWithBody("repl", false, lines.join('\n'));            
            }
        } catch (err) {
            repl.print(err);

            //find the line number
            if ((index = err.toString().indexOf("on line")) !== -1) {
                index = parseInt(err.toString().substr(index + 8), 10);
            }
            
            //print the accumulated code with a ">" before the broken line.
            //Don't add the last statement to the accumulated code
            lines.forEach(function (str) {
                repl.print(++line + (index === line ? ">" : " ") + ": " + str);
            });
        }
    };

    return repl;
};
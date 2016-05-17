# Skulpt IDE

##What is this?

The Skulpt IDE is my attempt to build an online Integrated Development Environment where anyone can edit Python code and see it running on the the browser. It uses the code base for <a href="www.skulpt.org">Skulpt</a>, a JavaScript port of the <a href="www.python.org">Python</a> language, the <a href="https://codemirror.net/">CodeMirror</a> online code editor and several other useful modules.
                
##Why

I teach introductory level programming courses at <a href="www.ufrj.br">UFRJ</a> and would like my students to have access to a simple Python programming environment they could use anywhere. Moreover, I am especially interested in using graphics to motivate programming as a means of expression, and was delighted to see that Skulpt already includes a very capable <a href="www.processing.org">Processing</a> module, thus making it easy to write interactive programs with graphical output. All that was needed, really, was to add functionality to implement common tasks such as uploading/downloading source programs and run/stop buttons.

##Install
Just download the whole thing (use the download .zip link in this page) into some folder your web server can see. Then access the index.html page from there and you are done. You can even use most of the functionality of the IDE without a web server - just open the index.html file from a (html5-enabled) browser.

In fact, you don't even need to download anything. The IDE can be used directly from the main github page, by accessing <a href="http://esperanc.github.io/skulptIde/index.html">http://esperanc.github.io/skulptIde/index.html</a>.

##Usage                

###Basic usage

Type in the source code in the editor and click <span class="button">Run</span>. Errors and other output are shown in the Output pane at the bottom of the screen. 

If your code has an infinite loop, hit <span class="button">Stop</span> in order to avoid consuming too many resources of your browser.

Hit <span class="button">Clear</span> to clear the output and graphics canvas. If the program is still running, it is stopped first.

Save often! Use the <span class="button">Download as</span> button to save your work to your local machine using the filename in the text box beside it. To load a file you have in your local computer to the IDE, use the <span class="button">Upload</span> button.

### Writing Processing sketches

If you are writing a program that uses the Processing module, i.e., a "sketch", you must include `from processing import *` as the first line of your sketch and <code>run()</code> as the last line. Also, you should probably write your own <code>draw()</code> and <code>setup()</code> functions somewhere in between...

###URL parameters

The following URL parameters are supported:
<dl>
<dt><code>program=</code><em>url</em></dt> 
<dd>Loads the Python source code at the given url. Notice that your url must be encoded as an url-safe string. For instance, here's how to load one the demo sketches included in the distribution:
<a href="http://esperanc.github.io/skulptIde/index.html?program=http%3A%2F%2Fesperanc.github.io%2FskulptIde%2FdemoSketches%2FalignGrid.py" title="alignGrid.py">http://esperanc.github.io/skulptIde/index.html?program=http%3A%2F%2Fesperanc.github.io%2FskulptIde%2FdemoSketches%2FalignGrid.py</a>
</dd>
<dt><code>showurl</code> </dt>
<dd>Displays a <span class="button">Show URL</span> button at the bottom of the page. When pressed, a url-safe string encoding the sketch is generated in order to be used with the <code>source</code> or <code>lzsource</code> parameter. A link to the Skulpt IDE with that sketch preloaded is then generated and shown below the button.</dd>
<dt><code>source=</code><em>source code</em></dt> 
<dd>This can be used to load Python source code encoded as a url-safe string. Ex.:
<a href="http://esperanc.github.io/skulptIde/index.html?source=print%20%22Hello%20from%20Skulpt!%22">http://esperanc.github.io/skulptIde/index.html?source=print%20%22Hello%20from%20Skulpt!%22</a>
</dd>

<dt><code>lzsrc=</code><em>compressed source code</em></dt> 
 <dd>This is similar to the <code>source</code> parameter, except that the source code must be compressed and encoded in Base 64. This option was added in order to enable reasonably long source code to be encoded as an url string.
The best way obtain this compressed url is to use the <code>showurl</code> parameter, which always computes arguments for both <code>source</code> and <code>lzsrc</code> and shows the shortest one.
 </dd>

<dt><code>autorun</code></dt> <dd>Makes the code in the editor start running at once.</dd>

<dt><code>noide</code></dt> <dd>Hides the editor, title and buttons so that only the output and graphics canvas are shown. Obviously, this is only useful together with <code>autorun</code>.</dd>

<dt><code>notitle</code></dt> <dd>Hides the title. This is useful if you want to embed the IDE as an
                  iframe in your site.</dd>
<dt><code>nooutput</code></dt> <dd>Hides the output panel. This is useful if you want to hide output messages from a graphical sketch, for instance.</dd>
 </dl>

           

import Connector from './connector.js';
import SearchPage from './ui/searchPage.js';
import HelpContent from './ui/helpContent.js'
import DomUtils from './domUtils.js';

//document.addEventListener('copy',onCopy, true);
document.addEventListener('mouseup', onMouseUp);
var connector = new Connector();
console.log(connector);

connector.registerEvent("inject", onInject);
connector.registerEvent("showHelp", showHelp);

function onCopy(e)
{ 
    setTimeout(sendCurrentClipboard,1);
}

function sendCurrentClipboard()
{
    connector.sendMessage("onCopy", getClipboardText());
}

function onMouseUp(e)
{ 
    //sendCurrentSelection();
}

function sendCurrentSelection()
{
    var currentSelection = getCurrentSelection();
    
    if(!currentSelection)
        return;

    var selectionObj =
    {
        "url": connector.getCurrentTabUrl(),
        "selectedText" : currentSelection
    }

    connector.sendMessage("onSelected", selectionObj);   
}

function onInject(searchText)
{
   var props ={showSearchInput:false, defaultSearchText:searchText}
   DomUtils.inject( SearchPage, props, "ires");
}

function getCurrentSelection()
{
    return window.getSelection().toString();
}

function getClipboardText() {
    // create div element for pasting into
    var pasteDiv = document.createElement("div");

    // place div outside the visible area
    pasteDiv.style.position = "absolute";
    pasteDiv.style.left = "-10000px";
    pasteDiv.style.top = "-10000px";

    // set contentEditable mode
    pasteDiv.contentEditable = true;

    // find a good place to add the div to the document
    var insertionElement = document.activeElement; // start with the currently active element
    var nodeName = insertionElement.nodeName.toLowerCase(); // get the element type
    while (nodeName !== "body" && nodeName !== "div" && nodeName !== "li" && nodeName !== "th" && nodeName !== "td") { // if have not reached an element that it is valid to insert a div into (stopping eventually with 'body' if no others are found first)
        insertionElement = insertionElement.parentNode; // go up the hierarchy
        nodeName = insertionElement.nodeName.toLowerCase(); // get the element type
    }

    // add element to document
    insertionElement.appendChild(pasteDiv);

    // paste the current clipboard text into the element
    pasteDiv.focus();
    document.execCommand('paste');

    // get the pasted text from the div
    var clipboardText = pasteDiv.innerText;

    // remove the temporary element
    insertionElement.removeChild(pasteDiv);

    // return the text
    return clipboardText;
}

function showHelp()
{
    var props = { initiallyOpen:true}

    DomUtils.inject(HelpContent, props, null, function()
        {
            connector.sendMessage("onHelpShown");   
        });
}
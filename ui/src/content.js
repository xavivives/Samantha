import Connector from './connector.js';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SearchPage from './searchPage.js';

document.addEventListener('copy',onCopy, true);
document.addEventListener('mouseup', onMouseUp);
var connector = new Connector();
console.log(connector);
connector.registerEvent("inject", onInject);

function onCopy(e)
{ 
    setTimeout(sendCurrentClipboard,1);
}

function sendCurrentClipboard()
{
    Connector.sendMessage("onCopy", getClipboardText());
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
        "url": Connector.getCurrentTabUrl(),
        "selectedText" : currentSelection
    }

    Connector.sendMessage("onSelected", selectionObj);   
}

function onInject(url)
{
    injectTapEventPlugin();
    var googleResultsDiv = document.getElementById('rso');
    var firstResult = googleResultsDiv.children[0];
    var newSearchContainer = document.createElement('div');
    googleResultsDiv.insertBefore(newSearchContainer,firstResult);
    var reactElement = React.createElement(SearchPage);

   ReactDOM.render(reactElement, newSearchContainer, onReplaced);
}

function onReplaced(e)
{
    console.log("replaced");
    console.log(e);
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
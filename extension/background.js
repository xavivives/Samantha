chrome.runtime.onConnect.addListener(onContentConnected);
chrome.runtime.onMessage.addListener(onContentMessage);
chrome.omnibox.onInputEntered.addListener(onOmniboxEntered);

var clipboard = "";

function onContentConnected ( port )
{
    port.postMessage("Conected with content");
}

function onContentMessage(message, sender, sendResponse)
{
    console.log(message.value);
    processMessage(message.event, message.value);
}

function processMessage(event, value)
{
    if(event == "copy")
        onCopy(value);  
}

function onCopy(str)
{
    console.log(str);
    console.log(clipboard);
    clipboard = str;
    setOmniboxSuggestion(str);
}

function onOmniboxEntered(str)
{
    console.log(str);
}

function goToUrl(url)
{
    chrome.tabs.update(null, {url:"url"});
}

function setOmniboxSuggestion(str)
{
    console.log(str);
    var obj = {description: str};
    chrome.omnibox.setDefaultSuggestion(obj);
}
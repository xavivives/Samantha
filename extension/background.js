chrome.runtime.onConnect.addListener(onContentConnected);
chrome.runtime.onMessage.addListener(onContentMessage);
chrome.omnibox.onInputEntered.addListener(onOmniboxEnter);

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
    if(event == "onCopy")
        onCopy(value);  
    if(event == "onSelected")
        onSelected(value);  
}

function onCopy(str)
{
    clipboard = str;
    setOmniboxSuggestion(str);
}

function onSelected(str)
{
    console.log("Str: "+str);
}

function onOmniboxEnter(str)
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
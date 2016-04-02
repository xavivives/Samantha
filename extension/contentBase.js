var backgroundPort;
document.addEventListener("visibilitychange", onVisibilityChanged);
window.addEventListener("blur", onBlur);
window.addEventListener("focus", onFocus);

function onBackgroundMessage (message, sender)
{
     processMessage(message.event, message.value);
}

function sendMessage(event, value)
{
    var message = {event:event, value:value};
    chrome.runtime.sendMessage(message);
}

function processMessage(event, value)
{
    console.log("Override me!");
}

function getCurrentTabUrl()
{
    return document.location.href;
}

function onVisibilityChanged(e)
{
    var isVisible = document.visibilityState == "visible";
    if(isVisible)
        connectToBackground();
}

function connectToBackground()
{
    backgroundPort = chrome.runtime.connect();
    backgroundPort.onMessage.addListener(onBackgroundMessage);
}

function onFocus()
{
    //console.log("focus");
}

function onBlur()
{
    //console.log("blur");
}
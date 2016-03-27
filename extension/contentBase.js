var backgroundPort = chrome.runtime.connect();
backgroundPort.onMessage.addListener(onBackgroundMessage);

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

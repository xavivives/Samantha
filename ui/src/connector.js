
module.exports.backgroundPort = chrome.runtime.connect();

module.exports.backgroundPort.onMessage.addListener(function (message, sender)
{
     module.exports.processMessage(message.event, message.value);
});

module.exports.sendMessage = function(event, value)
{
    var message = {event:event, value:value};
    chrome.runtime.sendMessage(message);
}

module.exports.processMessage = function(event, value)
{
    console.log("Override me!");
}

module.exports.getCurrentTabUrl = function()
{
    return document.location.href;
}
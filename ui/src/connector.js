
module.exports.backgroundPort = chrome.runtime.connect();

module.exports.backgroundPort.onMessage.addListener(function (message, sender)
{
    console.log(message);
     module.exports.processMessage(message);
});

module.exports.sendMessage = function(event, value)
{
    var message = {event:event, value:value};
    chrome.runtime.sendMessage(message);
}

module.exports.processMessage = function(message)
{
    var event = message.event;
    var value = message.value; 
    
    for(var i = 0;i < module.exports.registredEvents.length; i++)
    {
        console.log("Event: "+module.exports.registredEvents.eventName);

        if(module.exports.registredEvents[i].eventName == event)
        {
            module.exports.registredEvents[i].functionCallback(value);
        }
    }
    
}

module.exports.registerEvent = function(eventName, functionCallback)
{
    var event = {
        eventName : eventName,
        functionCallback : functionCallback
    }
    module.exports.registredEvents.push(event);
}

module.exports.getCurrentTabUrl = function()
{
    return document.location.href;
}

module.exports.registredEvents = [];
export default class Connector
{
    constructor() {
        this.registredEvents = [];
        this.backgroundPort = chrome.runtime.connect();
        var that = this;
        this.backgroundPort.onMessage.addListener(function (message, sender)
        {
            console.log(that);
             that.processMessage(message);
        });
    }

    sendMessage (event, value)
    {
        var message = {event:event, value:value};
        chrome.runtime.sendMessage(message);
    }

    processMessage(message)
    {
        var event = message.event;
        var value = message.value; 

        for (var i = 0 ; i < this.registredEvents.length ; i++)
        {
            if(this.registredEvents[i].eventName == event)
            {
                this.registredEvents[i].functionCallback(value);
            }
        } 
    }

    registerEvent (eventName, functionCallback)
    {
        var event = {
            eventName : eventName,
            functionCallback : functionCallback
        }
        this.registredEvents.push(event);
    }

    getCurrentTabUrl()
    {
        return document.location.href;
    }
    
}
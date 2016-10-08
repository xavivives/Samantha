export default class Connector
{
    constructor() {
        this.registredEvents = [];
        var that = this;

        this.onVisibilityChanged = this.onVisibilityChanged.bind(this);
        this.connectToBackground = this.connectToBackground.bind(this);

        document.addEventListener("visibilitychange", function(){ that.onVisibilityChanged()});
        this.connectToBackground();
    }

    connectToBackground()
    {
        var that = this;
        var backgroundPort = chrome.runtime.connect();
        backgroundPort.onMessage.addListener(function (message, sender)
        {
             that.processMessage(message);
        });
    }

    onVisibilityChanged()
    {
        var isVisible = document.visibilityState == "visible";
        if(isVisible)
            this.connectToBackground();
    }

    sendMessage (event, value)
    {
        var message = {event:event, value:value};
        chrome.runtime.sendMessage(message);
    }

    processMessage(message)
    {
        console.log("processsing");
        console.log(message);
        var event = message.event;
        var value = message.value; 

        console.log(this.registredEvents);

        for (var i = 0 ; i < this.registredEvents.length ; i++)
        {
            console.log(i);
            if(this.registredEvents[i].eventName == event)
            {
                //console.log(this.registredEvents[i]);
                console.log("caññog");
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
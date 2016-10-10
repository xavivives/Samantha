export default class Connector
{
    constructor(parent)
    {
        this._parent = parent;
        this.registredEvents = [];
        var that = this;

        this.onVisibilityChanged = this.onVisibilityChanged.bind(this);
        this.connectToBackground = this.connectToBackground.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        this.processMessage = this.processMessage.bind(this);
        this.registerEvent = this.registerEvent.bind(this);

        document.addEventListener("visibilitychange", function(){ that.onVisibilityChanged()});
        this.connectToBackground();
    }

    connectToBackground()
    {
        var that = this;
        var backgroundPort = chrome.runtime.connect();

        backgroundPort.onMessage.addListener(this.processMessage);
        this._connectToBackground = true;
    }

    onVisibilityChanged()
    {
        var isVisible = document.visibilityState == "visible";
        if(isVisible)
            this.connectToBackground();
    }

    sendMessage (event, value)
    {
        this._sendMessage = true;
        var message = {event:event, value:value};
        chrome.runtime.sendMessage(message);
    }

    processMessage(message, sender)
    {
        var event = message.event;
        var value = message.value; 

        for (var i = 0 ; i < this.registredEvents.length ; i++)
        {
            if(this.registredEvents[i].eventName == event)
                this.registredEvents[i].functionCallback(value);
        } 
    }

    registerEvent (eventName, functionCallback)
    {
        this._registerEvent = true;

        var event = {
            eventName : eventName,
            functionCallback : functionCallback
        }
        this.registredEvents.push(event);
    }
}
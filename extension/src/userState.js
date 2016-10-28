import ChromeStorage from './chromeStorage.js';

export default class userState
{

    constructor()
    {
        this.config = {};
        this.config.currentUId = null;
        this.config.helpShownTimes = null;
    }

    init (storedConfig)
    {
         if(storedConfig)
        {
            //stateConfig = storedConfig;
            this.config.currentUId = storedConfig.currentUId;
            this.config.helpShownTimes = storedConfig.helpShownTimes;
        }

        if(!this.config.currentUId)
           this.config.currentUId = 0;
        if(!this.config.helpShownTimes)
            this.config.helpShownTimes = 0;
    }

    save()
    {
        ChromeStorage.saveElement("userStateConfig", this.config);
    }

    load(onLoaded)
    {
        var that = this;
        ChromeStorage.loadElement("userStateConfig", function(loadedConfig){
            that.init(loadedConfig);
            onLoaded();
        } );
    }

    getNewUId()
    {
        this.config.currentUId ++;
        return this.config.currentUId.toString();
    }

    onHelpShown()
    {
        this.config.helpShownTimes ++;
    }

    getHelpShownTimes()
    {
        return this.config.helpShownTimes;
    }

}
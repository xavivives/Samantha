import Utils from './utils.js';
import UrlUtils from './urlUtils.js';

export default class tabsController
{
    constructor(onMessage)
    {
        this.onTabUpdated = this.onTabUpdated.bind(this);
        this.onTabCreated = this.onTabCreated.bind(this);
        this.onTabRemoved = this.onTabRemoved.bind(this);
        this.onContentConnected = this.onContentConnected.bind(this);
        this.onContentMessage = this.onContentMessage.bind(this);
        this.onCommitted = this.onCommitted.bind(this);

        this.tabs= [];
        this.popupId = "popup";
        this.onMessage = onMessage;

        chrome.tabs.onUpdated.addListener(this.onTabUpdated);
        chrome.tabs.onCreated.addListener(this.onTabCreated);
        chrome.tabs.onRemoved.addListener(this.onTabRemoved);
        chrome.runtime.onConnect.addListener(this.onContentConnected);
        chrome.runtime.onMessage.addListener(this.onContentMessage);
        chrome.webNavigation.onCommitted.addListener(this.onCommitted);
    }

    onContentMessage(message, sender, sendResponse)
    {
        this.onMessage(message.event, message.value, sender.tab);
    }

    onTabUpdated(tabId, changeInfo, tab)
    {
        if(changeInfo.status != "loading")//loading event can´t connect to port yey
            return;

        if(!Utils.objExist(this.tabs[tabId]))
            this.initTab(tabId);

        this.tabs[tabId].port = null;//Here, new port hasn´t connected yet. We set it to null so if we sent a message it will be queued instead of failing
        //contentPort = null;//Here, new port hasn´t connected yet. We set it to null so if we sent a message it will be queued instead of failing

        //we use this to know if its a serach engine
        var searchText = UrlUtils.getSearchText(tab.url);
        if(searchText)
        {
            this.resetTabHisoryAndSearch(tabId);
            this.setTabSearch(tabId, searchText);
            injectSamanthaResults(tab.id, searchText);
        }
        
        if(this.tabHistoryExists(tab.id))
            this.addUrlToHistory(tab.id, tab.url);
    }

    injectSamanthaResults(tabId, searchText)
    {
        this.sendMessage("inject", searchText, tabId);
    }

    initTab(tabId)
    {
        this.tabs[tabId] ={};
        this.tabs[tabId].port = null;
        this.tabs[tabId].history =[];
        this.tabs[tabId].searchText = "";
        this.tabs[tabId].queuedMessages =[];
    }

    resetTabHisoryAndSearch(tabId)
    {
        if(!Utils.objExist(this.tabs[tabId]))
            return;
        
        this.setTabSearch(tabId, "");
        this.setTabHistory(tabId, []);
    }

    onTabRemoved(tabId, removeInfo)
    {
        delete this.tabs[tabId];
    }

    setTabSearch(tabId, searchText)
    {
        this.tabs[tabId].searchText = searchText;
    }

    setTabHistory(tabId, history)
    {
        this.tabs[tabId].history = history;
    }

    addUrlToHistory(tabId, url)
    {
        if(this.urlIsNotTheSame(tabId, url))
            this.tabs[tabId].history.push(url);
    }

    urlIsNotTheSame(tabId, url)
    {
        var tabLength = this.tabs[tabId].history.length-1;
        if(this.tabs[tabId].history[tabLength] == url) //url is not the same as the last register
            return false;

        return true;
    }

    tabHistoryExists(tabId)
    {
        if(Utils.objExist(this.tabs[tabId]))
            return Utils.objExist(this.tabs[tabId].history);
        return false;
    }

    getCurrentTab(onTap)
    {
        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
            var activeTab = arrayOfTabs[0];
            if(!activeTab)
            {
                console.log("Trying to get current tab and can't");
                return;
            }
            var activeTabId = activeTab.id; 
            onTap(activeTab);
        });
    }

    onTabCreated(tab)
    {
        this.initTab(tab.id);

        if(!Utils.objExist(tab.openerTabId))
            return;

        //we add the history and serach text of the tab that opened this one
        this.setTabSearch(tab.id, this.getOriginalSearchText(tab.openerTabId));
        this.setTabHistory(tab.id, this.getHistorySinceSearch(tab.openerTabId));
    }

    tabExists(tabId)
    {
        return Utils.objExist(this.tabs[tabId]);
    }

    onContentConnected (port)
    {
        var tabId = "";

        if(!port.sender.tab)//its probably an extension popup
            tabId = this.popupId;
        else
            tabId = port.sender.tab.id;

        //console.log("Connected " + tabId);

        if(!this.tabExists(tabId))
            this.initTab(tabId);

        this.tabs[tabId].port = port;
        
        while(this.tabs[tabId].queuedMessages.length>0)
        {
            this.tabs[tabId].port.postMessage(tabs[tabId].queuedMessages.shift());
        }

        //if(userState.getHelpShownTimes() == 0)
        //    onShowHelp();
    }

    sendMessage(event, value, tabId)
    {
        var message = {event:event, value:value};

        if(!this.tabExists(tabId))
            this.initTab(tabId);

        if(this.tabs[tabId].port == null)
        {
            //console.log("Queueing " + tabId + ": "+ message.event);
            this.tabs[tabId].queuedMessages.push(message);
        }
        else
        {
           // console.log("Posting to "+ tabId + ": "+ message.event);
            this.tabs[tabId].port.postMessage(message);
        }
    }

    getOriginalSearchText(tabId)
    {
        if(this.tabHistoryExists(tabId))
            return this.tabs[tabId].searchText;
        return null;
    }

    getHistorySinceSearch(tabId)
    {
        if(this.tabHistoryExists(tabId))
            return Utils.copyObj(this.tabs[tabId].history);
        return [];
    }

    onCommitted(e)
    {
        if(this.doesTransitionTypeResetSearch(e.transitionType))
        {
            this.resetTabHisoryAndSearch(e.tabId);
        }
    }


    doesTransitionTypeResetSearch(transitionType)
    {
        if(transitionType == "link")
            return false;
        if(transitionType == "manual_subframe") //back and forth button
            return false;
        if(transitionType == "reload") //back and forth button
            return false;
        return true;
}

}
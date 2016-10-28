import ElasticLunr from 'elasticlunr';
import UrlUtils from './urlUtils.js';
import HitagUtils from './ui/hitagUtils.js';
import ChromeStorage from './chromeStorage.js';
import SearchEngine from './searchEngine.js';
import UserState from './userState.js';
import Utils from './utils.js';
import TabsController from './tabsController.js';

//chrome.runtime.onConnect.addListener(onContentConnected);
chrome.runtime.onMessage.addListener(onContentMessage);
//chrome.tabs.onUpdated.addListener(onTabUpdated);
//chrome.tabs.onCreated.addListener(onTabCreated);
//chrome.tabs.onRemoved.addListener(onTabRemoved);
//chrome.webNavigation.onCommitted.addListener(onCommitted);
chrome.omnibox.onInputEntered.addListener(onOmniboxEnter);
chrome.omnibox.onInputChanged.addListener(onOmniboxInputChanged);
chrome.browserAction.onClicked.addListener(onBrowserActionClicked);


chrome.webNavigation.onDOMContentLoaded.addListener(onDOMContentLoaded);

var userState = null;
var clipboard = "";
//var contentPort = {};
var searchPage ="search.html";

var _tabs =[];
var tabs = new TabsController();
//var tabs.popupId = "popup";
var searchEngine = null;

var hitagsIndex =HitagUtils.getNewTagNode("root");
start(); 

function initTab(tabId)
{
    console.log("initTab "+ tabId);

    tabs[tabId] ={};
    tabs[tabId].port = null;
    tabs[tabId].history =[];
    tabs[tabId].searchText = "";
    tabs[tabId].queuedMessages =[];
}

function _onContentConnected (port)
{
    var tabId = "";

    if(!port.sender.tab)//its probably an extension popup
        tabId = tabs.popupId;
    else
        tabId = port.sender.tab.id;

    console.log("Connected " + tabId);

    if(!tabs.tabExists(tabId))
        tabs.initTab(tabId);

    tabs[tabId].port = port;
    
    while(tabs[tabId].queuedMessages.length>0)
    {
        tabs[tabId].port.postMessage(tabs[tabId].queuedMessages.shift());
    }

    if(userState.getHelpShownTimes() == 0)
        onShowHelp();
}

function _sendMessage(event, value, tabId)
{
    var message = {event:event, value:value};

    if(!tabs.tabExists(tabId))
        tabs.initTab(tabId);

    if(tabs[tabId].port == null)
    {
        console.log("Queueing " + tabId + ": "+ message.event);
        tabs[tabId].queuedMessages.push(message);
    }
    else
    {
        console.log("Posting to "+ tabId + ": "+ message.event);
        tabs[tabId].port.postMessage(message);
    }
}

function onContentMessage(message, sender, sendResponse)
{
    processMessage(message.event, message.value, sender.tab);
}

function processMessage(event, value, tab)
{
    //content
    if(event == "onCopy")
        onCopy(value);
    if(event == "onSelected")
        onSelected(value); 
    if(event == "onHelpShown")
        onHelpShown();  
    //app
    if(event == "searchRequest")
        onSearchRequested(value, tab.id); 
    //popup 
    if(event == "showHelp")
        onShowHelp(tab);
    if(event == "saveUrl")
        onSaveUrl(tab);
    if(event== "getSuggestedHitags")
        onGetSuggestedHitags(value);
    if(event== "setHitagToContent")
        onAddHitag(value);
}

function onCopy(str)
{
    clipboard = str;
}

function onSearchRequested(searchStr, tabId)
{
    var lunrResults =  searchEngine.getLunrSearchResults(searchStr);
    var uiResults = lunrResultsToUiResults(lunrResults);
    tabs.sendMessage("updateSearchResults", uiResults, tabId);
}

function goToUrl(url)
{
    chrome.tabs.update(null, {url:url});
}

//OMNIBOX

function getSearchPageUrl(searchStr)
{
    return searchPage+"?search="+searchStr;
}

var urlToGo = "";
function onOmniboxInputChanged(text, suggest)
{
    var omniboxMaxSuggestions = 5;
    var minScore = 0.1;
    var results = searchEngine.getLunrSearchResults(text);

    results =  searchEngine.filterLunrResults(results, minScore, omniboxMaxSuggestions);

    var suggestions = lunrResultsToSuggestions(results);
    if(suggestions.length == 0)
    {
        setOmniboxSuggestion("Mostra resultats per '"+text+"'", getSearchPageUrl(text));
    }
    else
    {   
        var bestResultScore = results[0].score;

        if(bestResultScore < 1)
        {
            setOmniboxSuggestion("Mostra resultats per '"+text+"'", getSearchPageUrl(text));
        }
        else
        {
            var firstSuggestion = suggestions.shift();
            setOmniboxSuggestion(firstSuggestion.description, firstSuggestion.content);
        }
    }
    suggest(suggestions);
}

function lunrResultsToSuggestions(results)
{
    var suggestions = [];
    for (var i = 0; i < results.length; i++)
        suggestions.push(lunrResultToSuggestion(results[i]));
    return suggestions;
}

function lunrResultToSuggestion(result)
{
    var entry = searchEngine.getDocumentByRef(result.ref);
    var scoreStr = (Math.round(result.score * 100) / 100).toString();

    var suggestion =
    {
        content: entry.url,
        description: scoreStr + ": " + prepareSuggestion(entry.content)
    }
    return suggestion;
}

function setOmniboxSuggestion(str, url)
{
    urlToGo = url;
    var obj = {description: str};
    chrome.omnibox.setDefaultSuggestion(obj);
}

function onOmniboxEnter(str)
{
    if(urlToGo)
        goToUrl(urlToGo);
    else
        goToUrl(str);
}


//CONFIG

function start()
{
    //chrome.storage.local.clear();
    console.log("start");
    userState = new UserState();
    userState.load(onUserStateLoaded);
   // ChromeStorage.loadElement("stateConfig", onUserStateLoaded );
}


function onUserStateLoaded()
{
    ChromeStorage.loadElement("index", function(loadedIndex)
    {
        searchEngine = new SearchEngine(loadedIndex);
    });
        //searchEngine.reIndex(stateConfig.currentUId);
}

function prepareSuggestion(str)
{
    //linebreaks are not supported on Omnibox
    if(str)
    return str.replace(/(\r\n|\n|\r)/gm,"");
}

//SAMANTHA SEARCH PAGE
function lunrResultToUiResult(result)
{
    var entry = searchEngine.getDocumentByRef(result.ref);

    var uiResult =
    {
        score: result.score,
        timestamp:entry.timestamp,
        id:entry.id,
        url: entry.url, 
        content: entry.content
    }

    return uiResult;
}

function lunrResultsToUiResults(results)
{
    var uiResults = [];
    for (var i = 0; i < results.length; i++)
        uiResults.push(lunrResultToUiResult(results[i]));
    return uiResults;
}

//BROWSER ACTION

function onBrowserActionClicked(tab)
{
    //If no popup.html Utils.objExist this will be triggered
}

function onSaveUrl()
{
    tabs.getCurrentTab(function(tab)
    {
        if(!UrlUtils.urlIsSavable(tab.url))
        {
            sendSaveError(tabs.popupId);
            return;
        }

        var retrieve = createRetrieve(tabs.getOriginalSearchText(tab.id), tabs.getHistorySinceSearch(tab.id));
        var existingAtom = getAtomByUrl(tab.url);

        if(existingAtom)
        {
            addRetrive(existingAtom, retrieve);
            sendAlreadySaved(tabs.popupId);
            updatePopupAtom(existingAtom);
            return;
        }

        var page = createPage(tab.url, tab.title, tab.favIconUrl);
        var content = null;
        
        var atom = createAtom(page);
        addRetrive(atom, retrieve);

        saveAtom(atom);

        updatePopupAtom(atom);

        sendSaveOk(tabs.popupId);
    })
}

function updatePopupAtom(atom)
{
    tabs.sendMessage("updatePopupAtom", atom, tabs.popupId);
}

function onAddHitag(hitag)
{
    tabs.getCurrentTab(function(tab)
    {
        var existingAtom = getAtomByUrl(tab.url);

        if(existingAtom)
        {
            addHitagToAtom(existingAtom, hitag);

            HitagUtils.saveHitagNode(hitag, hitagsIndex);
            updatePopupAtom(existingAtom);
            return;
        }
        else
        {
            console.log("Trying to save hitag to unexisting content");
        }
    })
}

function addHitagToAtom(atom, hitag)
{
    if(!atom.relations)
        atom.relations = {};

    if(!atom.relations.hitags)
        atom.relations.hitags = HitagUtils.getNewTagNode("root");

    console.log(atom);

    HitagUtils.saveHitagNode(hitag, atom.relations.hitags);
}

function saveAtom(atom)
{
    var entry = searchEngine.createEntryFromAtom(atom, userState.getNewUId());
    searchEngine.addSearchEntry(entry);
    ChromeStorage.saveElement(entry.id, atom);

    searchEngine.saveIndex();
    userState.save();
}

function getAtomByUrl(url)
{
    var results = searchEngine.getLunrUrlSearchResults(url);

    if(results.length>1)
        console.warn("Some how there are multipe atoms for url:" + url);

    if(results.length>0)
    {
       var atom =  searchEngine.getDocumentByRef(results[0].ref);
       return atom;
    }

    return null;
}

function sendSaveError(tabId)
{
    var status =
    {
        statusType : "error",
        message:"Ops! Can't be save this :("

    }
    tabs.sendMessage("updatePopupStatus", status, tabId);
}

function sendAlreadySaved(tabId)
{
    var status =
    {
        statusType : "ok",
        message:"Already saved!"

    }
    tabs.sendMessage("updatePopupStatus", status, tabId);
}

function sendSaveOk(tabId)
{
    var status =
    {
        statusType : "ok",
        message:"Saved"

    }
    tabs.sendMessage("updatePopupStatus", status, tabId);
}

function createAtom(page)
{
    var atom =
    {
        v:0,
        page: page,
        //content : content,
        searchWordsSum: "",
        retrieves : [],
        relations: [],
    }

    return atom;
}

function addRetrive(atom, retrieve)
{
    if(atom && atom.retrieves && retrieve)
        atom.retrieves.push(retrieve);

    if(retrieve.history.length>=2 && retrieve.searchText)
        atom.searchWordsSum += " " + retrieve.searchText;
}

function createPage(url, title, favicon)
{
    var page =
    {
        url:url,
        title:title,
        favicon: favicon
    }
    return page;
}

function createRetrieve(searchText, history)
{
    var retrieve =
    {
        time: getCurrentTime(),
        history:history,
        searchText :searchText,
    }
    return retrieve;
}

function createRelation(type, hash)
{
    var relation =
    {
        time: getCurrentTime(),
        type: type,
        hash :hash,
    }
    return relation;
}

function _getOriginalSearchText(tabId)
{
    if(tabHistoryExists(tabId))
        return tabs[tabId].searchText;
    return null;
}

function _getHistorySinceSearch(tabId)
{
    if(tabHistoryExists(tabId))
        return Utils.copyObj(tabs[tabId].history);
    return [];
}

function getCurrentTime()
{
    return new Date().toJSON();
}

function _getCurrentTab(onTap)
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

function _onTabCreated(tab)
{
    tabs.initTab(tab.id);

    if(!Utils.objExist(tab.openerTabId))
        return;

    //we add the history and serach text of the tab that opened this one
    setTabSearch(tab.id, getOriginalSearchText(tab.openerTabId));
    setTabHistory(tab.id, getHistorySinceSearch(tab.openerTabId));
}

function _onCommitted(e)
{
    if(doesTransitionTypeResetSearch(e.transitionType))
    {
        resetTabHisoryAndSearch(e.tabId);
    }
}

function _resetTabHisoryAndSearch(tabId)
{
    if(!tabs.tabExists(tabId))
        return;
    
    setTabSearch(tabId, "");
    setTabHistory(tabId, []);
}

function _doesTransitionTypeResetSearch(transitionType)
{
    if(transitionType == "link")
        return false;
    if(transitionType == "manual_subframe") //back and forth button
        return false;
    if(transitionType == "reload") //back and forth button
        return false;
    return true;
}

function onDOMContentLoaded(e)
{
    //console.log("Dom");
    //console.log(e);
}

function _onTabUpdated(tabId, changeInfo, tab)
{
    if(changeInfo.status != "loading")//loading event can´t connect to port yey
        return;

    if(!tabs.tabExists(tabId))
        tabs.initTab(tabId);

    tabs[tabId].port = null;//Here, new port hasn´t connected yet. We set it to null so if we sent a message it will be queued instead of failing
    //contentPort = null;//Here, new port hasn´t connected yet. We set it to null so if we sent a message it will be queued instead of failing

    //we use this to know if its a serach engine
    var searchText = UrlUtils.getSearchText(tab.url);
    if(searchText)
    {
        resetTabHisoryAndSearch(tabId);
        setTabSearch(tabId, searchText);
        injectSamanthaResults(tab.id, searchText);
    }
    
    if(tabHistoryExists(tab.id))
        addUrlToHistory(tab.id, tab.url);
}

function _onTabRemoved(tabId, removeInfo)
{
    delete tabs[tabId];
}

function _setTabSearch(tabId, searchText)
{
    tabs[tabId].searchText = searchText;
}

function _setTabHistory(tabId, history)
{
    tabs[tabId].history = history;
}

function _addUrlToHistory(tabId, url)
{
    if(urlIsNotTheSame(tabId, url))
        tabs[tabId].history.push(url);
}

function _urlIsNotTheSame(tabId, url)
{
    var tabLength = tabs[tabId].history.length-1;
    if(tabs[tabId].history[tabLength] == url) //url is not the same as the last register
        return false;

    return true;
}

function _tabHistoryExists(tabId)
{
    if(tabs.tabExists(tabId))
        return Utils.objExist(tabs[tabId].history);
    return false;
}

function injectSamanthaResults(tabId, searchText)
{
    tabs.sendMessage("inject", searchText, tabId);
}

function _objExist(obj)
{
    if (typeof obj != "undefined")
        return true;

    return false;
}

function _copy(obj)
{
    return JSON.parse(JSON.stringify(obj));
}

function onGetSuggestedHitags(inProgressHitag)
{
    var currentHitagNode = HitagUtils.getHitagNode(inProgressHitag.hitag, hitagsIndex);

    if(!currentHitagNode)
        return null;

    var matchingTags = HitagUtils.getMatchingChildren(currentHitagNode, inProgressHitag.inputTag);
    var suggestedHitags=[];
    
    matchingTags.map(function(tagName, index)
    {
        var suggestion = inProgressHitag.hitag.slice(0);
        suggestion.push(tagName);
        suggestedHitags.push(suggestion);
    });
    

    tabs.sendMessage("updateHitagSuggestions", suggestedHitags, tabs.popupId);
}

function logRootHitagNode()
{
    HitagUtils.log(hitagsIndex);
}

function onShowHelp()
{
    tabs.getCurrentTab(function(tab)
    {
        tabs.sendMessage("showHelp", null, tab.id);
    });
}

function onHelpShown()
{
    userState.onHelpShown();
    userState.save();
}
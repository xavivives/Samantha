import ElasticLunr from 'elasticlunr';
import OtherSearchEngines from './otherSearchEngines.js';
import HitagUtils from './hitagUtils.js';

var otherSearchEngines = new OtherSearchEngines();

chrome.runtime.onConnect.addListener(onContentConnected);
chrome.runtime.onMessage.addListener(onContentMessage);
chrome.omnibox.onInputEntered.addListener(onOmniboxEnter);
chrome.omnibox.onInputChanged.addListener(onOmniboxInputChanged);
chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
chrome.tabs.onUpdated.addListener(onTabUpdated);
chrome.tabs.onCreated.addListener(onTabCreated);
chrome.tabs.onRemoved.addListener(onTabRemoved);
chrome.webNavigation.onCommitted.addListener(onCommitted);
chrome.webNavigation.onDOMContentLoaded.addListener(onDOMContentLoaded);


var stateConfig = null;
var index = null;
var clipboard = "";
//var contentPort = {};
var searchPage ="search.html";

var tabs =[];
var popupId = "popup";

var rootHitag =HitagUtils.getNewTagNode("root");
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

function onContentConnected (port)
{
    var tabId = "";

    if(!port.sender.tab)//its probably an extension popup
        tabId = popupId;
    else
        tabId = port.sender.tab.id;

    console.log("Connected " + tabId);

    if(!exists(tabs[tabId]))
        initTab(tabId);

    tabs[tabId].port = port;
    
    while(tabs[tabId].queuedMessages.length>0)
    {
        tabs[tabId].port.postMessage(tabs[tabId].queuedMessages.shift());
    }
}

function sendMessage(event, value, tabId)
{
    var message = {event:event, value:value};

    if(!exists(tabs[tabId]))
        initTab(tabId);

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
    //app
    if(event == "searchRequest")
        onSearchRequested(value, tab.id); 
    //popup 
    if(event == "saveUrl")
        onSaveUrl(tab); 

    if(event== "getSuggestedHitags")
        onGetSuggestedHitags(value);
    if(event== "setHitagToContent")
        onSetHitagToContent(value);
}

function onCopy(str)
{
    clipboard = str;
}

function onSelected(selectionObj)
{
    return; 
    //var entry = createEntryFromSelection(selectionObj.url, selectionObj.selectedText);
    //addEntry(entry);
}

function onSearchRequested(searchStr, tabId)
{
    var lunrResults =  getLunrSearchResults(searchStr);
    var uiResults = lunrResultsToUiResults(lunrResults);
    sendMessage("updateSearchResults", uiResults, tabId);
}

function initNewIndex()
{
    index = ElasticLunr(function () {
        this.setRef('id');
        this.addField('url');
        this.addField('urlTitle');
        this.addField('searchWordsSum');
    });
    //removes stemmers and no words
    index.pipeline.reset();
}

function getLunrSearchResults(textToSearch)
{
    var config =
    {
        fields:
        {
            url:
            {
                boost: 1,
                bool: "OR"
            },
            urlTitle:
            {
                boost: 1,
                bool: "OR"
            },
            searchWordsSum:
            {
                boost: 2,
                bool: "OR"
            }
        },
        bool: "OR",
        expand: true
    }

    var results = index.search(textToSearch, config);

    return results;
}

function createEntryFromAtom(atom)
{
     var entry = 
    {
        "id" : getNewUId(),
        "url" : atom.page.url,
        "urlTitle" : atom.page.title,
        "searchWordsSum":atom.searchWordsSum
    }

    return entry;
}

function getLunrUrlSearchResults(urlToSearch)
{
    var config =
    {
        fields:
        {
            url:
            {
                boost: 1,
                bool: "OR"
            }
        },
        bool: "OR",
        expand: true
    }

    var results = index.search(urlToSearch, config);

    return results;
}

function filterLunrResults(results, minScore, maxResults)
{
    var filteredResults = [];
    var resultsNumber = results.length;

    if(maxResults<results.length)
        resultsNumber = maxResults;

    for (var i = 0; i < resultsNumber; i++)
    { 
        if(results[i].score < minScore)//results are sorted by score
            return filteredResults;

        filteredResults.push(results[i]);
    }
    return filteredResults;
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
    var results = getLunrSearchResults(text);

    results =  filterLunrResults(results, minScore, omniboxMaxSuggestions);

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
    var entry = index.documentStore.getDoc(result.ref);
    var scoreStr = (Math.round(result.score * 100) / 100).toString();

    var suggestion =
    {
        content: entry.url,
        description: scoreStr + ": " + prepareSuggestion(entry.content)
    }
    return suggestion;
}

function getAtomByRef(ref)
{
    return index.documentStore.getDoc(ref);
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

//SEARCH

function addSearchEntry(entry)
{
    index.addDoc(entry);
}

function createEntryFromSelection(url, content)
{
    /*var entry = 
    {
        "id" : getNewUId(),
        "url" : url,
        "content" : content
    }

    return entry;
    */
}

function getNewUId()
{
    stateConfig.currentUId ++;
    return stateConfig.currentUId.toString();
}

function reIndex()
{
    function onEntryRetrived(entry)
    {   
        if(entry)
            addSearchEntry(entry);
    }

    for (var i = 0; i<stateConfig.currentUId; i++)
        loadElement(i.toString(), onEntryRetrived);       
}

//STORAGE

function saveIndex()
{
    saveElement("index", index.toJSON());
}

function saveElement(key, element, onSaved)
{
    var obj= {};
    obj[key] = element;
    chrome.storage.local.set(obj, onSaved);
}

function loadElement(key, onLoaded)
{
    function onElementLoaded(obj)
    {
        if(obj[key])
            onLoaded(obj[key]);
        else
            onLoaded(null);
    }

    chrome.storage.local.get(key, onElementLoaded);
}

//delete me
/*function getEntry(id, onEntryRetrivedCallback)
{
    chrome.storage.local.get(id, onEntryRetrivedCallback);
}*/

//CONFIG

function start()
{
    //chrome.storage.local.clear();
    console.log("start");
    loadElement("stateConfig", onStateConfigLoaded );
}

function saveStateConfig()
{
    saveElement("stateConfig", stateConfig);
}

function onStateConfigLoaded(config)
{
    function onIndexLoaded(loadedIndex)
    {
        //if(false)
        if(loadedIndex)
            index = ElasticLunr.Index.load(loadedIndex);
        else
            initNewIndex();
    }
    
    initStateConfig(config);
    loadElement("index", onIndexLoaded);
    //reIndex();
}

function initStateConfig(config)
{
    if(config && config.currentUId)
    {
        stateConfig = config;
    }
    else
    {
        stateConfig = {};
        stateConfig.currentUId = 0;
    }
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
    var entry = index.documentStore.getDoc(result.ref);

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
    //If no popup.html exists this will be triggered
}

function onSaveUrl()
{
    getCurrentTab(function(tab)
    {
        if(!urlIsSavable(tab.url))
        {
            sendSaveError(popupId);
            return;
        }

        var retrieve = createRetrieve(getOriginalSearchText(tab.id), getHistorySinceSearch(tab.id));
        var existingAtom = getAtomByUrl(tab.url);

        if(existingAtom)
        {
            addRetrive(existingAtom, retrieve);
            sendAlreadySaved(popupId);
            return;
        }

        var page = createPage(tab.url, tab.title, tab.favIconUrl);
        var content = null;
        
        var atom = createAtom(page);
        addRetrive(atom, retrieve);

        saveAtom(atom);

        sendSaveOk(popupId);
    })
}

function saveAtom(atom)
{
    var entry = createEntryFromAtom(atom);
    addSearchEntry(entry);
    saveElement(entry.id, atom);

    saveIndex();
    saveStateConfig();
}

function urlIsSavable(url)
{
    if(url == null)
        return false;
    if(url.indexOf("chrome://") == 0)
        return false;
    return true;
}

function getAtomByUrl(url)
{
    var results = getLunrUrlSearchResults(url);

    if(results.length>1)
        console.warn("Some how there are multipe atoms for url:" + url);

    if(results.length>0)
    {
       var atom =  getAtomByRef(results[0].ref);
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
    sendMessage("updatePopupStatus", status, tabId);
}

function sendAlreadySaved(tabId)
{
    var status =
    {
        statusType : "ok",
        message:"Already saved!"

    }
    sendMessage("updatePopupStatus", status, tabId);
}

function sendSaveOk(tabId)
{
    var status =
    {
        statusType : "ok",
        message:"Saved"

    }
    sendMessage("updatePopupStatus", status, tabId);
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

function getOriginalSearchText(tabId)
{
    if(tabHistoryExists(tabId))
        return tabs[tabId].searchText;
    return null;
}

function getHistorySinceSearch(tabId)
{
    if(tabHistoryExists(tabId))
        return copy(tabs[tabId].history);
    return [];
}

function getCurrentTime()
{
    return new Date().toJSON();
}

function getCurrentTab(onTap)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        var activeTabId = activeTab.id; 
        onTap(activeTab);
    });
}

function onTabCreated(tab)
{
    initTab(tab.id);

    if(!exists(tab.openerTabId))
        return;

    //we add the history and serach text of the tab that opened this one
    setTabSearch(tab.id, getOriginalSearchText(tab.openerTabId));
    setTabHistory(tab.id, getHistorySinceSearch(tab.openerTabId));
}

function onCommitted(e)
{
    if(doesTransitionTypeResetSearch(e.transitionType))
    {
        resetTabHisoryAndSearch(e.tabId);
    }
}

function resetTabHisoryAndSearch(tabId)
{
    if(!exists(tabs[tabId]))
        return;
    
    setTabSearch(tabId, "");
    setTabHistory(tabId, []);
}

function doesTransitionTypeResetSearch(transitionType)
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

function onTabUpdated(tabId, changeInfo, tab)
{
    if(changeInfo.status != "loading")//loading event can´t connect to port yey
        return;

    if(!exists(tabs[tabId]))
        initTab(tabId);

    tabs[tabId].port = null;//Here, new port hasn´t connected yet. We set it to null so if we sent a message it will be queued instead of failing
    //contentPort = null;//Here, new port hasn´t connected yet. We set it to null so if we sent a message it will be queued instead of failing

    //we use this to know if its a serach engine
    var searchText = otherSearchEngines.getSearchText(tab.url);
    if(searchText)
    {
        resetTabHisoryAndSearch(tabId);
        setTabSearch(tabId, searchText);
        injectSamanthaResults(tab.id, searchText);
    }
    
    if(tabHistoryExists(tab.id))
        addUrlToHistory(tab.id, tab.url);
}

function onTabRemoved(tabId, removeInfo)
{
    delete tabs[tabId];
}

function setTabSearch(tabId, searchText)
{
    tabs[tabId].searchText = searchText;
}

function setTabHistory(tabId, history)
{
    tabs[tabId].history = history;
}

function addUrlToHistory(tabId, url)
{
    if(urlIsNotTheSame(tabId, url))
        tabs[tabId].history.push(url);
}

function urlIsNotTheSame(tabId, url)
{
    var tabLength = tabs[tabId].history.length-1;
    if(tabs[tabId].history[tabLength] == url) //url is not the same as the last register
        return false;

    return true;
}

function tabHistoryExists(tabId)
{
    if(exists(tabs[tabId]))
        return exists(tabs[tabId].history);
    return false;
}

function injectSamanthaResults(tabId, searchText)
{
    sendMessage("inject", searchText, tabId);
   // sendMessage("inject", getSearchPageUrl(searchText));
}

function exists(obj)
{
    if (typeof obj != "undefined")
        return true;

    return false;
}

function copy(obj)
{
    return JSON.parse(JSON.stringify(obj));
}

function onGetSuggestedHitags(inProgressHitag)
{
    var hitagNode = HitagUtils.getHitagNode(inProgressHitag.hitag, rootHitag);
    var suggestedHitags=[];
    if(hitagNode)
    {
        hitagNode.children.map(function(child, index)
        {
            suggestedHitags.push(child.tagName);
        });
    }
    sendMessage("updateHitagSuggestions", suggestedHitags, popupId);
}

function onSetHitagToContent(hitag)
{
    console.log(hitag);
    HitagUtils.saveHitag(hitag, rootHitag);
}

function logRootHitagNode()
{
    HitagUtils.log(rootHitag);
}
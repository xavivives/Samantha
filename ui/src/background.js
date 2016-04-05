import ElasticLunr from 'elasticlunr';
import HtmlMetadata from 'html-metadata';
import OtherSearchEngines from './otherSearchEngines.js';

var otherSearchEngines = new OtherSearchEngines();

chrome.runtime.onConnect.addListener(onContentConnected);
chrome.runtime.onMessage.addListener(onContentMessage);
chrome.omnibox.onInputEntered.addListener(onOmniboxEnter);
chrome.omnibox.onInputChanged.addListener(onOmniboxInputChanged);
chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
chrome.tabs.onUpdated.addListener(onTabUpdate);

var stateConfig = null;
var index = null;
var clipboard = "";
var contentPort = {};
var searchPage ="search.html";

var tabsHistory ={};

start();    

function onContentConnected ( port )
{
    console.log(port);
    contentPort = port;
    sendMessage("log", "Connected with background");
}

function sendMessage(event, value)
{
    var message = {event:event, value:value};
    contentPort.postMessage(message);
}

function onContentMessage(message, sender, sendResponse)
{
    //console.log(sender);
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
        onSearchRequested(value); 
    //popup 
    if(event == "saveUrl")
        onSaveUrl(tab); 
}

function onCopy(str)
{
    clipboard = str;
}

function onSelected(selectionObj)
{
    return;
    var entry = createEntryFromSelection(selectionObj.url, selectionObj.selectedText);
    addEntry(entry);
}

function addEntry(entry)
{
    addSearchEntry(entry);
    saveEntry(entry);
    saveIndex();
    saveStateConfig();
}

function onSearchRequested(searchStr)
{
    var lunrResults =  getLunrSearchResults(searchStr);
    var uiResults = lunrResultsToUiResults(lunrResults);
    sendMessage("updateSearchResults", uiResults);
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
            content:
            {
                boost: 2
            }
        },
        bool: "OR",
        expand: true
    }

    var results = index.search(textToSearch, config);

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
    var results =  filterLunrResults(getLunrSearchResults(text),minScore, omniboxMaxSuggestions);

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

function initNewIndex()
{
    index = ElasticLunr(function () {
        this.setRef('id');
        this.addField('url');
        this.addField('content');
    });
    //removes stemmers and no words
    index.pipeline.reset();
}

function addSearchEntry(entry)
{
    index.addDoc(entry);
}

function createEntryFromSelection(url, content)
{
    var entry = 
    {
        "id" : getNewUId(),
        "url" : url,
        "content" : content
    }

    return entry;
}

function createEntryFromAtom(atom)
{
     var entry = 
    {
        "id" : getNewUId(),
        "url" : atom.page.url,
        "content" : atom.page.title,
    }

    return entry;
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

function saveEntry(entry)
{   
    saveElement(entry.id, entry);
}

function saveIndex()
{
    saveElement("index", index.toJSON());
}

function saveElement(key, element, onSaved)
{
    //console.log("Saving :"+key);
    //console.log(element);
    var obj= {};
    obj[key] = element;
    chrome.storage.local.set(obj, onSaved);
}

function loadElement(key, onLoaded)
{
    //console.log("Loading :"+key);

    function onElementLoaded(obj)
    {
        //console.log(obj)
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
//If no popup.html exists
function onBrowserActionClicked(tab)
{
    var page = createPage(tab.url, tab.title, tab.favIconUrl);
    var content = null;
    var atom = createAtom(page, content);
    var entry = createEntryFromAtom(atom);
    addEntry(entry);
}

function onSaveUrl()
{
    getCurrentTab(function(tab)
    {
        if(!urlIsSavable(tab.url))
        {
            sendSaveError();
            return;
        }

        if(urlIsSavedAlready)
        {

        }

        HtmlMetadata(tab.url).then(function(metadata)
        {
            console.log(metadata);
        });

        var page = createPage(tab.url, tab.title, tab.favIconUrl);
        var content = null;
        var atom = createAtom(page, content);
        var entry = createEntryFromAtom(atom);
        addEntry(entry);
        sendSaveOk();
    })
    
}

function urlIsSavable(url)
{
    if(url == null)
        return false;
    if(url.indexOf("chrome://") == 0)
        return false;
    return true;
}

function urlIsSavedAlready(url)
{
    return false;
}

function sendSaveError()
{
    var status =
    {
        statusType : "error",
        message:"Ops! Can't be save this :("

    }
    sendMessage("updatePopupStatus", status)
}

function sendSaveOk()
{
    var status =
    {
        statusType : "ok",
        message:"Saved"

    }
    sendMessage("updatePopupStatus", status)
}

function createAtom(page, content)
{
    var atom =
    {
        v:0,
        page: page,
        content : content,
        retrieves : [],
        relations: [],
    }
    return atom;
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

function createRetrieve(searchKeys, history)
{
    var retrieve =
    {
        time: getCurrentTime(),
        history:history,
        searchKeys :searchKeys,
    }
    return retrieve;
}

function createRelation(type, hash)
{
    var retrieve =
    {
        time: getCurrentTime(),
        type: type,
        hash :hash,
    }
    return retrieve;
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

function onTabUpdate(tabId, changeInfo, tab)
{
    console.log(changeInfo.status);
    if(changeInfo.status != "loading")
        return;

    var isEngine = otherSearchEngines.isEngine(tab.url);

    if(isEngine)
    {
        resetTabHistory(tab.id, tab.url);
    }

    if(tabHistoryExists(tab.id))
    {
        addUrlToHistory(tab.id, tab.url);
    }
}

function resetTabHistory(tabId, url)
{
    var searchText = otherSearchEngines.getSearchText(url);
    tabsHistory[tabId]={};
    tabsHistory[tabId].history = [];
    tabsHistory[tabId].searchStr = searchText;
}


function addUrlToHistory(tabId, url)
{
    if(urlIsNotTheSame(tabId, url))
    {
        tabsHistory[tabId].history.push(url);
        console.log(tabsHistory);
    }
}

function urlIsNotTheSame(tabId, url)
{
    var tabLength = tabsHistory[tabId].history.length-1;
    if(tabsHistory[tabId].history[tabLength] == url) //url is not the same as the last register
        return false;

    return true;
}

function tabHistoryExists(tabId)
{
    if (typeof tabsHistory[tabId] != "undefined")
        return true;

    return false;
}
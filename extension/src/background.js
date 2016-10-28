import ElasticLunr from 'elasticlunr';
import UrlUtils from './urlUtils.js';
import HitagUtils from './ui/hitagUtils.js';
import ChromeStorage from './chromeStorage.js';
import SearchEngine from './searchEngine.js';
import UserState from './userState.js';
import Utils from './utils.js';
import TabsController from './tabsController.js';

chrome.omnibox.onInputEntered.addListener(onOmniboxEnter);
chrome.omnibox.onInputChanged.addListener(onOmniboxInputChanged);
chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
chrome.webNavigation.onDOMContentLoaded.addListener(onDOMContentLoaded);

var userState = null;
var clipboard = "";
var searchPage ="search.html";
var tabs = null;
var searchEngine = null;
var urlToGo = "";
var hitagsIndex = HitagUtils.getNewTagNode("root");
start(); 

function start()
{
    //chrome.storage.local.clear();
    console.log("start");
    userState = new UserState();
    userState.load(onUserStateLoaded);
    tabs = new TabsController(processMessage);
   // ChromeStorage.loadElement("stateConfig", onUserStateLoaded );
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

//OMNIBOX

function getSearchPageUrl(searchStr)
{
    return searchPage+"?search="+searchStr;
}

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
        UrlUtils.goToUrl(urlToGo);
    else
        UrlUtils.goToUrl(str);
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

function getCurrentTime()
{
    return new Date().toJSON();
}

function onDOMContentLoaded(e)
{
}

function injectSamanthaResults(tabId, searchText)
{
    tabs.sendMessage("inject", searchText, tabId);
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
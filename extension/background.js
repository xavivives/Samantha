chrome.runtime.onConnect.addListener(onContentConnected);
chrome.runtime.onMessage.addListener(onContentMessage);
chrome.omnibox.onInputEntered.addListener(onOmniboxEnter);
chrome.omnibox.onInputChanged.addListener(onOmniboxInputChanged);

var stateConfig = null;
var index = null;
var clipboard = "";
setOmniboxSuggestion("What are you looking for?");

start();

function onContentConnected ( port )
{
    port.postMessage("Conected with content");
}

function onContentMessage(message, sender, sendResponse)
{
    processMessage(message.event, message.value);
}

function processMessage(event, value)
{
    if(event == "onCopy")
        onCopy(value);  
    if(event == "onSelected")
        onSelected(value);  
}

function onCopy(str)
{
    clipboard = str;
}

function onSelected(selectionObj)
{
    var entry = getNewEntry(selectionObj.url, selectionObj.selectedText);
    addSearchEntry(entry);
    saveEnry(entry);
    saveStateConfig();
}

function onOmniboxEnter(str)
{
    goToUrl(str);
}

function getSearchResults(textToSearch)
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

function resultsIntoSuggestions(results, maxResults, minScore)
{
    var suggestions = [];
    for (i = 0; i < results.length; i++)
    { 
        if(results[i].score<minScore)
            return suggestions;

        var entry = index.documentStore.getDoc(results[i].ref);

        var suggestion =
        {
            content: entry.url,
            description: entry.content
        }
        suggestions.push(suggestion);
    }
    return suggestions;
}

function goToUrl(url)
{
    chrome.tabs.update(null, {url:url});
}

//OMNIBOX

function onOmniboxInputChanged(text, suggest)
{
    var results =  getSearchResults(text);
    var suggestions = resultsIntoSuggestions(results);
    suggest(suggestions);
}

function setOmniboxSuggestion(str)
{
    var obj = {description: str};
    chrome.omnibox.setDefaultSuggestion(obj);
}

//SEARCH

function initSearch()
{
    index = elasticlunr(function () {
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

function getNewEntry(url, content)
{
    var entry = 
    {
        "id" : getNewUId(),
        "url" : url,
        "content" : content
    }

    return entry;
}

function getNewUId()
{
    stateConfig.currentUId ++;
    return stateConfig.currentUId.toString();
}

function populateSearchIndex()
{
    for (var i = 0; i<stateConfig.currentUId; i++)
    {
        getEntry(i.toString(), onEntryRetrived);
        
    }
}


//STORAGE

function saveEnry(entry)
{   
    var obj= {};
    obj[entry.id] = entry;
    chrome.storage.local.set(obj, function(){});
}

function getEntry(id, onEntryRetrivedCallback)
{
    chrome.storage.local.get(id, onEntryRetrivedCallback);
}

function onEntryRetrived(obj)
{   
    var entry = obj[Object.keys(obj)[0]];//first object of the object
    console.log(entry);
    if(!entry)
        return;
    addSearchEntry(entry);
}



//CONFIG

function start()
{
    //chrome.storage.local.clear();
    console.log("start");
    chrome.storage.local.get("stateConfig", onStateConfigRetrivedCallback);
}

function saveStateConfig()
{
    chrome.storage.local.set({ stateConfig: stateConfig }, function(){});
}

function onStateConfigRetrivedCallback(obj)
{
    console.log("onStateConfigRetrivedCallback");
    console.log(obj);
    initStateConfig(obj);
    initSearch();
    populateSearchIndex();
}

function initStateConfig(obj)
{
    if(obj.stateConfig && obj.stateConfig.currentUId )
    {
        stateConfig = obj.stateConfig;
    }
    else
    {
        stateConfig = {};
        stateConfig.currentUId = 0;
    }
}



chrome.runtime.onConnect.addListener(onContentConnected);
chrome.runtime.onMessage.addListener(onContentMessage);
chrome.omnibox.onInputEntered.addListener(onOmniboxEnter);
chrome.omnibox.onInputChanged.addListener(onOmniboxInputChanged);

var stateConfig = null;
var index = null;
var clipboard = "";
var contentPort = {};

start();    

function onContentConnected ( port )
{
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
    console.log("selected");
    sendMessage("updateSearchResults", "WOOWOWOWOWH!");
    var entry = getNewEntry(selectionObj.url, selectionObj.selectedText);
    addSearchEntry(entry);
    saveEnry(entry);
    saveIndex();
    saveStateConfig();
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

function resultsIntoSuggestions(results, minScore)
{
    var suggestions = [];
    var suggestionsNumber = results.length;
    var maxSuggestions = 5; //This is what chrome allows. Throws an error if bigger

    if(maxSuggestions<results.length)
        suggestionsNumber = maxSuggestions;

    for (i = 0; i < suggestionsNumber; i++)
    { 
        var score = results[i].score ;

        if(score < minScore)
            return suggestions;

        var entry = index.documentStore.getDoc(results[i].ref);
        var scoreStr = (Math.round(score*100)/100).toString();

        var suggestion =
        {
            content: entry.url,
            description: scoreStr + ": "+entry.content.trim() //linebreaks are not supported
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

var urlToGo = "";
function onOmniboxInputChanged(text, suggest)
{
    var results =  getSearchResults(text);
    var minScore = 0.1;
    var suggestions = resultsIntoSuggestions(results, minScore);
    if(suggestions.length == 0)
    {
        setOmniboxSuggestion("Mostra resultats per '"+text+"'", "/public/index.html");
    }
    else
    {   
        var bestResultScore = results[0].score;

        if(bestResultScore < 1)
        {
            setOmniboxSuggestion("Mostra resultats per '"+text+"'", "/public/index.html");
        }
        else
        {
            var firstSuggestion = suggestions.shift();
            setOmniboxSuggestion(firstSuggestion.description, firstSuggestion.content);
        }
    }
    console.log(suggestions);
    suggest(suggestions);
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

function saveEnry(entry)
{   
    saveElement(entry.id, entry);
}

function saveIndex()
{
    saveElement("index", index.toJSON());
}

function saveElement(key, element, onSaved)
{
    console.log("Saving :"+key);
    console.log(element);
    var obj= {};
    obj[key] = element;
    chrome.storage.local.set(obj, onSaved);
}

function loadElement(key, onLoaded)
{
    //console.log("Loading :"+key);

    function onElementLoaded(obj)
    {
        console.log(obj)
        if(obj[key])
            onLoaded(obj[key]);
        else
            onLoaded(null);
    }

    chrome.storage.local.get(key, onElementLoaded);
}

function getEntry(id, onEntryRetrivedCallback)
{
    chrome.storage.local.get(id, onEntryRetrivedCallback);
}


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
            index = elasticlunr.Index.load(loadedIndex);
        else
            initNewIndex();
    }
    
    initStateConfig(config);
    loadElement("index", onIndexLoaded);
    //reIndex();
}

function initStateConfig(config)
{
    console.log("here");
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

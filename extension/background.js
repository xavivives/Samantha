chrome.runtime.onConnect.addListener(onContentConnected);
chrome.runtime.onMessage.addListener(onContentMessage);
chrome.omnibox.onInputEntered.addListener(onOmniboxEnter);

var clipboard = "";

setOmniboxSuggestion("What are you looking for?");

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
    addSearchEntry(selectionObj.url, selectionObj.selectedText);
}

function onOmniboxEnter(str)
{
    console.log(results);
}

function getSearchResults(textToSearch)
{
    var config =
    {
        fields:
        {
            url:
            {
                boost: 2,
                bool: "OR"
            },
            content:
            {
                boost: 1
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
    chrome.tabs.update(null, {url:"url"});
}
//OMNIBOX

chrome.omnibox.onInputChanged.addListener(onOmniboxInputChanged);

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

var index = elasticlunr(function () {
    this.setRef('id');
    this.addField('url');
    this.addField('content');
});

//removes stemmers and no words
index.pipeline.reset();


function addSearchEntry(url, content)
{
    var entry = 
    {
        "id" : getNewUId(),
        "url" : url,
        "content" : content
    }
    console.log(entry);
    index.addDoc(entry);
}

var _currentUId = 0;

function getNewUId()
{
    _currentUId ++;
    return _currentUId;
}
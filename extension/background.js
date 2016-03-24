chrome.runtime.onConnect.addListener(onContentConnected);
chrome.runtime.onMessage.addListener(onContentMessage);
chrome.omnibox.onInputEntered.addListener(onOmniboxEnter);

var clipboard = "";

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
    setOmniboxSuggestion(str);
}

function onSelected(selectionObj)
{
    addSearchEntry(selectionObj.url, selectionObj.selectedText);
}

function onOmniboxEnter(str)
{
    var config = 
    {
        fields:
        {
            url: {boost: 2},
            content: {boost: 1}
        }
    }

    config =
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

    var results = index.search(str, config);

    console.log(results);
}

function goToUrl(url)
{
    chrome.tabs.update(null, {url:"url"});
}

function setOmniboxSuggestion(str)
{
    console.log(str);
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
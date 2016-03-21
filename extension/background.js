chrome.runtime.onConnect.addListener(function(port){
  port.postMessage("IU");
});


var port = chrome.runtime.connect();

port.onMessage.addListener(function(message, sender)
{
    console.log("GOT message from Content")
});;

var clipboard = "Empty";















//Set Text to show for custom suggested URL(s)
chrome.omnibox.setDefaultSuggestion({
    "description": "Open Bug %s "+ clipboard
});

//Fired when Enter or a suggested Link is selected
chrome.omnibox.onInputEntered.addListener(function (bugId) {
    port.postMessage("asdfa");
    //Use your custom URL
    chrome.tabs.update({
        "url": "http://bugs.example.com/BUG-" + bugId
    }, function () {
        console.log("Bug Page is open");
    });
    console.log("Input Entered is " + bugId);
});

export default class ChromeStorage
{

    static saveElement(key, element, onSaved)
    {
        var obj= {};
        obj[key] = element;
        chrome.storage.local.set(obj, onSaved);
    }

    static loadElement(key, onLoaded)
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

    static loadElements(keys, onLoaded)
    {
        function onElementsLoaded(obj)
        {
            console.log(obj)
            onLoaded(obj);
        }

        chrome.storage.local.get(keys, onElementsLoaded);
    }

}
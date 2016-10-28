import EnginesData from './engines.json';
import DomainUtil from 'tldjs';

export default class urlUtils
{
    //google use some "in between" urls to redirect. This function were detecting them as engines. 
    static isEngineUrl(url) 
    {
        var domain = DomainUtil.getDomain(url);
        if (typeof EnginesData[domain] != "undefined")
            return true;

        return false;
    }

    //for urls like this: https://www.google.com.hk/search?q=something+sweet&oq=something&aqs=chrome.1.69i59j0l5.2733j0j9&sourceid=chrome&ie=UTF-8
    static getSearchText(url)
    {
        if(!url)
            return null;

        if(!this.isEngineUrl(url))
            return;

        var urlObj = new URL(url);
        var domain = DomainUtil.getDomain(url);
        var parameterKey = EnginesData[domain];
        var params = new URLSearchParams(urlObj.search.slice(1));
        var searchText= params.get(parameterKey);
        if(!searchText)
            searchText = this.getSearchTextFromHash(url, parameterKey);
        return searchText;
    }

    //for urls like this: https://www.google.com.hk/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=something
    static getSearchTextFromHash(url, parameterKey)
    {
        if(url.indexOf("#")==-1)
            return;
        var hash = url.split('#')[1];
        //assumes one parameter onluy
        if(hash.indexOf("=")==-1)
            return; 
        var searchText = hash.split(parameterKey+"=")[1];

        searchText = decodeURIComponent(searchText);
        
        return searchText;
    }

    static urlIsSavable(url)
    {
        if(url == null)
            return false;
        if(url.indexOf("chrome://") == 0)
            return false;
        return true;
    }

    static goToUrl(url)
    {
        chrome.tabs.update(null, {url:url});
    }

}
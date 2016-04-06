import EnginesData from './engines.json';
import DomainUtil from 'tldjs';

export default class OtherSearchEngines
{
    isEngine(url)
    {
        var domain = DomainUtil.getDomain(url);
        if (typeof EnginesData[domain] != "undefined")
            return true;

        return false;
    }

    //for urls like this: https://www.google.com.hk/search?q=something+sweet&oq=something&aqs=chrome.1.69i59j0l5.2733j0j9&sourceid=chrome&ie=UTF-8
    getSearchText(url)
    {
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
    getSearchTextFromHash(url, parameterKey)
    {
        var hash = url.split('#')[1];
        //assumes one parameter onluy
        var searchText = hash.split(parameterKey+"?")[1];
        return searchText;
    }

}
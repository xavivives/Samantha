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

    getSearchText(url)
    {
        var urlObj = new URL(url);
        var domain = DomainUtil.getDomain(url);
        var parameterKey = EnginesData[domain];
        var params = new URLSearchParams(urlObj.search.slice(1));
        var searchText= params.get(parameterKey);
        return searchText;
    }

}
import ElasticLunr from 'elasticlunr';
import ChromeStorage from './chromeStorage.js';

export default class SearchEngine
{ 
    constructor(newIndex)
    {
        if(newIndex)
        {
            this.index = this.getNewIndex();
            return;
        }
        
        this.index = newIndex;
    }

    getNewIndex()
    {
        var newIndex = ElasticLunr(function () {
            this.setRef('id');
            this.addField('url');
            this.addField('urlTitle');
            this.addField('searchWordsSum');
        });
        //removes stemmers and no words
        newIndex.pipeline.reset();

        return newIndex;
    }

    _onSearchRequested(searchStr, tabId)
    {
        var lunrResults =  this.getLunrSearchResults(searchStr);
        var uiResults = lunrResultsToUiResults(lunrResults);
        sendMessage("updateSearchResults", uiResults, tabId);
    }

    getLunrSearchResults(textToSearch)
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
                urlTitle:
                {
                    boost: 1,
                    bool: "OR"
                },
                searchWordsSum:
                {
                    boost: 2,
                    bool: "OR"
                }
            },
            bool: "OR",
            expand: true
        }

        
        var results = this.index.search(textToSearch, config);

        return results;
    }

    createEntryFromAtom(atom, uID)
    {
         var entry = 
        {
            "id" : uID,
            "url" : atom.page.url,
            "urlTitle" : atom.page.title,
            "searchWordsSum":atom.searchWordsSum
        }

        return entry;
    }

    getLunrUrlSearchResults(urlToSearch)
    {
        var config =
        {
            fields:
            {
                url:
                {
                    boost: 1,
                    bool: "OR"
                }
            },
            bool: "OR",
            expand: true
        }

        var results = this.index.search(urlToSearch, config);

        return results;
    }

    filterLunrResults(results, minScore, maxResults)
    {
        var filteredResults = [];
        var resultsNumber = results.length;

        if(maxResults<results.length)
            resultsNumber = maxResults;

        for (var i = 0; i < resultsNumber; i++)
        { 
            if(results[i].score < minScore)//results are sorted by score
                return filteredResults;

            filteredResults.push(results[i]);
        }
        return filteredResults;
    }

    addSearchEntry(entry)
    {
        this.index.addDoc(entry);
    }

    reIndex(currentUId)
    {
        function onEntryRetrived(entry)
        {   
            if(entry)
                this.addSearchEntry(entry);
        }

        for (var i = 0; i<currentUId; i++)
            ChromeStorage.loadElement(i.toString(), onEntryRetrived);       
    }

    saveIndex()
    {
        ChromeStorage.saveElement("index", this.index.toJSON());
    }

    getDocumentByRef(ref)
    {
        return this.index.documentStore.getDoc(ref);
    }

}
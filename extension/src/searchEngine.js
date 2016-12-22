import ElasticLunr from 'elasticlunr';
import ChromeStorage from './chromeStorage.js';

export default class SearchEngine
{ 
    constructor(loadedIndex)
    {
        this.index = {};

        if(loadedIndex)
        {
            try
            {
                this.index = ElasticLunr.Index.load(loadedIndex);
            }
            catch(e)
            {
                console.warn("Samantha: Loaded index was corrupted. Creating a new one");
                this.index = this.getNewIndex();
            }
            
        }
        else
            this.index = this.getNewIndex();
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
            "url" : atom.getContentData(),
            "urlTitle" : atom.getName(),
            "searchWordsSum":atom.getName()
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
        console.log(this.index);
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
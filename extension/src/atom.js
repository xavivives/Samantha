import HitagUtils from './ui/hitagUtils.js';
import Utils from './utils.js';

export default class atom
{
    constructor(atomData)
    {
        this.atom = {};
        if(atomData)
            this.atom = atomData;
        //this.v=0;
        //this.page = page;
        //this.searchWordsSum = "";
        //this.retrieves = [];
        //this.relations = {};
        //this.relations.hitags = {};
    }

    addContentLink(contentLink)
    {
        this.atom.contentLink = contentLink;
    }

    getContentLink()
    {
        if(this.atom.contentLink)
            return  this.atom.contentLink;
        return "null";
    }

    addContentData(contentData)
    {
        this.atom.contentData = contentData;
    }

    getContentData()
    {
        if(this.atom.contentData)
            return  this.atom.contentData;
        return "null";
    }


    addRetrieve(retrieve)
    {
        if(!this.retrieves)
            this.retrieves = [];
        this.retrieves.push(retrieve);

        //if(retrieve.history.length>=2 && retrieve.searchText)
            //this.searchWordsSum += " " + retrieve.searchText;
    }

    addHitag(hitag)
    {
        if(!this.relations.hitags)
            this.relations.hitags = HitagUtils.getNewTagNode("root");
        
        HitagUtils.AddHitagToTree(hitag, this.relations.hitags);
    }


}
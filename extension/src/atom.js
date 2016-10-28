import HitagUtils from './ui/hitagUtils.js';

export default class atom
{
    constructor(page)
    {
        this.v=0;
        this.page = page;
        this.searchWordsSum = "";
        this.retrieves = [];
        this.relations = {};
        //this.relations.hitags = {};
    }

    addRetrieve(retrieve)
    {
        this.retrieves.push(retrieve);

        if(retrieve.history.length>=2 && retrieve.searchText)
            this.searchWordsSum += " " + retrieve.searchText;
    }

    addHitag(hitag)
    {
        if(!atom.relations.hitags)
            this.relations.hitags = HitagUtils.getNewTagNode("root");
    }
}
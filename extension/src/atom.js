import HitagUtils from './hitagUtils.js';
import Utils from './utils.js';

export default class atom
{
    constructor(atomData)
    {
        this.atom = {};
        if(this.atomData)
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

    addName(name)
    {
        this.atom.name = name;
    }

    getName()
    {
        if(this.atom.name)
            return  this.atom.name;
        return "no name"; 
    }

    addHitag(hitag)
    {
        if(!this.relations.hitags)
            this.relations.hitags = HitagUtils.getNewTagNode("root");
        
        HitagUtils.AddHitagToTree(hitag, this.relations.hitags);
    }

    serialize ()
    {
        return JSON.stringify(this.atom);
    }

    getObj ()
    {
        return this.atom;
    }


}
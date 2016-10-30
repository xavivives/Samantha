import HitagUtils from './hitagUtils.js';
import Utils from './utils.js';

export default class atom
{
    constructor(atomData)
    {
        this.populate(atomData);
        //this.v=0;
        //this.page = page;
        //this.searchWordsSum = "";
        //this.retrieves = [];
        //this.relations = {};
        //this.relations.hitags = {};
    }

    populate(atomData)
    {
        if(this.atomData)
            this.atom = atomData;
        else
            this.atom = {};
    }

    addContentLink(contentLink)
    {
        this.atom.contentLink = contentLink; //content hash
    }

    getContentLink()
    {
        console.log(atom);
        if(this.atom.contentLink)
            return  this.atom.contentLink;
        return "null";
    }

    addContentData(contentData)
    {
        this.atom.contentData = contentData; // content as string
    }

    getContentData()
    {
        if(this.atom.contentData)
            return  this.atom.contentData;
        return "null";
    }

    addName(name)
    {
        this.atom.name = name; //title/main non unique identifier
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
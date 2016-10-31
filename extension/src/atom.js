import HitagUtils from './hitagUtils.js';
import Utils from './utils.js';

export default class atom
{
    constructor(atomData)
    {
        this.populate(atomData);
    }

    populate(atomData)
    {
        //TODO verify atomData
        if(atomData)
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
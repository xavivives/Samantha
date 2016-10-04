export default class HitagUtils
{
    static cleanString(str)
    {
        return str.replace("  ","");
    }

    static stringToHitag(str, inProgress)
    {
        if(str[length-1] == " ")
            str[length-1] = "$";
        
        str.replace(" > ","  ");

        console.log(str);
        var array = str.split("  ");

        array = array.map(function(str, index)
        { 
            if(inProgress)
            {
                if(index == array.length-1)
                  return str;
            }
            
            //str = str.replace(">","  ");
            return str.trim();
        });
        
        array  = array.filter(function(n){ return n != undefined }); //removes empty elements, null and undefined
        console.log(array);
        return array;
    }

    static hitagToString(hitag)
    {
       return hitag.join(" > ");   
    }
    
    static getHitagNode(hitag, rootHitag, forceCreation)
    {
        var currentNode = rootHitag;

        for(var i=0; i<hitag.length; i++)
        {
            var tagNameExists = false;
            for(var k=0; k<currentNode.children.length; k++)
            {
                if(currentNode.children[k].tagName==hitag[i])
                {
                    currentNode = currentNode.children[k];
                    tagNameExists = true;
                    break;
                }
            }            

            if(!tagNameExists && forceCreation)
            {
                console.log("Creating tag: "+ hitag[i]);
                currentNode.children.push(HitagUtils.getNewTagNode(hitag[i]));
                currentNode = currentNode.children[currentNode.children.length-1];
                tagNameExists = true;
            }
            

            if(tagNameExists && i==hitag.length-1)
            {
                return currentNode;
            }
            
        }

        return currentNode;
    }

    static getNewTagNode(tagName)
    {
        return {
            tagName:tagName,
            children:[]
        }
    }

    static saveHitagNode(hitag, rootHitag)
    {
        var forceCreation = true;
        HitagUtils.getHitagNode(hitag, rootHitag, forceCreation);
    }

    static logHitag(hitagNode, level)
    {
        if(!level)
            level = 0;

        var currentNode = hitagNode;

        console.log(HitagUtils.getCharacters(level, "  ") + hitagNode.tagName);

        level++;

        for(var i=0; i<hitagNode.children.length; i++)
        {
            HitagUtils.logHitag(hitagNode.children[i], level)
        }
    }

    static getCharacters(number, character)
    {
        var str= "";
        for(var i=0; i<number; i++)
            str = str + character;

        return str;
    }

    //Todo: Make it not suck
    static hitagNodeToHitagList(hitagNode, list, level, currentHitag)
    {   
        if(!level)
            level = 0;

        if(level == 0)
            currentHitag = [];

        currentHitag = currentHitag.slice(0,level);
        currentHitag[level]= hitagNode.tagName;

        if(hitagNode.children.length == 0)
        {
            var hitagClone=currentHitag.slice(0);
            hitagClone.shift(); // This is to remove 'root' tag. Needs redesign.
            list.push(hitagClone);
        }
        else
        {
            for(var i=0; i<hitagNode.children.length; i++)
            {
                level = level+1;
                HitagUtils.hitagNodeToHitagList(hitagNode.children[i], list, level, currentHitag);
            }
        }
        
        return list;    
    }

    static getMatchingChildren(hitagNode, str)
    {
        var matchingAtStart = [];
        for(var i=0; i<hitagNode.children.length; i++)
        {
            console.log()
            if(hitagNode.children[i].tagName.indexOf(str)==0)
                matchingAtStart.push(hitagNode.children[i].tagName);
        }
        return matchingAtStart;
    }    
}
        
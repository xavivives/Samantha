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
    
    static getHitagChildren(hitag, rootHitag, forceCreation)
    {
        var currentNode= rootHitag;

        for(var i=0; i<hitag.length; i++)
        {
            if(currentNode.children[i] && currentNode.children[i].tagName==hitag[i])
            {
                currentNode = currentNode.children[i];
            }
            else
            {
                if(forceCreation)
                {
                    console.log("Creating tag: "+ hitag[i]);
                    currentNode.children.push(HitagUtils.getNewTagNode(hitag[i]));
                    currentNode = currentNode.children[currentNode.children.length-1];
                }
                else
                {
                    console.log("Hitag doesn't exists");
                    return [];
                }
            }

            if(i==hitag.length-1)
            {
                return currentNode.children;
            }
        }
        console.log("How did you got here?");
        return [];
    }

    static getNewTagNode(tagName)
    {
        return {
            tagName:tagName,
            children:[]
        }
    }

    static saveHitag(hitag, rootHitag)
    {
        var forceCreation = true;
        HitagUtils.getHitagChildren(hitag, rootHitag, forceCreation);
        HitagUtils.logHitag(rootHitag);
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
}
        
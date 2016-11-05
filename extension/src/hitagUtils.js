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
    
    static getHitagTree(hitag, rootHitag, forceCreation)
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

            if(!tagNameExists)
            {
                if(forceCreation)
                {
                    console.log("Creating tag: "+ hitag[i]);
                    currentNode.children.push(HitagUtils.getNewTagNode(hitag[i]));
                    currentNode = currentNode.children[currentNode.children.length-1];
                    tagNameExists = true;
                }
                else
                {
                    return null;
                }
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
        HitagUtils.getHitagTree(hitag, rootHitag, forceCreation);
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
    static hitagTreeToHitagList(hitags,list, level, currentHitag)
    {     
        if(!hitags)
            return list;

        if(!level)
            level = 0;

        if(level == 0)
        {
            list = []; 
            currentHitag = [];
        }

        currentHitag = currentHitag.slice(0,level);
        

        for(var i=0; i<hitags.length; i++)
        {
            currentHitag[level] = hitags[i].name;
            HitagUtils.hitagTreeToHitagList(hitags[i].hitags, list, level + 1 , currentHitag);

            if(!hitags[i].hitags)
            {
                var hitagClone = currentHitag.slice(0);
                list.push(hitagClone);

               // hitagClone.shift(); // This is to remove 'root' tag. Needs redesign.
            }
            
        }
        return list;    
    }

    static getList(hitags)
    {
        for(var i=0; i<hitags.length; i++)
        {
            level = 0;
            HitagUtils.hitagTreeToHitagList(hitags.hitags[i], list, level, currentHitag);
        }
    }

    static getMatchingChildren(hitagNode, str)
    {
        var matchingAtStart = [];
        for(var i=0; i<hitagNode.children.length; i++)
        {
            if(hitagNode.children[i].tagName.indexOf(str)==0)
                matchingAtStart.push(hitagNode.children[i].tagName);
        }
        return matchingAtStart;
    } 

    static getInProgressHitagObject(hitag, inputTag)
    {
        return {
            hitag:hitag,
            inputTag:inputTag
        }
    }

    static getLastTag(hitag)
    {
        return hitag[hitag.length-1]
    }
}
        
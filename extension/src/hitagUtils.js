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
        var current= rootHitag;

        for(var i=0; i<hitag.length; i++)
        {
            if(current.children[i].tagName==hitag[i])
            {
                current = current.children[i];
            }
            else
            {
                if(forceCreation)
                {
                    console.log("Creating tag: "+ hitag[i]);
                    current.children.push(getNewTag(hitag[i]));
                    current = children[hitag[i]];
                }
                else
                {
                    console.log("Hitag doesn't exists");
                    return [];
                }
            }

            if(i==hitag.length-1)
            {
                return current.children;
            }
        }
        console.log("How did you got here?");
        return [];
    }

    static getNewTag(tagName)
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
    }

}
        
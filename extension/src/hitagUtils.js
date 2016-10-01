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

    static createTag(tagName, hitag)
    {
        var current= getHitagRoot();

        for(var i=0; i<hitag.length; i++)
        {
            if(current.children[i].tagName==hitag[i])
            {
                current = current.children[i];

                if(i==hitag.length-1)
                {
                    if(current.children[tagName])
                    {
                        console.log("tag exists");
                    }
                    else
                    {
                        current.children.push(getNewTag(tagName));
                        console.log("tag added");
                    } 
                }
            }
            else
            {
                console.log("Tag was new, adding");
                current.children.push(getNewTag(hitag[i]));
            }
        }
    }

    static getNewTag(tagName)
    {
        return {
            tagName:tagName,
            children:[]
        }
    }

}
        
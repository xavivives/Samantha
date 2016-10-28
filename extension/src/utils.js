
export default class utils
{
    static objExist(obj)
    {
        if (typeof obj != "undefined")
            return true;

        return false;
    }

    static copyObj(obj)
    {
        return JSON.parse(JSON.stringify(obj));
    }

    static cast(rawObj, constructor)
    {
        var obj = new constructor();
        for(var i in rawObj)
            obj[i] = rawObj[i];
        return obj;
    }
}
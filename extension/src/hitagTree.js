import HitagUtils from './hitagUtils.js';
import Utils from './utils.js';

export default class hitagTree
{
    static addHitagToTree(hitag, hitags)
    {
        var currentHitags = hitags;

        for(var i=0; i<hitag.length;i++)
        {
            var found = false;
            for(var k=0; k<currentHitags.length;k++)
            {
                if(currentHitags[k].name == hitag[i])
                {
                    found = true;

                    if(!currentHitags[k].hitags)
                        currentHitags[k].hitags = [];

                    currentHitags = currentHitags[k].hitags;
                }  
            }

            if(!found)
            {
                var newBranch = hitagTree.getNewBranch(hitag.slice(i));     
                currentHitags.push(newBranch);
                return hitags;
            }                
        }
    }

    static getNewBranch(hitag)
    {
        var rootNode = {};
        var currentNode = rootNode;
        for(var i=0; i<hitag.length;i++)
        {
            currentNode.name = hitag[i];
            if( i < hitag.length-1 )
            {
                currentNode.hitags = [];
                var newNode ={};
                currentNode.hitags.push(newNode);
                currentNode = newNode;
            }   
        }
        return rootNode;    
    }
}
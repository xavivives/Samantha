import exIPFS from './externalIpfs';
import emIPFS from './embededIpfs';

export default class ipfsController
{
    constructor()
    {
        this.ipfs = {};
        this.initExternal();
    }

    initExternal()
    {
        this.ipfs = new exIPFS();
    }

    addFromUrl(url)
    {
        this.ipfs.addFileFromUrl(url);
    }

    addFromString(str)
    {
        return this.ipfs.addFromString(str);
    }

    _addFromString(str)
    {
        console.log("here");
        //return this.ipfs.addFromString(str);
        this.ipfs.addFromString(str).then(function(hash){
            console.log(hash);
        })
        .catch(function(error){
            console.log("Ups");
        })
    }

}
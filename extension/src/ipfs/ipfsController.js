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

    addString(str)
    {
        return this.ipfs.addString(str);
    }
}
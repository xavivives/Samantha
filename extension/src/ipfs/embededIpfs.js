import IPFS from 'ipfs';

export default class embededIpfs
{
    constructor()
    {
        // Create the IPFS node instance
        this.repo = undefined; //TODO: Get existing repo
        this.node = new IPFS(this.repo);
        this.isReady = false;

        this.addFile(1);

        // We need to init our repo, in this case the repo was empty
        // We are picking 2048 bits for the RSA key that will be our PeerId
        this.node.init({ emptyRepo: true, bits: 2048 }, (err) =>
        {   
            if (err) 
                throw err

            this.addFile(2);

           // Once the repo is initiated, we have to load it so that the IPFS
           // instance has its config values. This is useful when you have
           // previous created repos and you don't need to generate a new one
           this.node.load((err) =>
           {
             if (err)
                throw err;


            this.addFile(3);
             // Last but not the least, we want our IPFS node to use its peer
             // connections to fetch and serve blocks from.
                this.node.goOnline((err) => 
                {
                    if (err) 
                        throw err;

                    this.isReady = true;
                    this.addFile(4);

                // Here you should be good to go and call any IPFS function
                });
            });

        });
    }

    addFile(id)
    {
        console.log(id);
        console.log("IPFS is ready:");
        console.log(this.isReady);
    }

}
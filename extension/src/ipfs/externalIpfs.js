import ipfsAPI from 'ipfs-api'

export default class externalIpfs
{
    constructor()
    {
        //connect to ipfs daemon API server
        //this.ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values
        
        //or connect with multiaddr
        //this.ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')


        // or using options
        this.ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'})

    }

    addFromFileSystem(path)
    {
       /* ipfs.util.addFromFs(path, { recursive: true }, (err, result) => {
          if (err) {
            throw err
          }
          console.log(result)
        })
        */
    }

    addFromUrl(url)
    {
        this.ipfs.util.addFromURL(url , (err, result) => {
          if (err) {
            throw err
          }
          console.log(result)
        })
    }

    addFromString(str, callback)
    {
        var buffer = Buffer.from(str, 'utf8');
        this.ipfs.util.addFromStream(buffer, (err, result) => {
          if (err) {
            console.error(err);
            callback(null);
            return;
          }
          callback(result);
        })
    }        
}
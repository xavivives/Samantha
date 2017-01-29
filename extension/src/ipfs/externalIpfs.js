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

    __addFromString(str, callback)
    {
        var buffer = Buffer.from(str, 'utf8');
        //this returns

        this.ipfs.util.addFromStream(buffer, (err, result) =>
        {
            console.log(result);
            return new Promise(
                function (resolve, reject) {
                    if (err)
                        reject(err);
                    else
                        resolve(result.hash);
                }
            );
            
        });
    } 

    addFromString(str, callback)
    {
        var buffer = Buffer.from(str, 'utf8');
        var that = this;
        //this returns
        return new Promise(function(resolve, reject)
        {
            that.ipfs.util.addFromStream(buffer, (err, result) =>
            {
                if (err)
                        reject(err);
                    else
                    {
                        console.log(result[0].hash);
                        resolve(result[0].hash);
                    }
            });
            
        });
    }    
}
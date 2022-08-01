const redis = require("redis");

exports.handler =  async (event) => {
    
    return new Promise( (resolve, reject) => {
        
        const client = redis.createClient({
            url: 'REDIS_URL',
        });
        
        client.on('ready',function() {            
            client.get('foo', async(err, res) => {
                if(err){
                    client.quit();
                    console.log(err);
                    reject(err);
                };
                else{
                    if(res){
                        client.quit();
                        resolve({
                            statusCode: 200,
                            res: res
                        });                      
                    };
                    else {
                        await client.set('foo', 'myVal', 'EX', 60); //tiempo de expiracion en segundos
                        client.quit();
                        resolve ({
                            statusCode: 200,
                            res: 'empty'
                        });                       
                    };
                };
            });
            
        });
    
        client.on('error', (err) => {
            console.log('Redis Client Error', err);
        });
        
        client.on('connect', () => {
            console.log('Connected:', client.connected);
        });
    });
};

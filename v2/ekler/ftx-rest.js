const FTXRest = require('./');

const ftx = new FTXRest({
  key: 'VsE9ymRZY4TVSiibRa1D0LFbEhrnu9-N8fLJITxk',
  secret: 'Oy3Qai2-1ENYC9HvaAw8BvXR8I9vzzJ4pMyL9UwE',
  subaccount:"Yedek3"
});
__dirname

const output = {
    dolar_getir: function(kac_dolarlik, kactan){
        return (kac_dolarlik/kactan).toFixed(6);
    },
    bakiye_getir: async() => {
        let pr = new Promise((resolve, reject) => {
            ftx.request({
                method: 'GET',
                path: '/wallet/balances',
               }).then(r=>{
                    resolve( r.result[0].total );
               });
        });
        return pr;
    },
    buy: async function( kac_dolarlik, kactan, process_type, reduceType){
        let pr = new Promise((resolve, reject) => {

                ftx.request({
                    method: 'POST',
                    path: '/orders',
                    data: {
                        "market": process.argv[3],
                        "side": process_type,
                        "price": kactan,
                        "type": "limit",
                        "size": this.dolar_getir(kac_dolarlik, kactan),
                        "reduceOnly": reduceType,
                        "ioc": false,
                        "postOnly": false,
                        "clientId": null
                    }
                }).then(r=>{
                    resolve(r.result);
                });
        });

        return pr;
    },
    sell: async function(alinan_coin_adedi, kactan, process_type, reduceType){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'POST',
                    path: '/orders',
                    data: {
                        "market": process.argv[3],
                        "side": process_type,
                        "price": kactan,
                        "type": "limit",
                        "size": alinan_coin_adedi,
                        "reduceOnly": reduceType,
                        "ioc": false,
                        "postOnly": false,
                        "clientId": null
                      }
                }).then(r=>{
                    resolve(r);
                });
        });

        return pr;
    },
    short_sell: async function( kac_dolarlik, kactan, process_type, reduceType){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'POST',
                    path: '/orders',
                    data: {
                        "market": process.argv[3],
                        "side": process_type,
                        "price": kactan,
                        "type": "limit",
                        "size": this.dolar_getir(kac_dolarlik, kactan),
                        "reduceOnly": reduceType,
                        "ioc": false,
                        "postOnly": false,
                        "clientId": null
                      }
                }).then(r=>{
                    resolve(r);
                });
        });

        return pr;
    },    
    stop: async function(alinan_coin_adedi, kactan, process_type, reduceType){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'POST',
                    path: '/conditional_orders',
                    data: {
                        "market": process.argv[3],
                        "side": process_type,
                        "triggerPrice": kactan,
                        "size": alinan_coin_adedi,
                        "type": "stop",
                        "reduceOnly": reduceType,
                      }
                }).then(r=>{
                    resolve(r);
                });
        });

        return pr;
    },

    get_process: async function( process_id ){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'GET',
                    path: '/orders/'+process_id,
                }).then(r=>{
                    resolve(r.result);
                });
        });
        return pr;
    },
    any_proces_status: async function(){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'GET',
                    path: '/orders?market='+process.argv[3]
                }).then(r=>{
                    if ( r.result.length > 0 ){
                        resolve(1);
                    }
                    else{
                        resolve(0);
                    }
                });
        });
        return pr;
    },
    get_price: async function(){
        let pr = new Promise((resolve, reject) => {
                ftx.request({
                    method: 'GET',
                    path: '/markets/'+process.argv[3]
                }).then(r=>{
                   resolve( r.result.price );
                });
        });
        return pr;
    }    
}


module.exports = output;

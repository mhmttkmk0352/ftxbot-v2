require("dotenv").config();
const { clearScreenDown } = require("readline");
const ftx_rest= require("./ekler/ftx-rest");
const mail = require("./ekler/mail");


while_process_true = () => {
    console.log("Already process !");
}

while_process_false = () => {
    //Just no process. We should get price
    data = {};

    ftx_rest.get_price().then( price => {
        data["price"] = price;
        if ( process.argv[2] == "LONG" ){
            data["peak_point"] = price+((price/100)*parseFloat(process.argv[4]));
            console.log( data );
            ftx_rest.buy(process.argv[5], data["peak_point"].toFixed(6), "buy", false).then(bought => {
                setTimeout(() => {
                    data["process_id"] = bought.id;
                    ftx_rest.get_process(data["process_id"]).then(get_process => {
                        data["process_size"] = get_process.size;
                        data["process_price"] = get_process.avgFillPrice;
                        data["process_top_price"] = get_process.avgFillPrice+((get_process.avgFillPrice/100)*(process.argv[4]));
                        data["process_bottom_price"] = get_process.avgFillPrice-((get_process.avgFillPrice/100)*(process.argv[4]));
                                                
                        ftx_rest.sell( data["process_size"], data["process_top_price"].toFixed(6), "sell", true ).then(sell=>{
                            ftx_rest.stop( data["process_size"], data["process_bottom_price"].toFixed(6), "sell", true ).then(stop=>{
                                console.log( {stop} );
                            });
                        });               
                    });
                },5000);
            });
        }
        else if (  process.argv[2] == "SHORT" ){
            console.log("Short pozisyon açılıyor.. ");
            data["peak_point"] = price-((price/100)*parseFloat(process.argv[4]));
            console.log( {peak_point: data["peak_point"] } );
            
            ftx_rest.sell(process.argv[5], data["peak_point"].toFixed(6), "sell", false).then(selled => {
                
                setTimeout(() => {
                    data["process_id"] = selled.result.id;
                    console.log( {selled} );
                        data["process_size"] = selled.result.size;
                        data["process_price"] = data["price"];
                        data["process_top_price"] = data["process_price"]+((data["process_price"]/100)*(process.argv[4]));
                        data["process_bottom_price"] = data["process_price"]-((data["process_price"]/100)*(process.argv[4]));

                        console.log( {data} );
                                 
                        
                        ftx_rest.buy( data["process_size"], data["process_bottom_price"].toFixed(6), "buy", true ).then(sell=>{
                            console.log("Short buy:");
                            ftx_rest.stop( data["process_size"], data["process_top_price"].toFixed(6), "buy", true ).then(stop=>{
                                console.log("Short buy:");
                                console.log( {stop} );
                            });
                        });
                                     
                },5000);
                
                
            });
        } 
    })
}



App = () => {   
    console.log("APP Started ..");
    var timer = setTimeout(() => {
        ftx_rest.any_proces_status().then( process_status => {
            process.env.process_status = process_status;
            if ( process.env.process_status == 0 ){
                // if not the process. So we can go activity
                while_process_false();
            }
        })  
    }, process.env.process_control_time);
}


process_status_query = () => {
    timer = setInterval(() => {
        ftx_rest.any_proces_status().then(process_status => {
            if ( process_status == 0 ) {
                clearInterval( timer );
                ftx_rest.bakiye_getir(bakiye => {
                    mail.gonder( bakiye );
                });
            }
        });
    }, process.env.process_status_query_time);
}


console.log("Kullanım:\nnode chance.js LONG BTC-PERP 3(yüzde kaç) 5(Kaç dolarlık)\n");

setTimeout(() => {
    App();
    process_status_query();
}, 4000);

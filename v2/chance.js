require("dotenv").config();
const ftx_rest= require("./ekler/ftx-rest");



while_process_true = () => {
    console.log("Already process !");
}

while_process_false = () => {
    //Just no process. We should get price
    data = {};

    ftx_rest.get_price().then( price => {
        data["price"] = price;
        if ( process.env.process_type == "LONG" ){
            data["peak_point"] = price+((price/100)*parseFloat(process.env.percent));
            console.log( data );
            ftx_rest.buy(process.env.initial_price, data["peak_point"]).then(bought => {
                setTimeout(() => {
                    data["process_id"] = bought.id;
                    ftx_rest.get_process(data["process_id"]).then(get_process => {
                        data["process_size"] = get_process.size;
                        data["process_price"] = get_process.price;
                        data["process_top_price"] = get_process.price+((get_process.price/100)*(process.env.percent));
                        data["process_bottom_price"] = get_process.price-((get_process.price/100)*(process.env.percent));
                        
                        ftx_rest.sell( data["process_size"], data["process_top_price"] ).then(sell=>{
                            ftx_rest.stop( data["process_size"], data["process_bottom_price"] ).then(stop=>{
                                console.log( {stop} );
                            });
                        });
                        
                    });
                },5000);
            });
        }

    })
    

}



App = () => {   
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


App();

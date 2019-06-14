let request = require('request');
const apikey = require('dotenv/config');
console.log(process.env.APIKEY)

//https://rest.coinapi.io/v1/exchangerate/BTC/USD?apikey=C2467941-3172-43FA-B52D-FDC353151644
const createRequest = (input, callback) => {
    let url = "https://rest.coinapi.io/v1/";
    const endpoint = input.data.endpoint || "";
    const coin = input.data.coin || "";
    const fiat = input.data.fiat || "";
    url = url + endpoint + '/'+coin + '/'+fiat; // This could be better :') 

    let queryObj = {
        apikey: process.env.APIKEY
    }
    
    const options = {
        url: url,
        qs: queryObj,
        json: true
    }

    request(options, (error, response, body) => {
        console.log(options.url)
        console.log(options.qs)
        if (error || response.statusCode >= 400) {
            callback(response.statusCode, {
                jobRunID: input.id,
                status: "errored",
                error: body.Message,
                statusCode: response.statusCode
            });
        } else {
            callback(response.statusCode, {
                jobRunID: input.id,
                data: body,
                statusCode: response.statusCode
            });
        }
    });
}

// Seems to work consistently (gcp)
exports.gcpservice = (req, res) => {
    createRequest(req.body, (statusCode, data) => {
        res.status(statusCode).send(data);
    });
};

// Pain in the ass (for AWS lambda)
exports.handler = (event, context, callback) => {
    createRequest(event, (statusCode, data) => {
        callback(null, data);
    });
}

module.exports.createRequest = createRequest;
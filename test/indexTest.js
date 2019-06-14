const assert = require('chai').assert;
const createRequest = require('../index.js').createRequest;
const apikey = require('dotenv/config');
// Example request
//https://rest.coinapi.io/v1/exchangerate/BTC/USD?apikey=C2467941-3172-43FA-B52D-FDC353151644


describe('createRequest', () => {
  // common "run" id for chainlink tasks "not even checked, just demo"
  const jobID = "278c97ffadb54a5bbb93cfec5f7b5503"; // common job id for chainlink tasks "not even checked, just demo"
  
  context('with expected input', () => {
    const req = {
      id: jobID,
      data: {
        endpoint: "exchangerate",
        coin: "BTC",
        fiat: "USD"
      }
      
    };

    it('returns data to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200);
        assert.equal(data.jobRunID, jobID);
        assert.isNotEmpty(data.data);
        done();
      });
    });
  });

  context('with bad input', () => {
    const badReq = {
      id: jobID,
      data: {
        endpoint: "exchangerate",
        coin: "NULL",
        fiat: "NULL"
      }
    };

    it('returns an error', (done) => {
      createRequest(badReq, (statusCode, data) => {
        //assert.equal(statusCode, 200);
        assert.equal(data.jobRunID, jobID);
        assert.equal(data.status, "errored");
        done();
      });
    });
  });
});
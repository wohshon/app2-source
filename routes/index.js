var express = require('express');

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');


var router = express.Router();
const version = process.env.VERSION || 'v1'
/* GET home page. */
router.get('/app2/test', function(req, res, next) {
  const h = req.headers;
  console.log(h);
  let response = {};
  response.payload = 'ok-app2'+'-'+version;
  res.status(200).send(response)
});

router.get('/app2', function(req, res, next) {
  let response = {};
  response.payload = 'ok-app2'+'-'+version;
  res.status(200).send(response);
});

//curl -X GET -H "Content-type: application/json" localhost:8080/app2/hello

router.get('/app2/:message', function(req, res, next) {
  const payload = {};
  payload.message = 'app2-'+req.params.message+'-'+version;
  payload.timestamp = new Date();
  res.status(200).send(payload);
});

//curl -X POST -H "Content-type: application/json" -d '{"message":"hello"}' localhost:8080/app2
router.post('/app2', function(req,res,next){
  const payload = (req.body);
  console.log(payload);
  payload.message = "app2-"+payload.message+'-'+version;
  payload.timestamp = new Date();
  res.status(200).send(payload); 
});

//demo
//curl -X POST -H "Content-type: application/json" -d '{"email":"hello", "txt":"123"}' localhost:8080/app2
router.post('/app2/submit', function(req,res,next){
  const payload = (req.body);
  console.log(payload);
  var len = Buffer.byteLength(payload.toString(),"utf-8");
  console.log(`${len} Bytes`);  
  payload.message = "processed";
  payload.timestamp = new Date();
  res.status(200).send(payload); 
});

module.exports = router;

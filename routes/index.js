var express = require('express');

const {Firestore} = require('@google-cloud/firestore');

var router = express.Router();
const version = process.env.VERSION || 'v1'
const projectId = process.env.PROJECT_ID || ''
const collectionId = process.env.COLLECTION_ID || ''
// Create a new client
// const firestore = new Firestore();
/*
var firestore = new Firestore({ projectId:
  'your-project-id', keyFilename: '/path/to/keyfile.json'
  });
 */ 
  var firestore = new Firestore({ projectId:
    projectId
  });
let collectionRef = firestore.collection(collectionId);

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

router.get('/getdocs/:collectionId', function(req, res, next) {
  let collectionId = req.params.collectionId;
  let collectionRef = firestore.collection(collectionId);
  getAllDocuments(collectionRef).then(documentSnapshots => {
    /**debug 
      for (let documentSnapshot of documentSnapshots) {
         if (documentSnapshot.exists) {
           console.log(`Found document with data: ${documentSnapshot.id}`);
           console.log(`${JSON.stringify(documentSnapshot.data())}`)
         } else {
           console.log(`Found missing document: ${documentSnapshot.id}`);
         }
      }
  */
      //return documentSnapshots;
      console.log(`got ${documentSnapshots.length} docs`);
      let doc = {};
      let docs = [];
      for (let documentSnapshot of documentSnapshots) {
        if (documentSnapshot.exists) {
          doc.id = documentSnapshot.id;
          doc.data = documentSnapshot.data();
          docs.push(doc);
        }
      }
      res.status(200).send(docs);
    
   });

})

//demo
//curl -X POST -H "Content-type: application/json" -d '{"email":"hello", "txt":"123"}' localhost:8080/app2
router.post('/app2/submit', function(req,res,next){
  const payload = (req.body);
  console.log(payload);
  var len = Buffer.byteLength(payload.toString(),"utf-8");
  console.log(`${len} Bytes`);  
  payload.message = "received";
  payload.timestamp = new Date();
  //save to firestore
  add(payload).then(
    () => {
      let docs = getAllDocuments(collectionRef).then (
        documentSnapshots => {
          console.log(`got ${documentSnapshots.length} docs`);
          let docs = [];
          for (let documentSnapshot of documentSnapshots) {
            let doc = {};
            if (documentSnapshot.exists) {
              doc.id = documentSnapshot.id;
              doc.data = documentSnapshot.data();
              docs.push(doc);
            }
          }
          res.status(200).send(docs);
        }
      );    
    }
  );
});



async function add(payload) {
  // Obtain a document reference.
// Add a document with an auto-generated ID.
  await collectionRef.add(payload).then((documentRef) => {
    console.log(`Added document at ${documentRef.path})`);
  });
}

async function getAllDocuments(collectionRef) {
  return await collectionRef.listDocuments().then(documentRefs => {
    if (documentRefs.length> 0) {
      return firestore.getAll(...documentRefs);
    }
    else {
      console.log("no documents")
      return [];
    } 
 })
}
module.exports = router;

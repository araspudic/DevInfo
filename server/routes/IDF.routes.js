var  Db = require('../controllers/IDF.contr');
var  IDF = require('../models/IDF.model');
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
var  router = express.Router();

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);


router.use((request, response, next) => {
  console.log('Running idf middleware...');
  next();
});

//Get
router.route('/idf').get((request, response) => {
    Db.getIDF().then((data) => {
      response.json(data[0]);
    })
});

//Get IDF devices
router.route('/idf/devices/:id').get((request, response) => {
  const id = Number(request.params.id);
  Db.getIDFDevs(id).then((data) => {
    response.json(data[0]);
  })
});

//Add
router.route('/idf').post((request, response) => {
  let  IDF = { ...request.body.IDF }

  if(!IDF.Version) {
    IDF.Version = 0.0;
  }
  if(!IDF.Compliant) {
    IDF.Compliant = 0;
  }
  console.log(IDF.MadeOn);
  Db.addIDF(IDF).then(data  => {
    response.status(201).json(data);
  })
})

//delete 
router.route('/idf/:id').get((request, response) => {
  const id = Number(request.params.id);
  Db.delIDF(id).then((data) => {
    response.json(data[0]);
  })
});
//Miti delete 
router.route('/idf/multiple').post((request, response) => {
  const idfIDs = request.body.idfIDs; // An array of IDF IDs to delete
  console.log('passani idfovi ', idfIDs)
  Db.delMultipleIDFs(idfIDs)
    .then((data) => {
      response.json(data[0]);
    })
    .catch((error) => {
      response.status(500).json({ error: 'Error deleting multiple IDFs' });
    });
});

//update TODO
router.route('/idf/:id/:name/:ver/:comp').patch((request, response) => {
  let  IDF = { IDFID: request.params.id, IDFName: request.params.name, Version: request.params.ver , Compliant: request.params.comp}
  Db.updIDF(IDF).then((data) => {  
    response.json(data[0]);
  })
});


module.exports = router;
var  Db = require('../controllers/Licenca.contr');
var  Licenca = require('../models/Licenca.model');
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
  console.log('Running licenca middleware...');
  next();
});

//Get
router.route('/licences').get((request, response) => {
    Db.getLic().then((data) => {
      response.json(data[0]);
    })
});

//Get Lic devices
router.route('/licenca/devices/:id').get((request, response) => {
  const id = Number(request.params.id);
  Db.getLicDevs(id).then((data) => {
    response.json(data[0]);
  })
});

//Add
router.route('/licenca').post((request, response) => {
  let  Licenca = { ...request.body.Lic }
  Db.addLic(Licenca).then(data  => {
    response.status(201).json(data);
  })
})

//delete 
router.route('/licenca/:id').get((request, response) => {
  const id = Number(request.params.id);
  Db.delLic(id).then((data) => {
    response.json(data[0]);
  })
});

//update
router.route('/licenca/:id/:name/:val').patch((request, response) => {
  let Lic = {LicencaID: request.params.id, LicencaName: request.params.name, Validity: request.params.val}
  Db.updLic(Lic).then((data) => {
    response.json(data[0]);
  })
});

module.exports = router;
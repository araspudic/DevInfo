
var  Db = require('../controllers/Network.contr');
var  NetworkType = require('../models/Network.model');
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
  console.log('Running network middleware...');
  next();
});


//Get
router.route('/network').get((request, response) => {
  Db.getNetwork().then((data) => {
    response.json(data[0]);
  })
});
//Get Network devices
router.route('/net/devices/:id').get((request, response) => {
  const id = Number(request.params.id);
  Db.getNetDevs(id).then((data) => {
    response.json(data[0]);
  })
});

//add
router.route('/network').post((request, response) => {
  let  Network = { ...request.body.Net }
  Db.addNetwork(Network).then(data  => {
    response.status(201).json(data);
  })
})
//delete 
router.route('/network/:id').get((request, response) => {
  const id = Number(request.params.id);
  Db.delNetwork(id).then((data) => {
    response.json(data[0]);
  })
});
//update
router.route('/network/:id/:name/:type/:interf/:speed').patch((request, response) => {
  let Network = {networkID: request.params.id, NetworkName: request.params.name, NetworkType: request.params.type, NetworkInterface: request.params.interf, Speed: request.params.speed}
  Db.updNetwork(Network).then((data) => {
    response.json(data[0]);
  })
});

module.exports = router;
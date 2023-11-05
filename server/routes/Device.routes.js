var  Db = require('../controllers/Device.contr');
var  Device = require('../models/Device.model');
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
var  router = express.Router();
const session = require('express-session')

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/api', router);

router.use((request, response, next) => {
  console.log('Running device middleware...');
  next();
});


//Get
router.route('/device').get((request, response) => {
  Db.getDevice().then((data) => {
    response.json(data[0]);
  })
});
//Get device id
router.route('/device-get/:id').get((request, response) => {
  const deviceId = request.params.id;

  Db.getDeviceById(deviceId).then((data) => {
    if (data) {
      response.json(data[0]);
    } else {
      response.status(404).json({ error: 'Device not found' });
    }
  }).catch((error) => {
    response.status(500).json({ error: 'Internal server error' });
  });
});
//Get Device chart data
router.route('/devicecharts').get((request, response) => {
  Db.getDeviceChratData().then((data) => {
    response.json(data[0]);
  })
});
//Get User Devices
router.route('/user/device/:id').get((request, response) => {
  const id = Number(request.params.id);
  Db.getUserDevice(id).then((data) => {
    response.json(data[0]);
  })
});
 
//Add TODO
router.route('/device').post((request, response) => {
    let  Device = { ...request.body.Device }
    if(!Device.RAM) {
      Device.RAM = 0;
    }
    if (!Device.IP_address){
      Device.IP_address = "Not defined";
    }
    if (!Device.MAC_address){
      Device.MAC_address = "Not defined";
    }
    if (!Device.Flash_size){
      Device.Flash_size = 0;
    }
    if (!Device.CPU){
      Device.CPU = "Not defined";
    }
    if (!Device.userID){
      Device.userID = 1;
    }
    if (!Device.Status){
      Device.Status = 'Online';
    }    
    Db.addDevice(Device).then(data  => {
      response.status(201).json(data);
    })
  
})

//delete 
router.route('/device/:id').get((request, response) => {
    const id = Number(request.params.id);
    Db.delDevice(id).then((data) => {
      response.json(data[0]);
    })
});

//Mutli delete 
router.route('/device/multiple').post((request, response) => {
  const devIDs = request.body.devIDs; 
  Db.delMultipleDevs(devIDs)
    .then((data) => {
      response.json(data[0]);
    })
    .catch((error) => {
      response.status(500).json({ error: 'Error deleting multiple Devices' });
    });
});

//update
router.route('/device/:id/:name/:status/:ip/:mac/:cpu/:ram/:flash/:lic/:net/:idf').patch((request, response) => {
  let  Device = { deviceID: request.params.id, Name: request.params.name,Status: request.params.status ,IP_address: request.params.ip, MAC_address: request.params.mac, CPU: request.params.cpu, RAM: request.params.ram, Flash_size: request.params.flash, LicencaFK: request.params.lic, NetworkFK: request.params.net, IDF: request.params.idf }
    if (Device.Status === 'null'){
      Device.Status = 'Offline';
    } 
    Db.updDevice(Device).then((data) => {
        response.json(data[0]);
      })
});

//update status
router.route('/device/:id/:status').patch((request, response) => {
  let  Device = { deviceID: request.params.id, Status: request.params.status }
    Db.updDeviceStatus(Device).then((data) => {
      response.json(data[0]);
    })
});
  
module.exports = router;
var  Db = require('../controllers/History.contr');
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
  console.log('Running user middleware...');
  next();
});

//Get Device history
router.route('/history').get((request, response) => {
    Db.getHistory().then((data) => {
      response.json(data[0]);
    })
});

//Update Executed by
router.route('/history/:name').patch(async(req, res) => { 
    const name = String(req.params.name);
    Db.updHistory(name).then((data) => {
      res.json(data[0]);
    })
    
});

// Delete Device history
router.route('/historydel').get((request, response) => {
  Db.delHistory().then((data) => {
    response.json(data[0]);
  })
});




  
module.exports = router;
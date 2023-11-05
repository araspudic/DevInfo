var  Db = require('../controllers/User.contr');
var  User = require('../models/User.model');
var  express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');
var  app = express();
var  router = express.Router();
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

router.use((request, response, next) => {
  console.log('Running user middleware...');
  next();
});

//Get users
router.route('/users').get((request, response) => {
    Db.getUser().then((data) => {
      response.json(data[0]);
    })
});
//Get users ID 
router.route('/usera/:id').get((request, response) => {
  const id = Number(request.params.id);
  Db.getUserID(id).then((data) => {
    response.json(data[0]);
  })
});
//Get users name 
router.route('/usera/:name').get((request, response) => {
  const name = String(request.params.name);
  Db.getUserName(name).then((data) => {
    response.json(data[0]);
  })
});

//Add user
router.route('/user').post(async (request, response) => {
  try{  
    let  header = { ...request.body.User } 
    if(!header.LastName) header.LastName = 'Not defined'
    if(!header.Email) header.Email = 'Not defined'
    const hashedPassword = await bcrypt.hash(header.Password, 10)
    let  User = { Name: header.Name, LastName: header.LastName, Email: header.Email, Password: hashedPassword, ulogaFK: header.ulogaFK }
    Db.addUser(User).then(data  => {
      response.status(201).json(data);
    })
  } catch{
    response.status(500).send()
  }
    
})

//Delete user 
router.route('/user/:id').get((request, response) => {
    const id = Number(request.params.id);
    Db.delUser(id).then((data) => {
      response.json(data[0]);
    })
});


router.route('/user/idf/:id').get((request, response) => {
  const id = Number(request.params.id);
  Db.getUserIDFs(id).then((data) => {
    response.json(data[0]);
  })
});

//Update
router.route('/user').patch(async(req, res) => {
  try{ 
    let  User = { ...req.body.UUser }
    const UserDB = Db.getUserName(User.Name).then((data) => {
      res.json(data[0]);
      return data[0]
    })
    if(!User.Password){
      
      Db.updUser(User).then((data) => {
        res.json(data[0]);
      })
    }else{
      
      const hashedPassword = await bcrypt.hash(User.Password, 10)
      let UserNewPw = {userID: User.userID, Name: User.Name, LastName: User.LastName, Email: User.Email, Password: hashedPassword, ulogaFK: User.ulogaFK}
      Db.updUser(UserNewPw).then((data) => {
        res.json(data[0]);
      })
      res.status(400).send()
    }
  }catch{
    res.status(500).send()
  } 
});

//Update without password
router.route('/usernopw').patch(async(req, res) => {
  try{ 
    let  User = { ...req.body.UUser }

    Db.updUserNoPw(User).then((data) => {
      res.json(data[0]);
    })
    
  }catch{
    res.status(500).send()
  } 
});
  
module.exports = router;
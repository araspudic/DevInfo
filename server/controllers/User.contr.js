var  config = require('../db.config');
const  sql = require('mssql');
var  bodyParser = require('body-parser');

async  function getUser() {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request().query("SELECT * FROM [scoutv4].[dbo].[User]");
      return  products.recordsets;
    }
    catch (error) {
      console.log(error);
    }
};

async  function getUserIDFs(id) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int(50), id)
    .query("SELECT * FROM [scoutv4].[dbo].[IDF] WHERE userID = @id");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};

const getUserByUsernameAndPassword = (name) => {
  return new Promise((resolve, reject) => {
    sql.connect(config).then(pool => {
      const query = 'SELECT * FROM [scoutv4].[dbo].[User] WHERE Name = @Name';
      return pool.request()
      .input('Name', sql.NVarChar(50), name)
      .query(query);
    }).then(result => {
      sql.close();
      resolve(result.recordset);
    }).catch(error => {
      sql.close();
      console.error('Error fetching users:', error);
      reject(error);
    });
  });
};

const getUserByID = (id) => {
  return new Promise((resolve, reject) => {
    sql.connect(config).then(pool => {
      const query = 'SELECT * FROM [scoutv4].[dbo].[User] WHERE userID = @id';
      return pool.request()
      .input('id', sql.Int, id)
      .query(query);
    }).then(result => {
      sql.close();
      resolve(result.recordset);
    }).catch(error => {
      sql.close();
      console.error('Error fetching users:', error);
      reject(error);
    });
  });
};

async  function getUserID(id) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int(50), id)
    .query("SELECT * FROM [scoutv4].[dbo].[User] WHERE userID = @id");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};

async  function getUserName(Name) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('Name', sql.NVarChar(50), Name)
    .query("SELECT * FROM [scoutv4].[dbo].[User] WHERE Name = @Name");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};

async  function addUser(User) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('Name', sql.NVarChar(50), User.Name)
    .input('LastName', sql.NVarChar(50), User.LastName)
    .input('Email', sql.NVarChar(50), User.Email)  
    .input('Password', sql.NVarChar(150), User.Password)  
    .input('Uloga', sql.Int, User.ulogaFK)     
    .query("INSERT INTO [scoutv4].[dbo].[User] (Name,LastName,Email,Password,ulogaFK) VALUES (@Name,@LastName,@Email,@Password,@Uloga)")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};

async  function delUser(User) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int, User)
    .query("DELETE FROM [scoutv4].[dbo].[User] WHERE userID = @id")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};


async  function updUser(User) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int, User.userID)
    .input('Name', sql.VarChar(50), User.Name)
    .input('LastName', sql.VarChar(50), User.LastName)
    .input('Email', sql.VarChar(50), User.Email)
    .input('Password', sql.VarChar(150), User.Password)
    .input('Uloga', sql.Int, User.ulogaFK)
    .query("UPDATE [scoutv4].[dbo].[User] SET Name = @Name, LastName = @LastName, Email = @Email, Password = @Password, ulogaFK = @Uloga WHERE userID = @id")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};

async  function updUserNoPw(User) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int, User.userID)
    .input('Name', sql.VarChar(50), User.Name)
    .input('LastName', sql.VarChar(50), User.LastName)
    .input('Email', sql.VarChar(50), User.Email)
    .input('Uloga', sql.Int, User.ulogaFK)
    .query("UPDATE [scoutv4].[dbo].[User] SET Name = @Name, LastName = @LastName, Email = @Email, ulogaFK = @Uloga WHERE userID = @id")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};



module.exports = {
    
    getUser: getUser,
    addUser: addUser,
    updUser: updUser,
    updUserNoPw: updUserNoPw,
    delUser: delUser,
    getUserName: getUserName,
    getUserID: getUserID,
    getUserByUsernameAndPassword: getUserByUsernameAndPassword,
    getUserByID: getUserByID,
    getUserIDFs: getUserIDFs
    
} 
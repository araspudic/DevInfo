var  config = require('../db.config');
const  sql = require('mssql');
var  bodyParser = require('body-parser');



async  function getHistory() {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request().query("SELECT * FROM [scoutv4].[dbo].[DeviceHistory]");
      return  products.recordsets;
    }
    catch (error) {
      console.log(error);
    }
};


async  function delHistory() {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .query("DELETE FROM DeviceHistory;")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};

async  function updHistory(name) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('name', sql.VarChar(50), name)
    .query("UPDATE [scoutv4].[dbo].[DeviceHistory] SET Executed_by = @name WHERE ID = (SELECT MAX(ID) FROM DeviceHistory);")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};


module.exports = {
    
    getHistory: getHistory,
    delHistory: delHistory,
    updHistory: updHistory,
    
} 
var  config = require('../db.config');
const  sql = require('mssql');
var  bodyParser = require('body-parser');



async  function  getLic() {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request().query("SELECT * FROM Licenca");
      return  products.recordsets;
    }
    catch (error) {
      console.log(error);
    }
};
async  function getLicDevs(id) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int(50), id)
    .query("SELECT * FROM [scoutv4].[dbo].[Device] WHERE LicencaFK = @id");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};


async  function addLic(Lic) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('Name', sql.NVarChar(50), Lic.LicencaName)
    .input('Validity', sql.Date, Lic.Validity )   
    .query("INSERT INTO Licenca (LicencaName,Validity) VALUES (@Name,@Validity)")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};

async  function delLic(Lic) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int, Lic)
    .query("DELETE FROM Licenca WHERE LicencaID = @id")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};


async  function updLic(Lic) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int, Lic.LicencaID)
    .input('Name', sql.NVarChar(50), Lic.LicencaName)
    .input('Validity', sql.Date, Lic.Validity )
    .query("UPDATE Licenca SET LicencaName = @Name, Validity = @Validity WHERE LicencaID = @id")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};
module.exports = {
    
    getLic: getLic,
    getLicDevs: getLicDevs,
    addLic: addLic,
    updLic: updLic,
    delLic: delLic
    
} 
var  config = require('../db.config');
const  sql = require('mssql');
var  bodyParser = require('body-parser');



async  function  getDevice() {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request().query("SELECT Device.deviceID, Device.name, Device.Status, Device.IP_address, Device.MAC_address, Device.CPU, Device.RAM, Device.Flash_size, Licenca.LicencaID, Licenca.LicencaName, Licenca.Validity, Network.networkID, Network.NetworkName, IDF.IDFID, IDF.IDFName FROM Device INNER JOIN Network ON Device.NetworkFK = Network.networkID INNER JOIN Licenca ON Device.LicencaFK = Licenca.LicencaID INNER JOIN IDF ON Device.IDF = IDF.IDFID");
      return  products.recordsets;
    }
    catch (error) {
      console.log(error);
    }
};
async  function  getDeviceChratData() {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .query("SELECT Device.deviceID, Device.Name, Device.Status, Licenca.LicencaName, Licenca.Validity, Network.NetworkName, Network.NetworkInterface, IDF.IDFName, IDF.Compliant FROM Device INNER JOIN Network ON Device.NetworkFK = Network.networkID INNER JOIN Licenca ON Device.LicencaFK = Licenca.licencaID INNER JOIN IDF ON Device.IDF = IDF.IDFID");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};

async  function getUserDevice(id) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int(50), id)
    .query("SELECT * FROM [scoutv4].[dbo].[Device] WHERE userID = @id");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};
async  function  getDeviceById(Device) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int, Device)
    .query("SELECT * FROM Device WHERE deviceID = @id");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};
// Add device
async  function addDevice(Device) {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request()
      .input('Name', sql.NVarChar(50), Device.Name)
      .input('Status', sql.NVarChar(50), Device.Status)
      .input('IP', sql.NVarChar(50), Device.IP_address)
      .input('MAC', sql.NVarChar(50), Device.MAC_address)
      .input('CPU', sql.NVarChar(50), Device.CPU)
      .input('RAM', sql.Int, Device.RAM)
      .input('Flash', sql.Float, Device.Flash_size)
      .input('Licenca', sql.Int, Device.LicencaFK)
      .input('Network', sql.Int, Device.NetworkFK)
      .input('IDF', sql.Int, Device.IDF)
      .input('user', sql.Int, Device.userID)
      .query("INSERT INTO Device (Name,Status,IP_address,MAC_address,CPU,RAM,Flash_size,LicencaFK,NetworkFK,IDF,userID) VALUES (@Name,@Status,@IP,@MAC,@CPU,@RAM,@Flash,@Licenca,@Network,@IDF,@user)")
      return  products.recordsets;
    }
    catch (err) {
      console.log(err);
    }
  };

  async  function delDevice(Device) {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request()
      .input('id', sql.Int, Device)
      .query("DELETE FROM Device WHERE deviceID = @id")
      return  products.recordsets;
    }
    catch (err) {
      console.log(err);
    }
  };

  const delMultipleDevs = async (devIDs) => {
    try {
      let pool = await sql.connect(config);
  
      const query = `
        DECLARE @ids NVARCHAR(MAX)
        SET @ids = @devIDs
  
        DECLARE @sql NVARCHAR(MAX)
        SET @sql = 'DELETE FROM Device WHERE deviceID IN (' + @ids + ')'
  
        EXEC sp_executesql @sql;
      `;
  
      let products = await pool.request()
        .input('devIDs', sql.NVarChar, devIDs.join(','))
        .query(query);
  
      return products.recordsets;
    } catch (err) {
      console.log(err);
    }
  };

//Update device
  async  function updDevice(Device) {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request()
      .input('id', sql.Int, Device.deviceID)
      .input('Name', sql.VarChar, Device.Name)
      .input('Status', sql.VarChar, Device.Status)
      .input('IP', sql.VarChar, Device.IP_address)
      .input('MAC', sql.VarChar, Device.MAC_address)
      .input('CPU', sql.VarChar, Device.CPU)
      .input('RAM', sql.Int, Device.RAM)
      .input('Flash', sql.Float, Device.Flash_size)
      .input('Lic', sql.Int, Device.LicencaFK)
      .input('Net', sql.Int, Device.NetworkFK)
      .input('IDF', sql.Int, Device.IDF)
      .query("UPDATE Device SET Name = @Name, Status = @Status, IP_address = @IP, MAC_address = @MAC, CPU = @CPU, RAM = @RAM, Flash_size = @Flash, LicencaFK = @Lic, NetworkFK = @Net, IDF = @IDF WHERE deviceID = @id");
      return  products.recordsets;
    }
    catch (err) {
      console.log(err);
    }
  };

//Update device status
async  function updDeviceStatus(Device) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int, Device.deviceID)
    .input('Status', sql.VarChar, Device.Status)
    .query("UPDATE Device SET Status = @Status WHERE deviceID = @id");
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};




  module.exports = {
    addDevice: addDevice,
    getDevice: getDevice,
    getDeviceChratData: getDeviceChratData,
    getDeviceById: getDeviceById,
    updDevice: updDevice,
    updDeviceStatus: updDeviceStatus,
    delDevice: delDevice,
    delMultipleDevs: delMultipleDevs,
    getUserDevice: getUserDevice
}  
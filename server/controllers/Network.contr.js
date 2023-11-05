var  config = require('../db.config');
const  sql = require('mssql');
var  bodyParser = require('body-parser');

async  function  getNetwork() {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request().query("SELECT * FROM Network");
      return  products.recordsets;
    }
    catch (error) {
      console.log(error);
    }
};
async  function  getNetworkId(id) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int, id)
    .query("SELECT * FROM Network WHERE networkID = @id");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};

async  function getNetDevs(id) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int(50), id)
    .query("SELECT * FROM [scoutv4].[dbo].[Device] WHERE NetworkFK = @id");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};

async  function addNetwork(Network) {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request()
      .input('Name', sql.NVarChar(50), Network.NetworkName)
      .input('Type', sql.NVarChar(50), Network.NetworkType)
      .input('Interface', sql.NVarChar(50), Network.NetworkInterface)
      .input('Speed', sql.Int, Network.Speed)
      .query("INSERT INTO Network (NetworkName,NetworkType,NetworkInterface,Speed) VALUES (@Name,@Type,@Interface,@Speed)")
      return  products.recordsets;
    }
    catch (err) {
      console.log(err);
    }
  };

  async  function delNetwork(id) {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request()
      .input('id', sql.Int, id)
      .query("DELETE FROM Network WHERE networkID = @id")
      return  products.recordsets;
    }
    catch (err) {
      console.log(err);
    }
  };


  async  function updNetwork(Network) {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request()
      .input('id', sql.NVarChar(50), Network.networkID)
      .input('Name', sql.NVarChar(50), Network.NetworkName)
      .input('Type', sql.NVarChar(50), Network.NetworkType)
      .input('Interface', sql.NVarChar(50), Network.NetworkInterface)
      .input('Speed', sql.Int, Network.Speed)
      .query("UPDATE Network SET NetworkName = @Name, NetworkType = @Type, NetworkInterface = @Interface, Speed = @Speed WHERE networkID = @id")
      return  products.recordsets;
    }
    catch (err) {
      console.log(err);
    }
  };

module.exports = {
    getNetwork: getNetwork,
    getNetworkId: getNetworkId,
    getNetDevs: getNetDevs,
    addNetwork: addNetwork,
    delNetwork: delNetwork,
    updNetwork: updNetwork
}
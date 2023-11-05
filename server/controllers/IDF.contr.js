var  config = require('../db.config');
const  sql = require('mssql');
var  bodyParser = require('body-parser');



async  function  getIDF() {
    try {
      let  pool = await  sql.connect(config);
      let  products = await  pool.request().query("SELECT * FROM IDF");
      return  products.recordsets;
    }
    catch (error) {
      console.log(error);
    }
};

async  function getIDFDevs(id) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int(50), id)
    .query("SELECT * FROM [scoutv4].[dbo].[Device] WHERE IDF = @id");
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
};


async  function addIDF(IDF) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('IDFName', sql.NVarChar(50), IDF.IDFName)
    .input('Version', sql.Float, IDF.Version )
    .input('Compliant', sql.Bit, IDF.Compliant)
    .input('MadeOn', sql.DateTime2(7), IDF.MadeOn)
    .query("INSERT INTO IDF (IDFName,Version,Compliant,MadeOn) VALUES (@IDFName,@Version,@Compliant,@MadeOn)")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};

async  function delIDF(IDF) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('id', sql.Int, IDF)
    .query("DELETE FROM IDF WHERE IDFID = @id")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};

const delMultipleIDFs = async (idfIDs) => {
  try {
    let pool = await sql.connect(config);

    const query = `
      DECLARE @ids NVARCHAR(MAX)
      SET @ids = @idfIDs

      DECLARE @sql NVARCHAR(MAX)
      SET @sql = 'DELETE FROM IDF WHERE IDFID IN (' + @ids + ')'

      EXEC sp_executesql @sql;
    `;

    let products = await pool.request()
      .input('idfIDs', sql.NVarChar, idfIDs.join(','))
      .query(query);

    return products.recordsets;
  } catch (err) {
    console.log(err);
  }
};


async  function updIDF(IDF) {
  try {
    let  pool = await  sql.connect(config);
    let  products = await  pool.request()
    .input('IDFID', sql.Int, IDF.IDFID)
    .input('IDFName', sql.NVarChar(50), IDF.IDFName)
    .input('Version', sql.Float, IDF.Version )
    .input('Compliant', sql.Int, IDF.Compliant)
    .query("UPDATE IDF SET IDFName = @IDFName, Version = @Version, Compliant = @Compliant WHERE IDFID = @IDFID")
    return  products.recordsets;
  }
  catch (err) {
    console.log(err);
  }
};

module.exports = {
    
    getIDF: getIDF,
    getIDFDevs: getIDFDevs,
    addIDF: addIDF,
    updIDF: updIDF,
    delIDF: delIDF,
    delMultipleIDFs: delMultipleIDFs
    
} 
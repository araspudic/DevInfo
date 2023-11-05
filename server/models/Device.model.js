
class  Device{
    constructor(deviceID,name,Status,IP_address,MAC_adress,CPU,RAM,Flash_size,Licenca,Network,IDF){
      this.deviceID = deviceID;
      this.name = name;
      this.Status = Status;   
      this.IP_address = IP_address;
      this.MAC_adress = MAC_adress;
      this.CPU = CPU;
      this.RAM = RAM;
      this.Flash_size = Flash_size;
      this.LicencaFK = LicencaFK;
      this.NetworkFK = NetworkFK;
      this.IDF = IDF;
    }
  }
  
  
  module.exports = Device;
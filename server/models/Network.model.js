class  Network{
    constructor(networkdID,Name,NetworkTypeFK,NetworkInterface,Speed){
      this.networkdID = networkdID;
      this.Name = Name;  
      this.NetworkTypeFK = NetworkTypeFK;
      this.NetworkInterface = NetworkInterface;
      this.Speed = Speed;   
    }
  }
  
  module.exports = Network;
function checkUser(req,res,next){
    if (req.isAuthenticated()){
         return true;
      }
      return false;
    }

    
module.exports = {
    checkUser
}
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport,getUserByName,getUserById){
    const authenticateUser = async(name,password,done) =>{      
        const user = await getUserByName(name)

        if(user == null){
            return done(null, false, {message: 'No user with that name'})
        }
        try {
             if (await bcrypt.compare(password, user.Password)){
                return done(null,user)
             }  else {
                return done(null,false,{message:'Password wrong'})
             } 
        } catch(e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'Name',  passwordField: 'Password'},
    authenticateUser))
    passport.serializeUser((user,done) => done(null, user.userID))
    passport.deserializeUser((userID,done) => {
        return done(null,getUserById(userID))
    })
}

module.exports = initialize
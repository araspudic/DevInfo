const config = ({
    user: 'test',
    password: 'test',
    server:'localhost',
    synchronize: true,
    options:{
        instanceName: 'SQLEXPRESS',
        //port: 62123,
        database:'scoutv4',
        trustedConnection:true,
        trustServerCertificate: true,
        debug: {
            packet: false,
            payload: false,
            token: false,
            data: false
        },
        encrypt: true
    
    }
});


module.exports = config;
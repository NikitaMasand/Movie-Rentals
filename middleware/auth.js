const jwt = require('jsonwebtoken');
const config = require('config');
//for authorization, if client has the rights to view/update the data

function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided!');
    try{
        const decodedPayload = jwt.verify(token,config.get('jwtPrivateKey'));
        //getting user object with the help of token, secure approach
        //no one else can generate the token and paste it in header, because they don't have the private jwt key,
        //it's in environment variable
        
        req.user = decodedPayload;
        next(); //route handler, next middleware function
    }
    catch(ex){
        res.status(400).send('invalid token!!'); //terminating req res cycle
    }
}

module.exports = auth;
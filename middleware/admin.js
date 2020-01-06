
function admin(req,res,next){
    /*
    401 : unauthorized
    when user tries to access a protected resource but they don't give valid jwt, try again

    403 : forbidden
    if still not allowed, don't try again, you can't access the resource
    */
    if(!req.user.isAdmin) return res.status(403).send('Access denied.');

    next();
}

module.exports = admin;
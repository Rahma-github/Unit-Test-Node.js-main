const jwt=require('jsonwebtoken')
 var {promisify} =require('util')
const { APIError } = require('../utilities/errors')
const { log } = require('console')

//authentication
async function auth(req, res, next) {
  
  try{
      if (!req.headers.authorization) {
         next( new APIError(401, 'you have not access , please login first' ))
      }
      else{
        var decoded = await promisify(jwt.verify)(req.headers.authorization, process.env.SECRET)
        // console.log("Decoded Token:", decoded);

        req.id=decoded.id
        // console.log("Assigned req.id:", req.id); 
        // console.log(typeof req.id);
        
        next()
      }
    }catch(err){
      next( err)
    }
 
}

module.exports = auth
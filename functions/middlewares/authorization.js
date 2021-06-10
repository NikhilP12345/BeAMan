const admin = require('../creds/adminSDKWeb');
const db=admin.firestore()

exports.auth = async function (req, res, next) {
    function time(ms) {
      return new Date(ms*1000)
    }
    try{
      if(!req.headers.auth_token) throw "No auth token provided : IP Blocked"
      decodedToken=await admin.auth().verifyIdToken(req.headers.auth_token)
      decodedToken.auth_time=time(decodedToken.auth_time),
      decodedToken.iat=time(decodedToken.iat),
      decodedToken.exp=time(decodedToken.exp)
      req.authInfo=decodedToken
      console.log(decodedToken.uid)
      next()
    }
    catch (error) {
      res.status(401)
      res.send({
        success: false,
        error: (error.code)?error.code:error,
        status:"ABAP-FB Blocked Your IP Address for unauthenticated Access : Token Only Used Once"
      })
    }
}

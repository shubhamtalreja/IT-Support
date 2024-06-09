const jwt = require('jsonwebtoken');

const authentication = () => (req, res, next) => {
  try {
    const token = req.headers.authorization; 
    if (!token) {
      return res.status(403).send({ message: 'Authorization token not present.' });
    }
   
     else {
      const token = req.headers.authorization.split(' ')[1];
      const userInfo = jwt.verify(token, "secret");
      const role = userInfo.role;
      if(role){
        res.locals.role = role;
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Authorization failed. User not authorized.",
        });
      }
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


  
  

module.exports = authentication
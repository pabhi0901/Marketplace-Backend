import jwt from "jsonwebtoken"

const authMiddleware = (req,res,next)=>{

    const token = req.cookies.token;
    
    if(!token) {
        res.status(401).json({"mess":"Unauthorised"})
    }

    try{

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        const user = decoded //decoded contains the data with which the token was made initially
        
        req.user = decoded 
        
        next();

    }
    catch(err){
        
        console.log("Invalid token provided or token expired");
        
        res.status(401).json({"mess":"Unauthorised"}) //if token is wrong then it will throw an  error which is managed here
        
    }


}

export default authMiddleware
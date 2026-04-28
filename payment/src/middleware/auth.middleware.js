import jwt from "jsonwebtoken"

const createAuthMiddleware = (role=["user"])=>{
    
    return async function authMiddleware(req,res,next){
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
        
        if(!token){
            return res.status(401).json({
                "mess":"Unauthorised, No token provided"
            })
        }

        try{

            const decoded =  jwt.verify(token,process.env.JWT_SECRET)
            
            if(!role.includes(decoded.role)){
                
                return res.status(403).json({
                "mess":"Forbidden, Access Denied"
                })
            }
            
            req.user = decoded
            next()

        }
        catch(err){
            return res.status(401).json({
            "mess":"Unauthorised, No token provided"
            })
        }
    }
}

export default createAuthMiddleware
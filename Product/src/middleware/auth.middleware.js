import jwt from "jsonwebtoken"

const createAuthMiddleware = function(role=['user']){
 //here we are making dynamic authMiddleware like for the role we will send it will authenticate for it, also a middleware or controller only accept (req,res,next) in express, so we cannot send user along with them that's why we are returning the actual middleware in seperate function and express will run it eventually.    
    
    return function authMiddleware(req,res,next){
        
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
        
        if(!token)
        {
            return res.status(401).json({
                "mess":"Unauthorized: No authentication provided"
            })
        }

        try{
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            
            if(!role.includes(decoded.role)){
                return res.status(403).json({
                    "mess":"Forbidden: Insufficient permissions"
                })
            }

            req.user = decoded
            next()

        }
        catch(err){
            
            return res.status(401).json({
                "mess":"Unauthorized: Invalid token"
            })
            
        }
    
    }

}

export default createAuthMiddleware
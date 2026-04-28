import jwt from "jsonwebtoken"

const createAuthMiddleware = (role=['user'])=>{

    return async function authMiddleware(req,res,next){

        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
      
        
        if (!token) {
            return res.status(401).json({ mess: "Unauthorized: Token missing" });
        }   

        try{
            const user = jwt.verify(token,process.env.JWT_SECRET)
        
            if(!role.includes(user.role)){

                return res.status(403).json({
                    "mess":"Forbidden: Insufficient permissions"
                })

            }
          
            
            req.user = user
            next()

        }
        catch(err){
            console.log("User not authenticated ",err);

            res.status(401).json({
                "mess":"Unauthorized: Invalid token"
            })
            
        }

    }

}

export default createAuthMiddleware
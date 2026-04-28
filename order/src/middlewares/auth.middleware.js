import jwt from "jsonwebtoken"

const createAuthMiddleware = (role=["user"])=>{

    return async function authMiddleware(req,res,next){

        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
        
        if(!token){
            return res.status(401).json({
                "mess":"No authentication provided."
            })
        }

        try{

            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            
            if(role.includes(decoded.role)){  
                  req.user = decoded
                  next()
            }
            else{

                 return res.status(403).json({ 
                    mess: "Forbidden: insufficient permissions." 
                });

            }
            
        }catch(err){
            
            return res.status(401).json({
                "mess":"No authentication provided."
            })

            console.log("Authentication failed ",err);
            
        }


    }

}

export default createAuthMiddleware
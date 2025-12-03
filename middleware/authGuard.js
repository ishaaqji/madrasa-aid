
import jwt from "jsonwebtoken";
import { CONFIG } from "../lib/config.js";

export function authGuard(req,res,next){
  try{
    const token = req.headers.authorization?.replace("Bearer ","");
    if(!token) return res.status(401).json({error:"Missing token"});
    req.user = jwt.verify(token, CONFIG.JWT_SECRET);
    next();
  }catch(e){
    return res.status(401).json({error:"Invalid token"});
  }
}

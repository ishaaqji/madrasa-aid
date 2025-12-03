
export function adminGuard(req,res,next){
  if(req.user?.isAdmin===true) return next();
  return res.status(403).json({error:"Admin only"});
}

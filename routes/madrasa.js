
import express from "express";
import dayjs from "dayjs";
import { db } from "../lib/firestore.js";

const router = express.Router();
const MAD="madrasas";

router.post("/register", async (req,res,next)=>{
  try{
    const data=req.body;
    data.createdAt=dayjs().toISOString();
    await db().collection(MAD).add(data);
    res.json({ok:true,msg:"Madrasa registered"});
  }catch(e){ next(e); }
});

router.get("/list", async (req,res,next)=>{
  try{
    const snap=await db().collection(MAD).get();
    res.json({ok:true,list: snap.docs.map(d=>({id:d.id,...d.data()}))});
  }catch(e){ next(e); }
});

export default router;

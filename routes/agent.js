
import express from "express";
import dayjs from "dayjs";
import { db } from "../lib/firestore.js";

const router = express.Router();
const AG="agents";

router.post("/register", async (req,res,next)=>{
  try{
    const {name,phone,address}=req.body;
    if(!name||!phone) return res.status(400).json({error:"Name & phone required"});
    const doc=await db().collection(AG).add({
      name,phone,address:address||null,
      createdAt:dayjs().toISOString()
    });
    res.json({ok:true,id:doc.id});
  }catch(e){ next(e); }
});

router.get("/list", async (req,res,next)=>{
  try{
    const s=await db().collection(AG).get();
    res.json({ok:true,list:s.docs.map(x=>({id:x.id,...x.data()}))});
  }catch(e){ next(e); }
});

router.get("/:id", async (req,res,next)=>{
  try{
    const id=req.params.id;
    const doc=await db().collection(AG).doc(id).get();
    if(!doc.exists) return res.status(404).json({error:"Not found"});
    const c=await db().collection(AG).doc(id).collection("commissions").get();
    const list=c.docs.map(d=>({id:d.id,...d.data()}));
    const total=list.reduce((s,x)=>s+(x.amount||0),0);
    res.json({ok:true,agent:{id, ...doc.data()},commissions:list,total});
  }catch(e){ next(e); }
});

export default router;

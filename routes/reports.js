
import express from "express";
import dayjs from "dayjs";
import { db } from "../lib/firestore.js";

const router = express.Router();
const DON="donations";

router.get("/timeseries", async (req,res,next)=>{
  try{
    const days=Number(req.query.days)||30;
    const since=dayjs().subtract(days-1,"day").startOf("day").toISOString();
    const snap=await db().collection(DON)
      .where("createdAt",">=",since).orderBy("createdAt").get();

    const buckets={};
    for(let i=0;i<days;i++){
      const d=dayjs().subtract(i,"day").format("YYYY-MM-DD");
      buckets[d]=0;
    }
    snap.docs.forEach(doc=>{
      const d=dayjs(doc.data().createdAt).format("YYYY-MM-DD");
      if(buckets[d]!=null) buckets[d]+=Number(doc.data().amount||0);
    });

    const labels=Object.keys(buckets).sort();
    const values=labels.map(k=>buckets[k]);
    res.json({labels,values});
  }catch(e){ next(e); }
});

export default router;

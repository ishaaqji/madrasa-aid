import express from "express";
import { sendEmail } from "../services/emailService.js";
const router = express.Router();

router.get('/health', (req,res)=> res.json({ ok:true, uptime: process.uptime() }));

router.post('/email-test', async (req,res,next)=>{
  try{
    const { to, subject, text } = req.body;
    await sendEmail({ to, subject, text });
    res.json({ ok:true });
  }catch(e){ next(e); }
});

export default router;

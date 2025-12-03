import cron from "node-cron";
import { initializeFirestore, db } from "../lib/firestore.js";
import dayjs from "dayjs";

async function dailyJob(){
  try{
    await initializeFirestore();
    const since = dayjs().subtract(1,'day').startOf('day').toISOString();
    const snap = await db().collection('donations').where('createdAt','>=',since).get();
    let total = 0;
    snap.docs.forEach(d=> total += Number(d.data().amount || 0));
    console.log('Daily donations total:', total);
    // send admin email summary here
  }catch(e){ console.error('cron failed', e); }
}

cron.schedule('0 1 * * *', () => {
  console.log('Running daily job at 01:00');
  dailyJob();
});

console.log('Cron runner started');

import axios from "axios";
import { sendEmail } from "./emailService.js";

export async function sendNotification({ toPhone, message, pdfPath }){
  try{
    if(process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN){
      await axios.post(process.env.WHATSAPP_API_URL, {
        to: toPhone,
        message
      }, { headers: { Authorization: 'Bearer ' + process.env.WHATSAPP_API_TOKEN }});
      return true;
    }
  }catch(e){ console.warn('whatsapp failed', e.message); }

  try{
    if(toPhone && toPhone.includes('@')){
      await sendEmail({ to: toPhone, subject: 'Donation Receipt', text: message, attachments: pdfPath ? [{ path: pdfPath }] : [] });
      return true;
    }
  }catch(e){ console.warn('email fallback failed', e.message); }

  return false;
}

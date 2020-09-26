import AfricasTalking from 'africastalking';
import { getConfig } from '../../config';

const { apiKey, username, senderId } = getConfig().africastalking;

const smsService =  AfricasTalking({ apiKey, username}).SMS;

export const sendSms = async (smsDetails) => {
  try {
    await smsService.send(smsDetails);
  } catch(error){
    console.log('error while sending sms', error)
  }
}

import AfricasTalking from 'africastalking';
import { getConfig } from '../../config';

const { apiKey, username } = getConfig().africastalking;

const smsService =  AfricasTalking({ apiKey, username}).SMS;

export const sendSms = async (smsDetails) => {
  try {
    const response = await smsService.send(smsDetails);
    console.log(response);
  } catch(error){
    console.log('error while sending sms', error)
  }
}

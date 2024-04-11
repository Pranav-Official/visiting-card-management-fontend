import axios from 'axios';
import api from './api';

type CardDetails = {
  card_name: string;
  img_front_link?: string;
  img_back_link?: string;
  job_title?: string;
  email?: string;
  phone?: string;
  company_name?: string;
  company_website?: string;
  description?: string | null;  
};

export interface ShareCardProp { 
  user_id: string;
  jwt_token: string;
  card_id: string;
  receiver_user_ids: string[];
  visibilitySetter?: () => void;
  cardDetails?: CardDetails;
}

interface ShareCardResponse {
  statusCode: string;
  shareCardResp: string[] | { status: boolean; message: string };
}

export async function ShareCard({
  user_id,
  jwt_token,
  card_id,
  receiver_user_ids,
}: ShareCardProp): Promise<ShareCardResponse> {
  let statusCode = '';
  let shareCardResp: string[] | { status: boolean; message: string } = [];

  const shareParams = {
    user_id: user_id,
    card_id: card_id,
    receiver_user_ids: receiver_user_ids,
  };

  try {
    const ShareCardResponse = await api.post('api/v1/shareCard', shareParams, {
      headers: { Authorization: `Bearer ${jwt_token}` },
    });

    statusCode = ShareCardResponse.status.toString();
    shareCardResp = ShareCardResponse.data;
    return { statusCode, shareCardResp };
  } catch (error) {
    console.error('Error sharing card:', error);
    if (axios.isAxiosError(error)) {
      console.log('Axios Error while sharing card:', error);
      shareCardResp = error.response?.data;
    } else {
      console.log('Error while sharing card ', error);
      shareCardResp = { status: false, message: 'Error while signing in' };
    }
    return { statusCode, shareCardResp };
  }
}

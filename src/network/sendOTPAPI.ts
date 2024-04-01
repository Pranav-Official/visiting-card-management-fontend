import axios,{AxiosError} from 'axios';
import api from './api';

interface SendOtpProps {
    user_email: string;
}

interface SendOtpResponse {
  statusCode: string;
  sendOtpResp: string;
}

export async function SendOtp({
    user_email,
}: SendOtpProps): Promise<SendOtpResponse> {
  const sendParams = { user_email: user_email };
  try {
    console.log('Reached OTP Hook');
    console.log('send to api email', user_email);
    const response = await api.post('/sendOTP', sendParams);
    console.log('response is', response);

    if (response.status === 200) {
      return {
        statusCode: '200',
        sendOtpResp: 'OTP sent successfully',
      };
    } else {
      throw new Error('Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending OTP frontend:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log(axiosError.message);
      if (axiosError.code === 'ECONNABORTED') {
        throw new Error('Request timed out');
      } else {
        throw new Error('Network error occurred');
      }
    } else {
      throw new Error('Error sending OTP');
    }
  }
}

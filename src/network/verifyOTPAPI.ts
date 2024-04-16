import api from './api';

interface OTPentry {
  email: string | undefined;
  enteredOtp: string | undefined;
}

interface VerificationResponse {
  statusCode: string;
  verificationResponse: { status: boolean; message: string };
}

export async function verifyOTP({
  email,
  enteredOtp,
}: OTPentry): Promise<VerificationResponse> {
  let statusCode = '';
  let verificationResponse;

  try {
    const verificationResp = await api.post('/verifyOTP', {
      email,
      enteredOtp,
    });
    statusCode = verificationResp.status.toString();

    verificationResponse = verificationResp.data;
  } catch (error) {
    console.log('Error while OTP verification ', error);
  }

  return { statusCode, verificationResponse };
}

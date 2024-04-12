import parsePhoneNumberFromString, { CountryCode } from 'libphonenumber-js';

function validateEmail(email: string): boolean {
  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
}

const isValidWebsiteUrl = (url: string): boolean => {
  // Regular expression to check website validity
  const websiteUrlRegex =
    /^((https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?)$/;

  return websiteUrlRegex.test(url);
};

//function for phone number validation
function validatePhoneNumber(phoneNumber: string, country?: CountryCode) {
  phoneNumber = phoneNumber.replace(/[\s()-]+/g, '');
  const internationalRegex = /^\+?[0-9](?:[0-9] ?){5,13}[0-9]$/;
  if (phoneNumber.length >= 7 && phoneNumber.length <= 15) {
    // Check if the input consists of numeric characters (except for the optional leading "+" sign)
    if (!/^\+?\d+$/.test(phoneNumber)) {
      return false;
    }
    try {
      // Parse the sanitized phone number
      // const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, country);
      // console.log('Phone Number Object', phoneNumberObj);
      if (phoneNumber && internationalRegex.test(phoneNumber)) {
        return true;
      }
    } catch (error) {
      console.log('Error in validating phone number', error);
      return false;
    }
  }
  return false;
}
const isValidPassword = (password: string): boolean => {
  // Regular expression to check password validity
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?#&]{8,}$/;

  return passwordRegex.test(password);
};

export {
  validateEmail,
  isValidWebsiteUrl,
  validatePhoneNumber,
  isValidPassword,
};

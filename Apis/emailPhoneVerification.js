import fetch from 'node-fetch';

const validateEmail = async (email) => {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.abstract_api_email}&email=${email}`
    );
    const data = await response.json();
  
    const isValidFormat = data.is_valid_format.value;
    const isFreeEmail = data.is_free_email.value;
    const isDisposableEmail = data.is_disposable_email.value;
    const isRoleEmail = data.is_role_email.value;
    const isCatchallEmail = data.is_catchall_email.value;
    const isMXFound = data.is_mx_found.value;
    const isSMTPValid = data.is_smtp_valid.value;
  
    return (
      isValidFormat &&
      isFreeEmail &&
      !isDisposableEmail &&
      !isRoleEmail &&
      !isCatchallEmail &&
      isMXFound &&
      isSMTPValid
    );
};

const validatePhoneNumber = async (phoneNumber) => {
    phoneNumber = encodeURIComponent('+2' + phoneNumber);
    const response = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${process.env.abstract_api_phone}&phone=${phoneNumber}`);
    const data = await response.json();
    return data.valid && data.country.code === 'EG' && data.country.name === 'Egypt' && data.country.prefix === '+20';
};

module.exports = {  validateEmail  , validatePhoneNumber} 
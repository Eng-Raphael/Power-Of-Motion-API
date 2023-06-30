const validateEmail = async (email) => {
    const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.abstract_api_email}&email=${email}`);
    const data = await response.json();
    return data.is_valid_format.value && data.is_free_email.value && !data.is_disposable_email.value;
}

const validatePhoneNumber = async (phoneNumber) => {
    phoneNumber = '+2' + phoneNumber;
    const response = await fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${process.env.abstract_api_phone}&phone=${phoneNumber}`);
    const data = await response.json();
    return data.valid && data.country.code === 'EG' && data.country.name === 'Egypt' && data.country.prefix === '+20';
}

module.exports = {  validateEmail  , validatePhoneNumber} 
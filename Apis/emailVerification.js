const validateEmail = async (email) => {
    const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.abstract_api_email}&email=${email}`);
    const data = await response.json();
    return data.is_valid_format.value && data.is_free_email.value && !data.is_disposable_email.value;
}

module.exports = {  validateEmail } 
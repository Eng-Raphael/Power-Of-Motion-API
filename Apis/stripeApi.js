const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPayment(token, amount) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
      payment_method_data: {
        type: 'card',
        card: {
          token: token
        }
      }
    });
    return paymentIntent;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to create payment');
  }
}

module.exports = { createPayment };
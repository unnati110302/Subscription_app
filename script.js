document.addEventListener('DOMContentLoaded', function () {
    // Set your public key obtained from the Stripe Dashboard
    const stripePublicKey = 'your_stripe_public_key';

    // Initialize Stripe with your public key
    const stripe = Stripe(stripePublicKey);

    // Attach a click event listener to the "Get Started" button
    document.getElementById('primary__button').addEventListener('click', async function () {
      try {
        // Create a PaymentIntent on your server
        const response = await fetch('/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: [{ id: 'item_1' }] }),
          });

          if (!response.ok) {
            throw new Error('Error creating PaymentIntent.');
          }

          const { clientSecret } = await response.json();

          // Confirm the payment on the client side
          const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement), // You should have defined CardElement somewhere in your code
              billing_details: {
                name: 'Jenny Rosen',
              },
            },
          });

          if (error) {
            console.error(error);
            // Handle payment failure (e.g., display an error message to the user)
          } else {
            console.log('Payment confirmed:', paymentIntent);
            // Handle successful payment (e.g., redirect to a success page or update UI)
          }
        } catch (error) {
          console.error(error);
          // Handle other errors (e.g., network issues)
        }
      });
    });
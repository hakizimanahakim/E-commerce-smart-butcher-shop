# Flutterwave Payment Integration Setup

## Environment Variables Setup

1. Open the `frontend/.env` file
2. Replace the placeholder values with your actual Flutterwave keys:

```env
# Flutterwave Configuration
REACT_APP_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-actual-public-key-here
REACT_APP_FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-actual-secret-key-here
```

## Getting Your Flutterwave Keys

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com/)
2. Sign in to your account
3. Navigate to Settings > API Keys
4. Copy your Public Key and Secret Key
5. For testing, use the TEST keys
6. For production, use the LIVE keys

## Testing the Integration

1. Add products to your cart
2. Click "Proceed to Checkout" in the cart modal
3. Flutterwave payment modal will open directly
4. Use Flutterwave's test card details for testing

## Test Card Details (for testing only)

- **Card Number**: 5531886652142950
- **CVV**: 564
- **Expiry**: 09/32
- **PIN**: 3310
- **OTP**: 12345

## Supported Payment Methods

- Credit/Debit Cards
- Mobile Money
- Bank Transfer
- USSD

## Currency

The integration is set to use Rwandan Francs (RWF) as the default currency.

## Important Notes

- Never commit your actual API keys to version control
- Always use TEST keys during development
- Switch to LIVE keys only when ready for production
- The integration includes proper error handling and validation

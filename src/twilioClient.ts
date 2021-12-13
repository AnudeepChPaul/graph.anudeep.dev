export const getTwilioClient = () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  return new (require( 'twilio' ))( TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN );
}
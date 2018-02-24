/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.getConfigExample = () => {
  return   {account_sid: "account_sid",
            auth_token: "auth_token", 
            my_phone: "+123456789",
            test_phone: "+5555555555",
            twilio_phone: "+5555555555"};
};


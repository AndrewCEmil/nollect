/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
const Datastore = require('@google-cloud/datastore');
const ds = Datastore({projectId: 'nollect-196020'});

exports.helloWorld = (req, res) => {
  // Example input: {"message": "Hello!"}
  if (req.body.message === undefined) {
    // This is an error case, as "message" is required.
    res.status(400).send('No message defined!');
  } else {
    // Everything is okay.
    console.log(req.body.message);
    res.status(200).send('Success: ' + req.body.message);
  }
};

exports.makeCall = (req, res) => {
    const conf = loadConfig();
    const Twilio = require('twilio');
    const client = new Twilio(conf.account_sid, conf.auth_token);

    client.api.calls
      .create({
        url: 'http://demo.twilio.com/docs/voice.xml',
        to: conf.my_phone,
        from: conf.twilio_phone
      })
      .then(call => console.log(call.sid));
}

exports.loadConfig = () => {
    const q = ds.createQuery(["Secret"]);

    ds.runQuery(q, (err, entities, nextQuery) => {
        if (err) {
            console.log("error running query");
            console.log(err);
            return;
        }
        entities.map(fromDatastore).map( (e) => {
            console.log(e)
        });
    });
}

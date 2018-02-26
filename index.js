/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
const Datastore = require('@google-cloud/datastore');
const ds = Datastore({projectId: 'nollect-196020'});
const VoiceResponse = require('twilio').twiml.VoiceResponse;


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
    loadConfig((conf) => {
        const Twilio = require('twilio');
        const client = new Twilio(conf.account_sid, conf.auth_token);

        client.api.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            to: conf.my_phone,
            from: conf.twilio_phone
        });
        res.status(200).send('Success');
    });
};

exports.collectMenu = (req, res) => {
    loadConfig((conf) => {
        const twiml = new VoiceResponse();
        twiml.say('Enter your target number');
        twiml.gather({input: 'dtmf', timeout: 60, numDigits: 11});
        console.log("Response: " + twiml.toString());
        res.status(200).send(twiml.toString());
    });
}

exports.dialOutside = (req, res) => {
    loadConfig((conf) => {
        console.log("Got a request to dial outside");
        console.log(req);
        console.log(req.body);
        console.log(req.query);
        res.status(200).send('Success');
    });
}

function loadConfig(callback) {
    const q = ds.createQuery(["Secret"]);

    ds.runQuery(q, (err, entities, nextQuery) => {
        if (err) {
            console.log("error running query");
            console.log(err);
            return;
        }
        cf = {}
        entities.map(fromDatastore).map( (e) => {
            cf[e.name] = e.value;
        });
        callback(cf);
    });
}

function fromDatastore (obj) {
  obj.name = obj[Datastore.KEY].name;
  return obj;
}

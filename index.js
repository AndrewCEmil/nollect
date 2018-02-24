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
    conf = loadConfig();
    console.log(conf);
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

function loadConfig() {
    console.log("top of loadConfig");
    const q = ds.createQuery(["Secret"]);

    config = {}
    ds.runQuery(q, (err, entities, nextQuery) => {
        console.log("inside query");
        if (err) {
            console.log("error running query");
            console.log(err);
            return;
        }
        console.log("mapping entities");
        entities.map(fromDatastore).map( (e) => {
            console.log("added entity to config");
            console.log(e);
            config[e.name] = e.value;
        });
    });
    console.log("returning config");
    return config;
}

function fromDatastore (obj) {
  console.log("converting object");
  console.log(obj);
  obj.name = obj[Datastore.KEY].name;
  return obj;
}

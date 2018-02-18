import properties

from flask import Flask
from twilio.twiml.voice_response import Conference, Dial, VoiceResponse
from twilio.rest import Client

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def hello_monkey():
    """Respond to incoming requests."""
    resp = VoiceResponse()
    resp.say("Hello Monkey")
    dial = Dial()
    dial.conference(properties.default_room)
    resp.append(dial)

    client = Client(properties.account_sid, properties.auth_token)

    call = client.calls.create(
        to=properties.test_phone,
        from_=properties.twilio_phone,
        url=properties.current_ngrok)
    
    return str(resp)

@app.route("/voice.xml", methods=['GET', 'POST'])
def say_xml():
    return """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="woman">Please leave a message after the tone.</Say>
</Response>"""

@app.route("/conference.xml", methods=['GET', 'POST'])
def xml():
    return """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Dial>
        <Conference startConferenceOnEnter="true" endConferenceOnExit="true">{0}</Conference>
    </Dial>
</Response>""".format(properties.default_room)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)

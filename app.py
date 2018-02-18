import properties

from flask import Flask, request
from twilio.twiml.voice_response import Conference, Dial, Gather, VoiceResponse
from twilio.rest import Client
from pprint import pprint as pp

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def base():
    if request.form.get('Digits', None):
        return handle_start_conference(request.form.get('Digits'))
    else:
        return handle_gather()

def handle_start_conference(target_phone):
    print("Starting conference")
    response = VoiceResponse()
    call_into_conference(target_phone)
    dial = Dial()
    dial.conference(properties.default_room, start_conference_on_enter=True, end_conference_on_exit=True)
    response.append(dial)
    return str(response)

def handle_gather():
    print("Gathering")
    response = VoiceResponse()
    gather = Gather(input='dtmf', timeout=60, num_digits=11)
    gather.say('Enter your target number')
    response.append(gather)
    return str(response)

def call_into_conference(target_phone):
    client = Client(properties.account_sid, properties.auth_token)
    call = client.calls.create(
        to="+{0}".format(target_phone),
        from_=properties.twilio_phone,
        url=properties.current_ngrok + "/conference.xml")

@app.route("/conference.xml", methods=['GET', 'POST'])
def xml():
    response = VoiceResponse()
    dial = Dial()
    dial.conference(properties.default_room, start_conference_on_enter=True, end_conference_on_exit=True)
    response.append(dial)
    return str(response)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80)

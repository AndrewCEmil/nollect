import properties
from twilio.rest import Client

client = Client(properties.account_sid, properties.auth_token)

# Start a phone call
call = client.calls.create(
    to=properties.my_phone,
    from_=properties.twilio_phone,
    url="http://demo.twilio.com/docs/voice.xml"
)

print(call.sid)



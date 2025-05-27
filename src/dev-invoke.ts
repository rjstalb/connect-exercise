import { ConnectContactFlowEvent } from 'aws-lambda/trigger/connect-contact-flow';
import { handler } from '.';

const phoneNumber = '+18002262627'; // BANANAS

const mockEvent: ConnectContactFlowEvent = {
  Details: {
    ContactData: {
      CustomerEndpoint: {
        Type: 'TELEPHONE_NUMBER',
        Address: phoneNumber,
      },
      Attributes: {},
      Channel: 'VOICE',
      ContactId: '',
      InitialContactId: '',
      InitiationMethod: 'INBOUND',
      InstanceARN: '',
      PreviousContactId: '',
      Queue: null,
      SystemEndpoint: null,
      MediaStreams: {
        Customer: {
          Audio: null
        }
      }
    },
    Parameters: {}
  },
  Name: 'ContactFlowEvent'
};
handler(mockEvent);
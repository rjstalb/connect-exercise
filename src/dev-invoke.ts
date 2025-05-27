import { ConnectContactFlowEvent } from 'aws-lambda/trigger/connect-contact-flow';
import { handler } from '.';

// const ph = '+18002262627'; // BANANAS
const ph = '+19186888758';

const mockEvent: ConnectContactFlowEvent = {
  Details: {
    ContactData: {
      CustomerEndpoint: {
        Type: 'TELEPHONE_NUMBER',
        Address: ph,
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
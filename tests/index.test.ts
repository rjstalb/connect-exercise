import { ConnectContactFlowEvent } from 'aws-lambda';
import { processFlowEvent } from '../src';

const mockEvent: ConnectContactFlowEvent = {
  Details: {
    ContactData: {
      CustomerEndpoint: {
        Type: 'TELEPHONE_NUMBER',
        Address: '+1234567890',
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

describe('AWS Connect Flow Event', () => {
  it('should read Customer phone number correctly', () => {
    expect(processFlowEvent(mockEvent)).toHaveProperty('phoneNumber', '+1234567890');
  });

  it('should generate a list of vanity combinations', () => {
    const { vanityNumbers } = processFlowEvent(mockEvent);
    console.log('vanityNumbers', vanityNumbers);
    expect(vanityNumbers).toHaveLength(5);
  });
});
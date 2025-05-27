import { ConnectContactFlowEvent } from 'aws-lambda';
import { findMatchingVanityWords } from '../src/helpers';

const mockEvent: ConnectContactFlowEvent = {
  Details: {
    ContactData: {
      CustomerEndpoint: {
        Type: 'TELEPHONE_NUMBER',
        Address: '+18002262627',
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

const mockWordSet = new Set<string>(['BANANA', 'APPLE', 'ORANGE', 'GRAPE', 'PEAR', 'BANANAS', 'APPLES', 'ORANGES', 'GRAPE', 'PEARS']);


describe('AWS Connect Flow Event', () => {
  // beforeEach(() => {
  //   (fs as any).__setMockFiles({
  //     './mockWordList.txt': 'wordListPath',
  //   });
  // });
  it('should read Customer phone number and format correctly', () => {
    const phoneNumber = mockEvent.Details?.ContactData?.CustomerEndpoint?.Address || '';
    expect(findMatchingVanityWords(phoneNumber)).toHaveProperty('phoneVanityOuput.phoneNumber', '8002262627')
  });

  it('should generate a list of vanity combinations', () => {
    const phoneNumber = mockEvent.Details?.ContactData?.CustomerEndpoint?.Address || '';
    const buildVanity = findMatchingVanityWords(phoneNumber, mockWordSet);
    expect(buildVanity.bestCombinations).toHaveLength(5);
  });
});
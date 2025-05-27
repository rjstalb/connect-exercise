import { ConnectContactFlowEvent } from 'aws-lambda';
import { handler } from '../src';
import { findMatchingVanityWords } from '../src/helpers';
import fs from 'node:fs';
jest.mock('fs')

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

jest.mock('fs');

describe('AWS Connect Flow Event', () => {
  beforeEach(() => {
    (fs as any).__setMockFiles({
      'mockWordList.txt': 'wordListPath',
    });
  });
  it('should read Customer phone number correctly', () => {
    expect(handler(mockEvent)).toHaveProperty('phoneNumber', '+1234567890');
  });

  it('should generate a list of vanity combinations', () => {
    const phoneNumber = mockEvent.Details?.ContactData?.CustomerEndpoint?.Address || '';
    const buildVanity = findMatchingVanityWords(phoneNumber);
    expect(buildVanity.bestCombinations).toHaveLength(5);
  });
});
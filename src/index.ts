import { DynamoDB } from 'aws-sdk';
import { ConnectContactFlowEvent } from 'aws-lambda';
import { findMatchingVanityWords } from './helpers';

const dbClient = new DynamoDB.DocumentClient({ params: { TableName: 'RSConnectVanityTable' } });

export const handler = async (event: ConnectContactFlowEvent): Promise<any> => {

  const phoneNumber = event.Details?.ContactData?.CustomerEndpoint?.Type === 'TELEPHONE_NUMBER' ? event.Details?.ContactData?.CustomerEndpoint?.Address || '' : '';
  const buildVanity = findMatchingVanityWords(phoneNumber);

  if (phoneNumber && buildVanity.bestCombinations.length > 0) {
    await dbClient.put({
      TableName: process.env.DB_TABLE!,
      Item: {
        CallerId: phoneNumber,
        VanityOptions: buildVanity.bestCombinations
      }
    }).promise();
  }

  return {
    statusCode: 200,
    vanity_numbers: buildVanity.bestCombinations.slice(0, 3),
  };
};
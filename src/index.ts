import { DynamoDB } from 'aws-sdk';
import { ConnectContactFlowEvent } from 'aws-lambda';
import { buildTextToSpeechResponse, findMatchingVanityWords } from './helpers';
import * as fs from 'fs';
import path from 'path';
import { TOTAL_VANITY_SUGGESTIONS } from './constants';
import { BroadcastResponse } from './models';



const wordListPath = path.join(__dirname, 'data', 'words.txt');

const dbClient = new DynamoDB.DocumentClient({ params: { TableName: 'RSConnectVanityTable' } });

/**
 * AWS Lambda handler for processing ConnectContactFlowEvent events.
 *
 * This function extracts the caller's phone number from the event, reads a list of words,
 * finds matching vanity words for the phone number, stores the results in a DynamoDB table,
 * and returns a response suitable for text-to-speech broadcast.
 *
 * @param event - The AWS ConnectContactFlowEvent containing contact and customer endpoint details.
 * @returns A promise that resolves to an object containing the HTTP status code and broadcast response.
 */
export const handler = async (event: ConnectContactFlowEvent): Promise<any> => {

  const phoneNumber = event.Details?.ContactData?.CustomerEndpoint?.Type === 'TELEPHONE_NUMBER' ? event.Details?.ContactData?.CustomerEndpoint?.Address || '' : '';
  const wordList = fs.readFileSync(wordListPath, 'utf8').split('\n').map(word => word.toUpperCase());
  const wordSet = new Set(wordList.map(word => word.toUpperCase()));
  const buildVanity = findMatchingVanityWords(phoneNumber, wordSet);

  // Normally would check if bestCombinations is empty before proceeding
  // but want to record the most recent time each phone number was processed regardless
  await dbClient.put({
    TableName: process.env.DB_TABLE!,
    Item: {
      CallerId: phoneNumber,
      VanityOptions: buildVanity.bestCombinations || []
    }
  }).promise();

  const broadcastResponse: BroadcastResponse = buildTextToSpeechResponse(buildVanity.bestCombinations, TOTAL_VANITY_SUGGESTIONS);

  return {
    statusCode: 200,
    ...broadcastResponse,
  };
};



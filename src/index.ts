import { region } from './../node_modules/aws-sdk/clients/health.d';
import { DynamoDB } from 'aws-sdk';
import { ConnectContactFlowEvent } from 'aws-lambda';
import { buildTextToSpeechResponse, findMatchingVanityWords } from './helpers';
import * as fs from 'fs';
import path from 'path';
import { TOTAL_VANITY_SUGGESTIONS } from './constants';



const wordListPath = path.join(__dirname, 'data', 'words.txt');

const dbClient = new DynamoDB.DocumentClient({ params: { TableName: 'RSConnectVanityTable' } });

export const handler = async (event: ConnectContactFlowEvent): Promise<any> => {

  const phoneNumber = event.Details?.ContactData?.CustomerEndpoint?.Type === 'TELEPHONE_NUMBER' ? event.Details?.ContactData?.CustomerEndpoint?.Address || '' : '';
  console.log('Phone Number:', phoneNumber);
  const wordList = fs.readFileSync(wordListPath, 'utf8').split('\n').map(word => word.toUpperCase());
  const wordSet = new Set(wordList.map(word => word.toUpperCase()));
  console.log('Word List Size:', wordSet.size);

  const buildVanity = findMatchingVanityWords(phoneNumber, wordSet);
  console.log('Vanity Combinations:', buildVanity.bestCombinations);

  // Normally would check if bestCombinations is empty before proceeding
  // but want to record the most recent time each phone number was processed regardless
  await dbClient.put({
    TableName: process.env.DB_TABLE!,
    Item: {
      CallerId: phoneNumber,
      VanityOptions: buildVanity.bestCombinations || [],
      wordListSize: wordSet.size,
    }
  }).promise();

  const response = buildTextToSpeechResponse(buildVanity.bestCombinations, TOTAL_VANITY_SUGGESTIONS);
  console.log('TTS Response:', response);
  return {
    statusCode: 200,
    ttsResponse: response
  };
};



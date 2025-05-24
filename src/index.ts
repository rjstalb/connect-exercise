import { DynamoDB } from 'aws-sdk';
import { ConnectContactFlowEvent } from 'aws-lambda';

const dbClient = new DynamoDB.DocumentClient({ params: { TableName: 'RSConnectVanityTable' } });

const PHONE_MAP: { [key: string]: string[] } = {
  "2": ["A", "B", "C"],
  "3": ["D", "E", "F"],
  "4": ["G", "H", "I"],
  "5": ["J", "K", "L"],
  "6": ["M", "N", "O"],
  "7": ["P", "Q", "R", "S"],
  "8": ["T", "U", "V"],
  "9": ["W", "X", "Y", "Z"]
}

function getCombinations(digits: string): string[] {
  if (digits.length === 0) return [""];
  const firstDigit = digits[0];
  const letters = PHONE_MAP[firstDigit] || [firstDigit];
  const remaining = getCombinations(digits.slice(1));
  return letters.flatMap(letter => remaining.map(suffix => letter + suffix));
}

export function processFlowEvent(event: ConnectContactFlowEvent): { phoneNumber: string, vanityNumbers: string[] } {
  const phone = event.Details?.ContactData?.CustomerEndpoint?.Type === 'TELEPHONE_NUMBER' ? event.Details?.ContactData?.CustomerEndpoint?.Address || "" : "";
  let combos: string[] = [];
  if (phone !== "") {
    const digits = phone.replace(/\D/g, "").slice(-7);
    combos = getCombinations(digits).slice(0, 5);
  }
  return { phoneNumber: phone, vanityNumbers: combos };
}

export const handler = async (event: ConnectContactFlowEvent): Promise<any> => {
  const { phoneNumber, vanityNumbers } = processFlowEvent(event);

  if (phoneNumber !== "") {
    await dbClient.put({
      TableName: process.env.DB_TABLE!,
      Item: {
        CallerId: phoneNumber,
        VanityOptions: vanityNumbers
      }
    }).promise();
  }


  return {
    statusCode: 200,
    vanity_numbers: vanityNumbers.slice(0, 3),
  };
};
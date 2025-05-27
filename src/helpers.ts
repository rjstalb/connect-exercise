import { PhoneNumberUtil } from 'google-libphonenumber';
import { BroadcastResponse, PhoneNumberVanity, VanityResults } from './models';
import { PHONE_MAP } from './constants';

const phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();

export function findMatchingVanityWords(digits: string, wordSet = new Set<string>()): VanityResults {

  const phoneNumber = phoneUtil.parseAndKeepRawInput(digits);

  let phoneVanityOuput: PhoneNumberVanity = {
    phoneNumber: phoneNumber.getNationalNumberOrDefault().toString() || digits,
    countryCode: phoneNumber.getCountryCode()?.toString() ?? '',
    areaCode: '',
    prefix: '',
    line: '',
    fullLineNumber: '',
  }

  if (phoneVanityOuput.phoneNumber.length < 10) {
    return {
      phoneVanityOuput,
      bestCombinations: []
    };
  }

  phoneVanityOuput.areaCode = phoneVanityOuput.phoneNumber.slice(0, 3);

  const fullLineNumber = phoneVanityOuput.phoneNumber.slice(-7);
  phoneVanityOuput.fullLineNumber = fullLineNumber;
  phoneVanityOuput.prefix = fullLineNumber.slice(0, 3);
  phoneVanityOuput.line = fullLineNumber.slice(-4);

  // this can be optimized to not recompute the same combinations
  const lineCombinations = getAlphaCombinations(phoneVanityOuput.line);
  const prefixCombinations = getAlphaCombinations(phoneVanityOuput.prefix);
  const fullLineCombinations = getAlphaCombinations(phoneVanityOuput.fullLineNumber);
  const areaCodeCombinations = getAlphaCombinations(phoneVanityOuput.areaCode);

  phoneVanityOuput.vanityCombinations = {
    areaCode: areaCodeCombinations,
    prefix: prefixCombinations,
    line: lineCombinations,
    fullLineNumber: fullLineCombinations,
    areaCodeWordMatch: areaCodeCombinations.filter(word => wordSet.has(word)),
    prefixWordMatch: prefixCombinations.filter(word => wordSet.has(word)),
    lineWordMatch: lineCombinations.filter(word => wordSet.has(word)),
    fullLineWordMatch: fullLineCombinations.filter(word => wordSet.has(word))
  };

  // skipped matching with area code since uncommon and for sake of exploratory time
  const bestCombinations = buildBestMatches(phoneVanityOuput);

  return {
    phoneVanityOuput,
    bestCombinations
  }

}

function getAlphaCombinations(phoneNumber: string): string[] {
  if (!phoneNumber) {
    return [];
  }

  let alphaNumericResults: string[] = [''];

  for (const digit of phoneNumber) {
    const runningResult: string[] = [];
    const letters = PHONE_MAP[digit] || digit;

    if (letters) {
      for (const combo of alphaNumericResults) {
        for (const letter of letters) {
          runningResult.push(combo + letter);
        }
      }
      alphaNumericResults = runningResult;
    }
  }
  return alphaNumericResults;
}

function buildBestMatches(phoneNumber: PhoneNumberVanity, resultsCount = 5): string[] {
  if (!phoneNumber || !phoneNumber.vanityCombinations) {
    return [];
  }

  // skipping area code matches for now
  // const areaCodeMatches = phoneNumber.vanityCombinations.areaCodeWordMatch || [];
  const prefixNumberMatches = phoneNumber?.vanityCombinations?.prefixWordMatch?.map(combo => `${phoneNumber.areaCode}-${combo}-${phoneNumber.line}`) || [];
  const lineNumberMatches = phoneNumber?.vanityCombinations?.lineWordMatch?.map(combo => `${phoneNumber.areaCode}-${phoneNumber.prefix}-${combo}`) || [];
  const fullLineWordMatches = phoneNumber.vanityCombinations.fullLineWordMatch?.map(combo => `${phoneNumber.areaCode}-${combo}`) || [];

  let results = [...fullLineWordMatches, ...lineNumberMatches, ...prefixNumberMatches];

  if (results.length < resultsCount) {
    const firstGenericVanityCombinations = phoneNumber.vanityCombinations.fullLineNumber.slice(0, resultsCount - results.length).map(fullLine => `${phoneNumber.areaCode}-${fullLine}`)
    results.push(...firstGenericVanityCombinations);
  }

  return results.slice(0, resultsCount);
}

export function buildTextToSpeechResponse(vanitySuggestions: string[], numVanitySuggestions = 3): BroadcastResponse {
  let broadcaseResponse: BroadcastResponse = {
    message: '',
    suggestion1: '',
    suggestion2: '',
    suggestion3: ''
  };
  if (!vanitySuggestions || vanitySuggestions.length === 0) {
    broadcaseResponse.message = 'Unfortunately, no vanity number suggestions are available.';
  }
  if (vanitySuggestions.length > numVanitySuggestions) {
    vanitySuggestions = vanitySuggestions.slice(0, numVanitySuggestions);
  }

  const actualCountAvailable = Math.min(numVanitySuggestions, vanitySuggestions.length);
  const isPlural = actualCountAvailable > 1;
  const awareResponse = actualCountAvailable < numVanitySuggestions ? `Only ${vanitySuggestions.length} suggestions available.` : '';

  broadcaseResponse.message = `${awareResponse} Here ${isPlural ? 'are' : 'is'} ${actualCountAvailable} vanity number suggestion${isPlural ? 's' : ''}.`;

  // returning empty suggestions if no suggestions available
  // since Connect SSML provides no conditional logic support and
  // we are trying to keep the Flow architecture simplified fo sake of time.
  for (let i = 0; i < numVanitySuggestions; i++) {
    const key = `suggestion${i + 1}` as keyof BroadcastResponse;
    broadcaseResponse[key] = vanitySuggestions[i] || '';
  }
  return broadcaseResponse
}
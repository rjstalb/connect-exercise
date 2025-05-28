import { PhoneNumberUtil } from 'google-libphonenumber';
import { BroadcastResponse, PhoneNumberVanity, VanityResults } from './models';
import { PHONE_MAP } from './constants';

const phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();

/**
 * Finds matching vanity words for a given phone number string using a provided set of words.
 *
 * This function parses the input digits into a phone number, extracts its area code, prefix, and line number,
 * and generates all possible alphanumeric combinations for these segments. It then matches these combinations
 * against the provided word set to find valid vanity words. The function returns the parsed phone number details
 * along with the best matching vanity word combinations.
 *
 * @param digits - The phone number as a string of digits.
 * @param wordSet - An optional set of valid words to match against the generated combinations. Defaults to an empty set.
 * @returns An object containing the parsed phone number details and the best matching vanity word combinations.
 */
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

/**
 * Generates all possible alphanumeric combinations for a given phone number string,
 * based on the standard telephone keypad mapping (e.g., '2' -> 'ABC').
 *
 * Each digit in the input string is mapped to its corresponding set of letters,
 * and the function returns all possible combinations by replacing each digit with
 * its possible letters. Digits without a mapping are used as-is.
 *
 * @param phoneNumber - The input phone number as a string of digits.
 * @returns An array of all possible alphanumeric combinations for the given phone number.
 */
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

/**
 * Builds a list of the best vanity phone number matches based on the provided phone number object.
 *
 * The function prioritizes matches in the following order:
 * 1. Full line word matches (e.g., area code + full line word combination)
 * 2. Line number word matches (e.g., area code + prefix + line word combination)
 * 3. Prefix number word matches (e.g., area code + prefix word combination + line)
 * If there are not enough matches to satisfy the requested results count, it fills the remainder
 * with generic full line number combinations.
 *
 * @param phoneNumber - The phone number object containing vanity combinations and number parts.
 * @param resultsCount - The maximum number of results to return. Defaults to 5.
 * @returns An array of formatted vanity phone number strings, up to the specified results count.
 */
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

/**
 * Builds a response object for text-to-speech broadcast containing vanity number suggestions.
 *
 * @param vanitySuggestions - An array of vanity number suggestion strings.
 * @param numVanitySuggestions - The maximum number of suggestions to include in the response (default is 3).
 * @returns A `BroadcastResponse` object containing a message and up to three suggestions.
 *
 * @remarks
 * - If no suggestions are available, the message will indicate this and suggestions will be empty strings.
 * - If fewer suggestions are available than requested, the message will reflect the actual count.
 * - The function ensures the returned object always has `suggestion1`, `suggestion2`, and `suggestion3` keys.
 */
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
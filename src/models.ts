export interface PhoneNumberVanity {
  phoneNumber: string;
  countryCode: string;
  areaCode: string;
  prefix: string;
  line: string;
  fullLineNumber: string;
  vanityCombinations?: VanityCombinations
}

export interface VanityCombinations {
  areaCode: string[];
  prefix: string[];
  line: string[];
  fullLineNumber: string[];
  areaCodeWordMatch?: string[];
  prefixWordMatch?: string[];
  lineWordMatch?: string[];
  fullLineWordMatch?: string[];
}

export interface VanityResults {
  phoneVanityOuput: PhoneNumberVanity;
  bestCombinations: string[];
}

export interface BroadcastResponse { message: string, suggestion1: string, suggestion2: string, suggestion3: string }
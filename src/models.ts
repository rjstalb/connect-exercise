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
import BigNumber from 'bignumber.js';
import config from '../config.json';
import { Config } from '../types/config';

function getConfig() {
  return config as Config; 
}

/**
 * Convert from uDenom to the human readable equivalent as BigNumber type
 */
const convertCoinFromUDenom = (
  amount: number | string,
  decimals:number,
) => {
  BigNumber.config({ DECIMAL_PLACES: 18 });
  return new BigNumber(
    amount,
  ).dividedBy(new BigNumber(10).pow(decimals)).toString();
};

/**
 * Convert BigNumber to the uDenom string type
 */
const convertCoinToUDenom = (
  amount: BigNumber | number | string,
  decimals:number,
) => {
  if (typeof amount === 'string' || typeof amount === 'number') {
    return new BigNumber(amount).multipliedBy(new BigNumber(10).pow(decimals)).toFixed(0);
  }
  return amount.multipliedBy(new BigNumber(10).pow(decimals)).toFixed(0);
};

/**
 * verify input against a regex string
 */
const isValidStringInput = (input: string) => {
  // this rgx will match any valid input
  // ^ and $ signify the beginning and end of a string respectively
  // 1st option: [0-9]+(?:[.][0-9]*)?
  //   [0-9]+ will match one or more numbers 0-9
  //   (?:[.][0-9]*)?
  //     ? at the end will match the rgx in preceding parens zero or one times
  //     ?:[.] will match zero or one '.'
  //     [0-9]* will match number 0-9 zero or unlimited times
  // 2nd option: \.[0-9]*
  //   \. matches '.' once
  //   [0-9]* matches numbers 0-9 zero or unlimited times
  //
  // put it all together and only one decimal, with but not needed, numbers on either side
  // will match
  const rgx = /^([0-9]+(?:[.][0-9]*)?|\.[0-9]*)$/;
  return !!input.match(rgx);
};

/**
 * round a string to the amount of decimals passed in
 * This function assumes that the input has already been validated
 */
const roundStringInput = (input: string, decimals: number) => {
  // this rgx will match anything we can convert into a bignumber safely for rounding purposes
  // ^ and $ signify the beginning and end of a string respectively
  // 1st and only option: (.*[.][0-9]+)
  //   .* will match anything unlimited times
  //     (this is fine bc the assumption is that the string is verified already)
  //   [.] will match '.' once
  //   [0-9]+ will match numbers 0-9 between one and unlimited times
  //
  // This allows us to only round inputs that would potentially need rounding
  const rgx = /^(.*[.][0-9]+)$/;
  const splitString = input.split('.')[1];
  if (!input.match(rgx) || input === '' || input === '.' || splitString.length < decimals) { return input; }
  const bigNumInput = new BigNumber(input);
  if (bigNumInput.isEqualTo(0)) { return input; }
  return bigNumInput.decimalPlaces(decimals).toFormat({ groupSeparator: '', decimalSeparator: '.' });
};

export {
  convertCoinToUDenom,
  convertCoinFromUDenom,
  getConfig,
  isValidStringInput,
  roundStringInput,
};

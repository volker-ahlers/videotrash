import { IMessage } from "./types";


/**
* @param  value obj: any
*  @returns deep copy of an object, no shared reference
*/
export const CopyObject = (obj: any) => JSON.parse(JSON.stringify(obj));

/**
* @param  value max: number
* @param  value min: number
* @returns random number between min and max (including both of them)
*/
export const getRandomArbitrary = (max: number, min: number = 0) => Math.floor(Math.random() * (max - min) + min);

/**
* @param  text (in this case gatename) 
* @returns extracted number from text
*/
export const converNumbersFromTextToConcattedInteger = (text: string): number => {
  const x = text.match(/\d+/g);
  let y = "0";
  if (x) {
    x.forEach((x) => y += x)
  }
  // console.log(parseInt(y));
  return parseInt(y);
}

/**
* @param  value date: string
* @returns true if the date-string is valid, otherwise false
*/
export const parseDate = (date: string): boolean => Date.parse(date) > 0;

/**
 * @param  value date: Date
 * @returns concatinated date-string
 */
export const parseDateToString = (date: Date): string => `${date.getUTCFullYear()}.${patch(date.getUTCMonth() + 1)}.${patch(date.getUTCDate())}.${patch(date.getUTCHours())}.${patch(date.getUTCMinutes())}.${patch(date.getUTCSeconds())}`;


/**
 * @param  value value: number
 * @returns formatted number with leading zero
 */
export const patch = (value: number, patch: string = "0", limit: number = 10) => value < limit ? patch + value : value;

/**
 * @param  void
 * @returns simple plateNumber
 */
export const plateNumber = {

  genPlateNumber: function () {
    return plateNumber.genlastTwoLetters() + plateNumber.genRandomNumber(0, 999);
  },
  genRandomNumber: function (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  genlastTwoLetters: function () {
    var text = "";
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 2; i++) {
      text += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return text;
  }
};
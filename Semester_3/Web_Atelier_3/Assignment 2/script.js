
/**
 * JavaScript Exercise 1
 */


/**
 * @function scalar_product
 * @summary Computes the scalar multiplication between a n-size vector and a number.
 * @param {Number[]} vector - The array of numbers
 * @param {Number} scalar - The scalar multiplier
 * @return {Number[]} An array computed by multiplying each element of the input array `a`
 * with the input scalar value `c`.
 */
const scalar_product = (vector, scalar) => {
  if (!Array.isArray(vector)) {
    return undefined;
  }

  if (typeof scalar === 'number') {
    return vector.map(x => scalar * x);
  }


  return vector;
};

/**
 * @function inner_product
 * @summary Returns the sum of the products of same-dimension coordinates of two vectors.
 * @param {Number[]} vector1 - The first array of numbers
 * @param {Number[]} vector2 - The second array of numbers
 * @return {Number} A value computed by summing the products of each pair
 * of elements of its input arrays `a`, `b` in the same position.
 */

const inner_product = (vector1, vector2) => {
  let sumOfProducts = 0;

  if (vector1.length !== vector2.length) {
    return undefined;
  }

  for (let i = 0; i < vector1.length; i += 1) {
    const product = vector1[i] * vector2[i];
    sumOfProducts += product;
  }

  return sumOfProducts;
};

/**
 * @function mapReduce
 * @summary Maps the initial array to an another array according to a provided
 * function and then reduces it to a single value with another provided function.
 * @param {Array} array - The array
 * @param {function} mapfn - The function for the map step
 * @param {function} [reducefn= function(x,y) { return x+y; }] - The
 * function for the reduce step
 * @param {String} [seed=""] - The accumulator for the reduce step
 * @return {*} The reduced value after the map and reduce steps
 */

const mapReduce = (array, mapfn, reducefn = (x, y) => x + y, seed = '') => {
  if (!Array.isArray(array) || typeof mapfn !== 'function') { return undefined; }
  const mappedArray = array.map(mapfn);
  return mappedArray.reduce(reducefn, seed);
};

/**
 * @function mergeSortedArrays
 * @summary Merges two already sorted arrays into a single sorted one.
 * @param {Number[]} array1 - The first sorted array of numbers.
 * @param {Number[]} array2 - The second sorted array of numbers.
 * @return {Number[]} A sorted array with all the elements from
 * both `a` and `b`.
 */

const mergeSortedArrays = (array1, array2) => {
  const sortedArray = array1.concat(array2);
  sortedArray.sort((x, y) => x - y);
  return sortedArray;
};


/**
* @function range
* @summary Produces an array of all elements between x and y with the provided step.
* @param {Integer} x - The first integer
* @param {Integer} y - The second integer
* @param {Integer} [step=1] - The value to add at each step
* @return {Integer[]} An array containing numbers x, x+step, … last, where:
*    - last equals x + n*step for some n,
*    - last <= y < last + step if step > 0 and
*    - last + step < y <= last if step < 0.
*/
const range = (x, y, step = 1) => {
  if (step === 0 || !Number.isInteger(x)
                 || !Number.isInteger(y)
                 || !Number.isInteger(step)) {
    return undefined;
  }

  if (x === y) {
    return [x];
  }

  if ((x > y && step > 0) || (x < y && step < 0)) {
    return [];
  }

  const resultArray = [];
  for (let i = x; i < y; i += step) {
    resultArray.push(i);
  }

  return resultArray;
};

/**
* @function flatten
* @summary Recursively flattens the given array to be mono-dimensional.
* @param {Array} array - The array to flatten
* @return {Array} The mono-dimensional array
*/

const flatten = (array) => {
  if (!Array.isArray(array)) {
    return array;
  }
  const flatted = array.flat();
  for (let i = 0; i < flatted.length; i += 1) {
    if (Array.isArray(flatted[i])) {
      return flatten(flatted);
    }
  }
  return flatted;
};

/**
 * @function mkPrettyPrinter
 * @summary A function which returns a closure to pretty print a string.
 * @param {Integer} [line_size=72] - The line size
 * @return {Function} A function that takes a string as an argument
 * and returns an array of strings where:
 *   a. each string length is no more than `line_size` and
 *   b. doesn't contain line breaks, tabs, double spaces and initial/trailing white spaces.
 */
const mkPrettyPrinter = (line_size = 72) => {
  if (line_size < 1 || (typeof line_size !== 'number') || Number.isNaN(line_size)) {
    return undefined;
  }
  return (string) => {
    if (typeof string !== 'string') { return undefined; }
    const result = [];
    const words = string.trim().split(/\s+/);
    const line = [];
    let width = 0;
    let count = 0;
    words.forEach((word) => {
      if ((width + word.length + count) > line_size) {
        result.push(line.join(' '));
        width = 0;
        count = 0;
        line.length = 0;
      }
      line.push(word);
      width += word.length;
      count += 1;
    });
    if (line.length !== 0) {
      result.push(line.join(' ').trim());
    }
    return result;
  };
};


/**
* @function mkLineIndenter
* @summary Returns three different possible functions, to generate different indenter functions,
* its' functions are helpers for {@link mkIndenter}'s closure.
* @param {Integer} indentation - The number of spaces to prepend to a String
* @param {Boolean=} star - Whether or not to prepend a star for list items.
* @return {Function} A function which maps a string to an indented string with the according
* indentation level and/or star for list items.
*/

const mkLineIndenter = (indentation, star) => (x) => {
  if (star === undefined) {
    return ' '.repeat(indentation) + x;
  }
  if (star === true) {
    return `${' '.repeat(indentation)}* ${x}`;
  }
  return ' '.repeat(indentation + 2) + x;
};

/**
* @function mkIndenter
* @summary A function which returns a closure function.
* @param {Integer} line_size - The line size.
* @param {Integer} [level=0] level - The indentation level.
* @return {Function} A function twith the following behavior:
*     - If called with an integer `n`, change the indentation level by
*       adding `n`to the current indentation level.
*     - If called with `true`, return the current indentation level.
*     - If called with a string:
*         - break it into lines with length (after adding the indentation)
*           no more than `line_size`,
*         - add spaces in front of each line according to the current
*           indentation level and
*         - store the resulting lines internally.
*     - [optional] If called with an array of strings, create an
*       bullet list (using `*`) taking current indentation level into
*       account. Also, each element should be properly broken into lines and indented.
*     - If called with no arguments, produce an array with the lines stored so far.
*       Internal storage must be emptied. Indentation level must not be changed.
*/

const mkIndenter = (line_size, level = 0) => {
  if (!Number.isInteger(line_size) || !Number.isInteger(level)) {
    return undefined;
  }
  let indentation = level;
  let lines = [];
  return (input) => {
    // If input is an integer
    if (Number.isInteger(input)) {
      indentation += input;
    // If it's a boolean (true)
    } else if (input === true) {
      return indentation;
    // If it's a string
    } else if (typeof input === 'string') {
      const pp = mkPrettyPrinter(line_size - indentation);
      const lineIndenter = mkLineIndenter(indentation);
      const pretty_lines = pp(input).map(lineIndenter);
      lines = lines.concat(pretty_lines);
    // If it's an array of strings
    } else if (Array.isArray(input)) {
      const pp = mkPrettyPrinter(line_size - indentation - 2);
      const pretty_lines = input.map(pp);
      const lineIndenter = mkLineIndenter(indentation, false);
      const lineIndenterStar = mkLineIndenter(indentation, true);
      for (let i = 0; i < pretty_lines.length; i += 1) {
        for (let j = 0; j < pretty_lines[i].length; j += 1) {
          if (j === 0) {
            pretty_lines[i][j] = lineIndenterStar(pretty_lines[i][j]);
          } else {
            pretty_lines[i][j] = lineIndenter(pretty_lines[i][j]);
          }
        }
      }
      for (let i = 0; i < pretty_lines.length; i += 1) {
        lines = lines.concat(pretty_lines[i]);
      }
    } else if (input === undefined) {
      const result = lines.slice();
      lines = [];
      return result;
    }
  };
};

/**
 * JavaScript Exercise 2
 */

/**
 * @function letter_frequency
 * @summary Calculates the number of occurrences of letters in a given string.
 * @param {String} string - The input string.
 * @return {Object} An array indexed by the letter characters found in the string
 */
const letter_frequency = (string) => {
  const resultMap = {};
  const chars = string.toUpperCase().split('');
  chars.forEach((char) => {
    if (resultMap[char] === undefined) {
      resultMap[char] = 1;
    } else {
      resultMap[char] += 1;
    }
  });
  return resultMap;
};


/**
 * @function invalidObject
 * @summary Returns whether the provided object is a meaningful one. Helper function
 * for {@link display_letter_frequency}'s defense programming.
 * @param {Object} obj - The object to be inspected.
 * @return {Boolean} Whether the object that we inspected was a valid one
 */
const invalidObject = obj => (obj === undefined)
  || (typeof obj !== 'object')
  || (obj === null);

/**
 * @function display_letter_frequency
 * @summary Displays the output of the letter frequency analysis in an HTML table
 * generated within the `dom` element passed as parameter
 * @param {Object} frequency - The object indexed by the letter characters as returned
 * from {@link letter_frequency}.
 * @param {Object} dom - The DOM element that will contain the resulting table.
 * @return {undefined}
 */

const display_letter_frequency = (frequency, dom) => {
  if (invalidObject(frequency) || invalidObject(dom)) { return undefined; }
  let html = '<table>';
  const letters = Object.keys(frequency);
  letters.forEach((letter) => {
    if (typeof letter === 'string' && letter !== '') {
      html += `<tr><td>${letter}</td><td>${frequency[letter]}</td></tr>`;
    }
  });
  html += '</table>';
  dom.innerHTML = html;
};

/**
 * @function online_frequency_analysis
 * @summary Links the provided input text field in the test page with the table.
 * @param {Object} inputEl - The DOM object of the input element in test.html.
 * @return {undefined}
 */

const online_frequency_analysis = (inputEl) => {
  const dom = document.getElementById('frequency_table');
  const frequency = letter_frequency(inputEl.value);
  display_letter_frequency(frequency, dom);
};

/**
 * JavaScript Exercise 3
 */

/**
  * @function normalizeTimeString
  * @summary Takes a number and returns the corresponding double digit string,
  * used by {@link updateClock}.
  * @param {Integer} time - The number to be parsed into a time string
  * @return {String} The double digit time string.
  */
const normalizeTimeString = time => (time < 10 ? `0${time}` : `${time}`);

/**
  * @function updateClock
  * @summary Updates the clock div with the provided time.
  * @param {Date} date - The date to update the div with
  * @param {Object} clockDiv - The DOM element to be updated with the time
  * @return {undefined}
  */

const updateClock = (date, clockDiv) => {
  const digits = [
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  ].map(normalizeTimeString);
  clockDiv.innerHTML = `${digits[0]}:${digits[1]}:${digits[2]}`;
};

/**
  * @function clock
  * @summary A function which contains a closure and initiates a sequence of clock updates.
  * @return {function} The function which is returned to the click event handler
  * and that triggers the transition between clock and timer or resets the timer.
  */

function clock() {
  const clockDiv = document.getElementById('clock');
  let clickDate = new Date();
  let isClock = true;
  /**
    * @function tickTimer
    * @summary A function which triggers {@link updateClock} function by passing
    * it the current time elapsed so far and the div to update and schedules the
    * next call in a second.
    * @return {undefined}
    */
  const tickTimer = () => {
    const timer = new Date() - clickDate;
    updateClock(new Date(timer), clockDiv);
    setTimeout(tickTimer, 30);
  };
  /**
    * @function tickClock
    * @summary A function which updates the current time displayed in the clock div
    * and schedules itself or {@link tickTimer} as the next function to be invoked
    * after one second.
    * @return {undefined}
    */
  const tickClock = () => {
    const time = new Date().toLocaleTimeString();
    clockDiv.innerHTML = time;
    if (isClock) {
      setTimeout(tickClock, 30);
    } else {
      setTimeout(tickTimer, 30);
    }
  };
  setTimeout(tickClock, 30);
  return function toggleClock() {
    isClock = false;
    clickDate = new Date();
  };
}

export function toBinary(n): string {
  let binary = '';
  if (n < 0) {
    n = n >>> 0;
  }
  while (Math.ceil(n / 2) > 0) {
    binary = n % 2 + binary;
    n = Math.floor(n / 2);
  }
  return binary;
}

export function binaryToNumber(binary: string): number {
  let bitValue = 1;
  let value = 0;
  for (let i = binary.length - 1; i >= 0; i--) {
    if (binary[i] === '1') {
      value += bitValue;
    }
    bitValue *= 2;
  }
  return value;
}

/** Combine two strings, from the internet */
export function add(str1: string, str2: string): string {
  let sum = '';  // our result will be stored in a string.

  // we'll need these in the program many times.
  let str1Length = str1.length;
  let str2Length = str2.length;

  // if s2 is longer than s1, swap them.
  if (str2Length > str1Length) {
    let temp = str2;
    str2 = str1;
    str1 = temp;
  }

  let carry =
      0;  // number that is carried to next decimal place, initially zero.
  let a;
  let b;
  let temp;
  let digitSum;
  for (let i = 0; i < str1.length; i++) {
    a = parseInt(str1.charAt(
        str1.length - 1 -
        i));  // get ith digit of str1 from right, we store it in a
    b = parseInt(str2.charAt(
        str2.length - 1 -
        i));          // get ith digit of str2 from right, we store it in b
    b = (b) ? b : 0;  // make sure b is a number, (this is useful in case, str2
                      // is shorter than str1
    temp = (carry + a + b).toString();  // add a and b along with carry, store
                                        // it in a temp string.
    digitSum = temp.charAt(temp.length - 1);  //
    carry = parseInt(temp.substr(
        0, temp.length - 1));     // split the string into carry and digitSum (
                                  // least significant digit of abSum.
    carry = (carry) ? carry : 0;  // if carry is not number, make it zero.

    sum = (i === str1.length - 1) ?
        temp + sum :
        digitSum + sum;  // append digitSum to 'sum'. If we reach leftmost
                         // digit, append abSum which includes carry too.
  }

  return sum;  // return sum
}

export function hasOverlap(
    x1: number, x2: number, y1: number, y2: number): boolean {
  return Math.max(x1, y1) <= Math.min(x2, y2);
}

// Function to compute the GCD of two numbers
export function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b);
}

// Returns LCM of array elements
export function findlcm(arr: number[]): number {
  // Initialize result
  let ans = arr[0];

  // ans contains LCM of arr[0], ..arr[i]
  // after i'th iteration,
  for (let i = 1; i < arr.length; i++) {
    ans = (((arr[i] * ans)) / (gcd(arr[i], ans)));
  }

  return ans;
}
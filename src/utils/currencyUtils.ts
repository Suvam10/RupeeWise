/**
 * Converts a number to Indian currency words format (Lakh, Crore system).
 */
export function numberToIndianWords(num: number): string {
  if (num === 0) return "Zero Rupees";
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertLessThanThousand(n: number): string {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
    return ones[Math.floor(n / 100)] + " Hundred " + convertLessThanThousand(n % 100);
  }

  let result = "";
  let integerPart = Math.floor(num);
  let decimalPart = Math.round((num - integerPart) * 100);

  if (integerPart >= 10000000) {
    result += convertLessThanThousand(Math.floor(integerPart / 10000000)) + "Crore ";
    integerPart %= 10000000;
  }
  if (integerPart >= 100000) {
    result += convertLessThanThousand(Math.floor(integerPart / 100000)) + "Lakh ";
    integerPart %= 100000;
  }
  if (integerPart >= 1000) {
    result += convertLessThanThousand(Math.floor(integerPart / 1000)) + "Thousand ";
    integerPart %= 1000;
  }
  result += convertLessThanThousand(integerPart);

  result = result.trim() + " Rupees";

  if (decimalPart > 0) {
    result += " and " + convertLessThanThousand(decimalPart).trim() + " Paise";
  }

  return result;
}

/**
 * Formats a number in the Indian numbering system (e.g., 12,50,000).
 */
export function formatIndianNumber(num: number): string {
  const x = num.toFixed(2).split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? '.' + x[1] : '';
  const lastThree = x1.substring(x1.length - 3);
  const otherNumbers = x1.substring(0, x1.length - 3);
  if (otherNumbers !== '') {
    x1 = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  } else {
    x1 = lastThree;
  }
  return "₹" + x1 + x2;
}

/**
 * Converts text representation of numbers to actual numbers.
 * Supports basic English number words.
 */
export function textToNumber(text: string): number | null {
  const words: Record<string, number> = {
    "zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
    "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19,
    "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90,
    "hundred": 100, "thousand": 1000, "lakh": 100000, "crore": 10000000, "million": 1000000, "billion": 1000000000
  };

  const cleanText = text.toLowerCase().replace(/[^a-z ]/g, "").split(/\s+/);
  let total = 0;
  let current = 0;

  for (const word of cleanText) {
    if (word === "and") continue;
    if (words[word] !== undefined) {
      const val = words[word];
      if (val === 100) {
        current *= val;
      } else if (val >= 1000) {
        total += (current || 1) * val;
        current = 0;
      } else {
        current += val;
      }
    } else if (word !== "") {
      // If we encounter a word that isn't a number word, we might have an invalid input
      // But let's be lenient and just skip it if it's not a number word
    }
  }

  const result = total + current;
  return result > 0 || cleanText.includes("zero") ? result : null;
}

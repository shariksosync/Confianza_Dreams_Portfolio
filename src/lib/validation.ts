/**
 * Validates Indian mobile numbers and Indian landline / telephone numbers (with or without STD code & +91 prefix).
 *
 * Valid examples:
 * - 10-digit mobile: "9850983389", "7057357240", "8888123456", "6200123456"
 * - Mobile with +91 or 0: "+91 98509 83389", "09850983389", "919850983389"
 * - Landline/telephone with STD: "05424071179", "02025432100", "01123456789", "08322456789", "02942456789"
 * - Landline with formatting: "0542-4071179", "(020) 25432100", "+91-542-4071179"
 *
 * Invalid examples:
 * - Fake repeating digits: "9999999999", "00000000000", "1111111111", "0000000000"
 * - Simple sequences: "1234567890", "9876543210", "0123456789"
 * - Too short or too long: "98509", "123456789012345"
 */
export function validatePhoneNumber(input: string): {
  isValid: boolean;
  error?: string;
  cleanNumber?: string;
} {
  if (!input || !input.trim()) {
    return { isValid: false, error: "Contact phone number is required." };
  }

  const trimmed = input.trim();
  // Strip all non-digit characters
  const digits = trimmed.replace(/\D/g, "");

  // Check minimum & maximum length
  if (digits.length < 10) {
    return {
      isValid: false,
      error: "Phone number must be at least 10 digits (mobile or telephone with STD code).",
    };
  }

  if (digits.length > 13) {
    return {
      isValid: false,
      error: "Phone number is too long. Please enter a valid 10-digit mobile or telephone number.",
    };
  }

  // Extract core digits based on country/STD prefix
  let coreDigits = digits;
  if (digits.length === 12 && digits.startsWith("91")) {
    coreDigits = digits.slice(2);
  } else if (digits.length === 13 && digits.startsWith("091")) {
    coreDigits = digits.slice(3);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    // 11 digits starting with 0: e.g. 05424071179 (Varanasi STD) or 09850983389 (mobile with 0)
    coreDigits = digits;
  } else if (digits.length !== 10 && digits.length !== 11) {
    return {
      isValid: false,
      error: "Please enter a valid 10-digit mobile number or telephone number with STD code (e.g. 05424071179).",
    };
  }

  // Anti-dummy check: Ensure there are at least 3 distinct digits
  const uniqueDigits = new Set(coreDigits.split(""));
  if (uniqueDigits.size <= 2) {
    return {
      isValid: false,
      error: "Please enter a genuine, active phone number.",
    };
  }

  // Anti-dummy check: Rejects sequential mock numbers
  const sequentialPatterns = [
    "0123456789",
    "1234567890",
    "2345678901",
    "9876543210",
    "8765432109",
    "0987654321",
    "1234512345",
    "9876598765",
  ];
  if (sequentialPatterns.some((pat) => coreDigits.includes(pat) || digits.includes(pat))) {
    return {
      isValid: false,
      error: "Please enter a genuine, active phone number.",
    };
  }

  // Pattern Validation:
  // 1. 10-digit Indian Mobile: starts with 6, 7, 8, 9
  const is10DigitMobile = /^[6-9]\d{9}$/.test(coreDigits);

  // 2. 11-digit Landline or Mobile with leading 0 (0 + 2-4 digit STD code + 6-8 digit number, e.g. 05424071179, 02025432100)
  const is11DigitLandlineOrMobile = /^0[1-9]\d{9}$/.test(coreDigits);

  // 3. 10-digit Landline without leading 0 (e.g. 5424071179)
  const is10DigitLandline = /^[1-5]\d{9}$/.test(coreDigits);

  if (!is10DigitMobile && !is11DigitLandlineOrMobile && !is10DigitLandline) {
    return {
      isValid: false,
      error: "Please enter a valid 10-digit mobile number (starts 6-9) or telephone number with STD code (e.g. 05424071179).",
    };
  }

  return { isValid: true, cleanNumber: trimmed };
}

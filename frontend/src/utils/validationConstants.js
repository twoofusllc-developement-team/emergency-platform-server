// Email validation with express-validator's rules
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const BLOCKED_EMAIL_DOMAINS = ["tempmail.com", "throwaway.com"];

// Password validation matching backend rules
export const PASSWORD_VALIDATION = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 30,
  PATTERNS: {
    LOWERCASE: /[a-z]/,
    UPPERCASE: /[A-Z]/,
    NUMBER: /\d/,
    SPECIAL: /[\W_]/,
  },
  COMMON_PASSWORDS: [
    "Password123!",
    "Admin123!",
    "P@ssw0rd2024",
    "P@ssw0rd2025",
  ],
};

// Name validation matching backend rules
export const NAME_REGEX = /^[a-zA-Z\s]{2,30}$/;

// Validate email including blocked domains
export const validateEmail = (email) => {
  if (!email.trim()) {
    return "Please fill up this field";
  }
  if (!email) {
    return "Email is required";
  }
  if (!EMAIL_REGEX.test(email)) {
    return "Invalid email format";
  }
  const domain = email.split("@")[1];
  if (BLOCKED_EMAIL_DOMAINS.includes(domain)) {
    return "Email domain not allowed";
  }
  return "";
};

// Comprehensive password validation
export const validatePassword = (password) => {
  if (!password.trim()) {
    return "Please fill up this field";
  }
  if (!password) {
    return "Password is required";
  }
  if (password.length < PASSWORD_VALIDATION.MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_VALIDATION.MIN_LENGTH} characters`;
  }
  if (password.length > PASSWORD_VALIDATION.MAX_LENGTH) {
    return `Password must not exceed ${PASSWORD_VALIDATION.MAX_LENGTH} characters`;
  }
  if (!PASSWORD_VALIDATION.PATTERNS.LOWERCASE.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!PASSWORD_VALIDATION.PATTERNS.UPPERCASE.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!PASSWORD_VALIDATION.PATTERNS.NUMBER.test(password)) {
    return "Password must contain at least one number";
  }
  if (!PASSWORD_VALIDATION.PATTERNS.SPECIAL.test(password)) {
    return "Password must contain at least one special character";
  }
  if (PASSWORD_VALIDATION.COMMON_PASSWORDS.includes(password)) {
    return "Password is too common";
  }
  return "";
};

// Name validation
export const validateName = (name) => {
  if (!name.trim()) {
    return "Please fill up this field";
  }
  if (!name) {
    return "Name is required";
  }
  if (!NAME_REGEX.test(name)) {
    return "Name must be 2-30 characters long and contain only letters";
  }
  return "";
};

// validationConstants.js
// export const validateOTP = (value) => {
//   if (!value) return "Verification code is required";
//   if (!/^\d{6}$/.test(value)) return "Code must be 6 digits";
//   return "";
// };

// Phone number validation (simple international/local)
export const validatePhoneNumber = (phone) => {
  if (!phone.trim()) {
    return "Please fill up this field";
  }
  // Accepts +countrycode, spaces, dashes, and numbers
  const PHONE_REGEX = /^\+?\d{7,15}$/;
  if (!PHONE_REGEX.test(phone.replace(/[-\s]/g, ""))) {
    return "Invalid phone number format";
  }
  return "";
}; 
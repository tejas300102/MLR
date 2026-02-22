// MLR-Frontend/src/utils/validation.js

export const patterns = {
  // Matches ValidationPatterns.PersonName: 1-50 chars, starts with letter, letters and spaces only
  name: /^[A-Za-z][A-Za-z ]{0,49}$/,

  // Matches ValidationPatterns.Email: Simple, practical email regex
  email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,

  // Matches ValidationPatterns.Password: Min 6 chars, at least 1 digit
  password: /^(?=.*\d).{6,}$/
};

export const messages = {
  firstName: "First name must start with a letter and contain only letters/spaces (max 50 chars).",
  lastName: "Last name must start with a letter and contain only letters/spaces (max 50 chars).",
  email: "Please enter a valid email address.",
  password: "Password must be at least 6 characters and contain at least 1 digit.",
  confirmPassword: "Passwords do not match."
};
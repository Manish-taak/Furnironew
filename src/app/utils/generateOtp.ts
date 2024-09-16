// src/app/utils/generateOtp.ts

import crypto from 'crypto';

// Function to generate a random OTP
export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
}

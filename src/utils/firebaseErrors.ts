/**
 * Maps raw Firebase Authentication error codes to clean, human-readable user messages.
 */
export function getFirebaseErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const code = error.code || '';
  const message = error.message || '';

  switch (code) {
    // Auth Email & Password errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify your credentials.';
    case 'auth/wrong-password':
      return 'The password entered is incorrect. Please try again.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters strong.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to many failed attempts. Please wait a moment or try again later.';
    
    // Phone / OTP errors
    case 'auth/invalid-phone-number':
      return 'Please enter a valid 10-digit Indian phone number (+91).';
    case 'auth/missing-phone-number':
      return 'Phone number is required for verification.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded for now. Please try again later or sign in with email.';
    case 'auth/code-expired':
      return 'The OTP verification code has expired. Please tap Resend OTP.';
    case 'auth/invalid-verification-code':
      return 'Incorrect OTP entered. Please re-check the 6-digit code sent to your phone.';
    case 'auth/captcha-check-failed':
      return 'reCAPTCHA verification failed. Please try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    default:
      if (message.includes('auth/email-already-in-use')) {
        return 'An account with this email already exists. Please sign in.';
      }
      return message || 'Authentication failed. Please check your details and try again.';
  }
}

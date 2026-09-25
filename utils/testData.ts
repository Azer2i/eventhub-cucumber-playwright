const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Sam', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Drew', 'Avery'];
const LAST_NAMES = ['Carter', 'Bennett', 'Reyes', 'Novak', 'Hughes', 'Mitchell', 'Fischer', 'Okafor', 'Larsen', 'Rossi'];

/** Generates a fake, non-personal full name for test data. */
export function generateFullName(): string {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
}

/** Generates a unique email address using the current timestamp. */
export function generateUniqueEmail(): string {
  return `qa.user+${Date.now()}@example.com`;
}

/** Generates a phone number in the format +994 followed by 9 random digits. */
export function generatePhoneNumber(): string {
  let digits = '';
  for (let i = 0; i < 9; i++) {
    digits += Math.floor(Math.random() * 10);
  }
  return `+994${digits}`;
}

const PASSWORD_SPECIAL_CHARACTERS = ['!', '@', '#', '$', '%', '^', '&', '*'];

/** Generates a password meeting the site's requirements: 8+ chars, one uppercase letter, one number, one special character. */
export function generateRandomPassword(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  const special = PASSWORD_SPECIAL_CHARACTERS[Math.floor(Math.random() * PASSWORD_SPECIAL_CHARACTERS.length)];
  return `Qa${digits}${special}pass`;
}

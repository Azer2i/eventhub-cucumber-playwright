import dotenv from 'dotenv';

dotenv.config();

export const TEST_CONFIG = {
  baseUrl: process.env.BASE_URL ?? 'https://eventhub.rahulshettyacademy.com',
  userEmail: process.env.EVENTHUB_EMAIL ?? '',
  userPassword: process.env.EVENTHUB_PASSWORD ?? '',
};

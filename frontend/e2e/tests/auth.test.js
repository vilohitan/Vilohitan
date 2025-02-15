import { device, element, by } from 'detox';

describe('Authentication Flow', () => {
  const testUser = {
    username: 'vilohitan',
    password: 'testPassword123',
    timestamp: '2025-02-14 19:41:36'
  };

  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
  });

  it('should login successfully', async () => {
    await element(by.id('username-input')).typeText(testUser.username);
    await element(by.id('password-input')).typeText(testUser.password);
    await element(by.id('login-button')).tap();

    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('username-input')).typeText('invalid');
    await element(by.id('password-input')).typeText('wrong');
    await element(by.id('login-button')).tap();

    await expect(element(by.id('error-message'))).toBeVisible();
  });
});
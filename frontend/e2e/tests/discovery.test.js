import { device, element, by } from 'detox';

describe('Discovery Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    // Login as test user
    await element(by.id('username-input')).typeText('vilohitan');
    await element(by.id('password-input')).typeText('testPassword123');
    await element(by.id('login-button')).tap();
  });

  it('should show discovery cards', async () => {
    await expect(element(by.id('discovery-screen'))).toBeVisible();
    await expect(element(by.id('match-card'))).toBeVisible();
  });

  it('should handle like action', async () => {
    await element(by.id('like-button')).tap();
    // Verify card transition animation
    await expect(element(by.id('match-card'))).toBeVisible();
  });

  it('should handle match popup', async () => {
    // Simulate a match
    await element(by.id('like-button')).tap();
    await expect(element(by.id('match-popup'))).toBeVisible();
  });
});
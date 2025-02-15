import React from 'react';
import MatchCard from '../../components/MatchCard';
import UIComponentTest from './ui/UIComponentTest';

describe('MatchCard UI Tests', () => {
  const mockProps = {
    user: {
      id: 'test123',
      name: 'Test User',
      age: 28,
      photos: ['https://example.com/photo.jpg'],
      bio: 'Test bio',
      lastActive: '2025-02-14 19:43:52'
    },
    onLike: jest.fn(),
    onPass: jest.fn()
  };

  it('renders with accessibility support', async () => {
    const results = await UIComponentTest.testAccessibility(
      <MatchCard {...mockProps} />
    );

    expect(results.hasAccessibleLabels).toBe(true);
    expect(results.hasAdequateContrast).toBe(true);
    expect(results.supportsScreenReader).toBe(true);
  });

  it('handles user interactions correctly', async () => {
    const interactions = [
      {
        name: 'Like Button Press',
        type: 'press',
        elementId: 'like-button',
        payload: {}
      },
      {
        name: 'Pass Button Press',
        type: 'press',
        elementId: 'pass-button',
        payload: {}
      }
    ];

    const results = await UIComponentTest.testInteractions(
      <MatchCard {...mockProps} />,
      interactions
    );

    expect(results.every(r => r.success)).toBe(true);
  });

  it('maintains layout across breakpoints', async () => {
    const breakpoints = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 800 }
    ];

    const results = await UIComponentTest.testResponsiveness(
      <MatchCard {...mockProps} />,
      breakpoints
    );

    results.forEach(result => {
      expect(result.elements.some(e => e.isResponsive)).toBe(true);
    });
  });
});
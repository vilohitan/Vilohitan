import { UserProfile, MatchScore, MatchingFactors } from '../types';
import { AIMatchingService } from '../services/AIMatchingService';

export class MatchingAlgorithm {
  private timestamp: string = '2025-02-15 07:33:24';
  private user: string = 'vilohitan';
  private aiService: AIMatchingService;

  constructor(private isPremium: boolean) {
    this.aiService = new AIMatchingService();
  }

  async calculateMatch(
    profile1: UserProfile,
    profile2: UserProfile
  ): Promise<MatchScore> {
    if (this.isPremium) {
      return this.calculatePremiumMatch(profile1, profile2);
    }
    return this.calculateBasicMatch(profile1, profile2);
  }

  private async calculateBasicMatch(
    profile1: UserProfile,
    profile2: UserProfile
  ): Promise<MatchScore> {
    const factors: MatchingFactors = {
      interests: this.calculateInterestMatch(profile1, profile2),
      location: this.calculateLocationScore(profile1, profile2),
      agePreference: this.calculateAgePreferenceMatch(profile1, profile2),
      activeStatus: this.calculateActiveStatusScore(profile1, profile2)
    };

    return {
      overall: this.weightedAverage(factors, {
        interests: 0.4,
        location: 0.3,
        agePreference: 0.2,
        activeStatus: 0.1
      }),
      factors,
      timestamp: this.timestamp,
      user: this.user
    };
  }

  private async calculatePremiumMatch(
    profile1: UserProfile,
    profile2: UserProfile
  ): Promise<MatchScore> {
    const basicScore = await this.calculateBasicMatch(profile1, profile2);
    const aiScore = await this.aiService.getMatchScore(profile1, profile2);
    
    const advancedFactors = {
      ...basicScore.factors,
      compatibility: await this.calculateCompatibilityScore(profile1, profile2),
      behavior: await this.analyzeBehavioralMatch(profile1, profile2),
      preferences: this.calculatePreferenceMatch(profile1, profile2),
      activity: this.calculateActivityCompatibility(profile1, profile2),
      socialGraph: await this.analyzeSocialGraphOverlap(profile1, profile2)
    };

    return {
      overall: this.weightedAverage({
        ...advancedFactors,
        aiScore
      }, {
        interests: 0.2,
        location: 0.15,
        agePreference: 0.1,
        activeStatus: 0.05,
        compatibility: 0.15,
        behavior: 0.1,
        preferences: 0.1,
        activity: 0.05,
        socialGraph: 0.05,
        aiScore: 0.05
      }),
      factors: advancedFactors,
      aiScore,
      timestamp: this.timestamp,
      user: this.user
    };
  }

  private weightedAverage(
    factors: Record<string, number>,
    weights: Record<string, number>
  ): number {
    let total = 0;
    let weightSum = 0;

    for (const [factor, score] of Object.entries(factors)) {
      const weight = weights[factor] || 0;
      total += score * weight;
      weightSum += weight;
    }

    return total / weightSum;
  }

  // Implementation of individual scoring methods...
  // These would be fully implemented in the actual code
  private calculateInterestMatch(p1: UserProfile, p2: UserProfile): number {
    // Implementation details
    return 0.8;
  }

  private calculateLocationScore(p1: UserProfile, p2: UserProfile): number {
    // Implementation details
    return 0.7;
  }

  private calculateAgePreferenceMatch(p1: UserProfile, p2: UserProfile): number {
    // Implementation details
    return 0.9;
  }

  private calculateActiveStatusScore(p1: UserProfile, p2: UserProfile): number {
    // Implementation details
    return 0.85;
  }

  private async calculateCompatibilityScore(p1: UserProfile, p2: UserProfile): Promise<number> {
    // Implementation details
    return 0.75;
  }

  private async analyzeBehavioralMatch(p1: UserProfile, p2: UserProfile): Promise<number> {
    // Implementation details
    return 0.82;
  }

  private calculatePreferenceMatch(p1: UserProfile, p2: UserProfile): number {
    // Implementation details
    return 0.78;
  }

  private calculateActivityCompatibility(p1: UserProfile, p2: UserProfile): number {
    // Implementation details
    return 0.88;
  }

  private async analyzeSocialGraphOverlap(p1: UserProfile, p2: UserProfile): Promise<number> {
    // Implementation details
    return 0.65;
  }
}
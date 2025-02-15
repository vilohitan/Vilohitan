interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  userPercentage: number;
  startDate: string;
  endDate: string;
  conditions?: Record<string, any>;
  variants?: Record<string, any>;
}

class FeatureToggleSystem {
  private timestamp: string = '2025-02-15 07:33:24';
  private user: string = 'vilohitan';
  private toggles: Map<string, FeatureToggle>;

  constructor() {
    this.toggles = new Map();
    this.initializeToggles();
  }

  private initializeToggles() {
    const defaultToggles: FeatureToggle[] = [
      {
        id: 'premium_trial',
        name: 'Premium Trial Offer',
        description: 'Offer 7-day premium trial to new users',
        enabled: true,
        userPercentage: 50,
        startDate: '2025-02-15',
        endDate: '2025-03-15',
        conditions: {
          newUser: true,
          minAge: 18,
          maxAge: 65,
          regions: ['IN']
        }
      },
      {
        id: 'ai_matching',
        name: 'AI-Enhanced Matching',
        description: 'Enable AI-powered matching for free users',
        enabled: true,
        userPercentage: 25,
        startDate: '2025-02-15',
        endDate: '2025-04-15',
        variants: {
          control: { weight: 0.33, aiEnabled: false },
          variant_a: { weight: 0.33, aiEnabled: true, confidence: 0.7 },
          variant_b: { weight: 0.34, aiEnabled: true, confidence: 0.9 }
        }
      },
      {
        id: 'location_boost',
        name: 'Location Boost Feature',
        description: 'Temporary location boost for free users',
        enabled: true,
        userPercentage: 30,
        startDate: '2025-02-15',
        endDate: '2025-03-30',
        conditions: {
          minSwipes: 20,
          activeHours: 48
        }
      }
    ];

    defaultToggles.forEach(toggle => {
      this.toggles.set(toggle.id, toggle);
    });
  }

  isEnabled(toggleId: string, userId: string): boolean {
    const toggle = this.toggles.get(toggleId);
    if (!toggle || !toggle.enabled) return false;

    const userHash = this.hashUser(userId);
    const userPercentile = userHash % 100;

    return userPercentile < toggle.userPercentage;
  }

  getVariant(toggleId: string, userId: string): string | null {
    const toggle = this.toggles.get(toggleId);
    if (!toggle || !toggle.variants) return null;

    const userHash = this.hashUser(userId);
    const variantList = Object.entries(toggle.variants);
    const totalWeight = variantList.reduce((sum, [_, variant]) => sum + variant.weight, 0);
    const userValue = (userHash % 100) / 100 * totalWeight;

    let accumulated = 0;
    for (const [variantName, variant] of variantList) {
      accumulated += variant.weight;
      if (userValue <= accumulated) {
        return variantName;
      }
    }

    return null;
  }

  private hashUser(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  getActiveExperiments(userId: string): Record<string, any> {
    const active: Record<string, any> = {};

    this.toggles.forEach((toggle, id) => {
      if (this.isEnabled(id, userId)) {
        active[id] = {
          enabled: true,
          variant: this.getVariant(id, userId),
          timestamp: this.timestamp
        };
      }
    });

    return active;
  }

  generateReport(): Record<string, any> {
    return {
      timestamp: this.timestamp,
      user: this.user,
      activeToggles: Array.from(this.toggles.entries())
        .filter(([_, toggle]) => toggle.enabled)
        .map ▋
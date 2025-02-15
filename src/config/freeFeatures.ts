interface FreeFeatureConfig {
  dailySwipes: {
    limit: number;
    resetInterval: string; // ISO 8601 duration
    graceExtra: number; // Additional swipes possible after limit
  };
  likes: {
    visibilityLimit: number;
    sortOrder: 'recent' | 'compatibility';
    refreshInterval: string; // ISO 8601 duration
  };
  filters: {
    available: string[];
    restrictions: {
      ageRange: {
        min: number;
        max: number;
      };
      distance: {
        max: number; // in kilometers
        unit: string;
      };
      interests: {
        maxSelection: number;
      };
    };
  };
  matchPriority: {
    tier: string;
    queuePosition: string;
    delayInterval: string; // ISO 8601 duration
  };
  advertising: {
    enabled: boolean;
    frequency: string;
    lastUpdated: string;
  };
  location: {
    canChange: boolean;
    updateFrequency: string; // ISO 8601 duration
    accuracy: string;
  };
  photos: {
    maxCount: number;
    requireDescription: boolean;
    maxDescriptionLength: number;
    allowedFormats: string[];
  };
  matchingAlgorithm: {
    type: string;
    factors: string[];
    weights: Record<string, number>;
  };
}

const freeFeaturesConfig: FreeFeatureConfig = {
  dailySwipes: {
    limit: 50,
    resetInterval: "P1D", // Resets every 24 hours
    graceExtra: 0
  },
  likes: {
    visibilityLimit: 10,
    sortOrder: "recent",
    refreshInterval: "PT6H" // Refreshes every 6 hours
  },
  filters: {
    available: ["age", "distance", "interests"],
    restrictions: {
      ageRange: {
        min: 18,
        max: 100
      },
      distance: {
        max: 100,
        unit: "km"
      },
      interests: {
        maxSelection: 5
      }
    }
  },
  matchPriority: {
    tier: "standard",
    queuePosition: "after_premium",
    delayInterval: "PT1H" // 1 hour delay after premium matches
  },
  advertising: {
    enabled: false,
    frequency: "never",
    lastUpdated: "2025-02-15 07:32:01"
  },
  location: {
    canChange: true,
    updateFrequency: "PT15M", // Can update location every 15 minutes
    accuracy: "high"
  },
  photos: {
    maxCount: 6,
    requireDescription: true,
    maxDescriptionLength: 100,
    allowedFormats: ["jpg", "jpeg", "png"]
  },
  matchingAlgorithm: {
    type: "basic",
    factors: [
      "interests",
      "location",
      "age_preference",
      "active_status"
    ],
    weights: {
      interests: 0.4,
      location: 0.3,
      age_preference: 0.2,
      active_status: 0.1
    }
  }
};

export const getFreeFeatures = () => {
  return {
    ...freeFeaturesConfig,
    timestamp: "2025-02-15 07:32:01",
    user: "vilohitan"
  };
};
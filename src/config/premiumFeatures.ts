interface PremiumFeatureConfig {
  subscription: {
    pricing: {
      amount: number;
      currency: string;
      interval: string;
      discounts: Record<string, number>;
    };
    features: Record<string, boolean>;
    perks: string[];
  };
  dailySwipes: {
    limit: number | 'unlimited';
    resetInterval: string;
    boostAvailable: boolean;
  };
  likes: {
    visibility: 'full' | 'partial';
    instantNotification: boolean;
    advanced: boolean;
  };
  filters: {
    available: string[];
    advanced: Record<string, any>;
  };
  matchPriority: {
    tier: string;
    boost: {
      included: number;
      duration: string;
    };
  };
  photos: {
    maxCount: number;
    features: string[];
  };
  matchingAlgorithm: {
    type: string;
    features: string[];
    aiEnabled: boolean;
  };
}

const premiumFeaturesConfig: PremiumFeatureConfig = {
  subscription: {
    pricing: {
      amount: 50,
      currency: "INR",
      interval: "week",
      discounts: {
        "monthly": 15,  // 15% off for monthly subscription
        "quarterly": 25, // 25% off for quarterly subscription
        "yearly": 40    // 40% off for yearly subscription
      }
    },
    features: {
      unlimited_swipes: true,
      see_all_likes: true,
      advanced_filters: true,
      priority_matching: true,
      no_ads: true,
      advanced_analytics: true,
      read_receipts: true,
      message_priority: true
    },
    perks: [
      "Weekly Super Likes",
      "Monthly Boost",
      "Premium Badge",
      "Priority Support"
    ]
  },
  dailySwipes: {
    limit: "unlimited",
    resetInterval: "P1D",
    boostAvailable: true
  },
  likes: {
    visibility: "full",
    instantNotification: true,
    advanced: true
  },
  filters: {
    available: [
      "age",
      "distance",
      "interests",
      "education",
      "height",
      "zodiac",
      "lifestyle",
      "relationship_goals",
      "languages",
      "occupation"
    ],
    advanced: {
      compatibility_score: {
        min: 0,
        max: 100
      },
      activity_level: [
        "very_active",
        "active",
        "moderate",
        "low"
      ],
      verified_only: true
    }
  },
  matchPriority: {
    tier: "premium",
    boost: {
      included: 1,
      duration: "PT1H"
    }
  },
  photos: {
    maxCount: 12,
    features: [
      "HD_Quality",
      "Video_Upload",
      "Photo_Verification",
      "Profile_Highlights"
    ]
  },
  matchingAlgorithm: {
    type: "advanced",
    features: [
      "AI_Matching",
      "Behavioral_Analysis",
      "Compatibility_Scoring",
      "Activity_Based_Recommendations",
      "Machine_Learning_Optimization"
    ],
    aiEnabled: true
  }
};

export const getPremiumFeatures = () => {
  return {
    ...premiumFeaturesConfig,
    timestamp: "2025-02-15 07:33:24",
    user: "vilohitan"
  };
};
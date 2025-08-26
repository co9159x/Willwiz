interface FeatureFlags {
  aiAssistant: boolean;
  aiIntake: boolean;
  advancedReporting: boolean;
}

export function getFeatureFlags(): FeatureFlags {
  return {
    aiAssistant: process.env.FEATURE_AI_ASSISTANT === 'true',
    aiIntake: process.env.FEATURE_AI_INTAKE === 'true',
    advancedReporting: process.env.FEATURE_ADVANCED_REPORTING === 'true',
  };
}
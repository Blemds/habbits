export interface DailyTracking {
  date: string;
  mood: number;
  stressLevel: number;
  compulsiveThoughts: {
    present: boolean;
    description: string;
  };
  compulsiveActions: {
    present: boolean;
    description: string;
  };
  relaxationActivities: string;
  difficulties: string;
  planForTomorrow: string;
}

export interface AntiStressPlan {
  breathingExercises: boolean;
  walking: boolean;
  reflection: boolean;
  digitalBreak: boolean;
  waterIntake: boolean;
}

export interface CompulsionManagementPlan {
  thoughtControl: boolean;
  delayedAction: boolean;
  writtenThoughts: boolean;
  selfEncouragement: boolean;
  reward: boolean;
} 
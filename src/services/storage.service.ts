import { Preferences } from '@capacitor/preferences';
import type { DailyTracking, AntiStressPlan, CompulsionManagementPlan } from '@/types/tracker';

const STORAGE_KEYS = {
  DAILY_TRACKING: 'daily_tracking',
  ANTI_STRESS_PLAN: 'anti_stress_plan',
  COMPULSION_PLAN: 'compulsion_plan'
};

export class StorageService {
  static async saveDailyTracking(tracking: DailyTracking): Promise<void> {
    try {
      console.log('Lese vorhandene Daten...');
      const existingData = await this.getDailyTrackingHistory();
      console.log('Vorhandene Daten:', JSON.stringify(existingData));
      
      existingData.push(tracking);
      console.log('Neue Daten zum Speichern:', JSON.stringify(existingData));
      
      await Preferences.set({
        key: STORAGE_KEYS.DAILY_TRACKING,
        value: JSON.stringify(existingData)
      });
      console.log('Daten erfolgreich gespeichert');
    } catch (error) {
      console.error('Fehler in saveDailyTracking:', error);
      throw error;
    }
  }

  static async getDailyTrackingHistory(): Promise<DailyTracking[]> {
    try {
      console.log('Lese Tracking-Historie...');
      const result = await Preferences.get({ key: STORAGE_KEYS.DAILY_TRACKING });
      console.log('Ergebnis:', result);
      return result.value ? JSON.parse(result.value) : [];
    } catch (error) {
      console.error('Fehler in getDailyTrackingHistory:', error);
      return [];
    }
  }

  static async saveAntiStressPlan(plan: AntiStressPlan): Promise<void> {
    await Preferences.set({
      key: STORAGE_KEYS.ANTI_STRESS_PLAN,
      value: JSON.stringify(plan)
    });
  }

  static async getAntiStressPlan(): Promise<AntiStressPlan | null> {
    const { value } = await Preferences.get({ key: STORAGE_KEYS.ANTI_STRESS_PLAN });
    return value ? JSON.parse(value) : null;
  }

  static async saveCompulsionPlan(plan: CompulsionManagementPlan): Promise<void> {
    await Preferences.set({
      key: STORAGE_KEYS.COMPULSION_PLAN,
      value: JSON.stringify(plan)
    });
  }

  static async getCompulsionPlan(): Promise<CompulsionManagementPlan | null> {
    const { value } = await Preferences.get({ key: STORAGE_KEYS.COMPULSION_PLAN });
    return value ? JSON.parse(value) : null;
  }

  static async deleteDailyTrackingHistory(): Promise<void> {
    await Preferences.remove({ key: STORAGE_KEYS.DAILY_TRACKING });
  }

  static async deleteAntiStressPlan(): Promise<void> {
    await Preferences.remove({ key: STORAGE_KEYS.ANTI_STRESS_PLAN });
  }

  static async deleteCompulsionPlan(): Promise<void> {
    await Preferences.remove({ key: STORAGE_KEYS.COMPULSION_PLAN });
  }

  static async deleteDailyTrackingEntry(date: string): Promise<void> {
    const entriesString = await Preferences.get({ key: STORAGE_KEYS.DAILY_TRACKING });
    const entries = entriesString.value ? JSON.parse(entriesString.value) : [];
    
    const filteredEntries = entries.filter((entry: any) => entry.date !== date);
    
    await Preferences.set({
      key: STORAGE_KEYS.DAILY_TRACKING,
      value: JSON.stringify(filteredEntries)
    });
  }
} 
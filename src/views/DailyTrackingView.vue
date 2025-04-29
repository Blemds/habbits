<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Täglicher Check-in</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Datum und Grundstimmung -->
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>{{ formatDate(tracking.date) }}</ion-card-subtitle>
          <ion-card-title>Wie geht es dir heute?</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="mood-container">
            <ion-label>Stimmung</ion-label>
            <div class="mood-indicator">
              <ion-icon :icon="happyOutline" size="large" class="happy-icon"></ion-icon>
              <ion-range :min="0" :max="10" :step="1" v-model="tracking.mood" color="primary">
                <ion-label slot="start">0</ion-label>
                <ion-label slot="end">10</ion-label>
              </ion-range>
            </div>
          </div>
          
          <div class="stress-container">
            <ion-label>Stresslevel</ion-label>
            <div class="stress-indicator">
              <ion-icon :icon="pulseOutline" size="large" class="stress-icon"></ion-icon>
              <ion-range :min="0" :max="10" :step="1" v-model="tracking.stressLevel" color="danger">
                <ion-label slot="start">0</ion-label>
                <ion-label slot="end">10</ion-label>
              </ion-range>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Zwangsgedanken und -handlungen -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Zwangsgedanken & Handlungen</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item>
              <ion-icon :icon="medicalOutline" slot="start" color="primary"></ion-icon>
              <ion-label>Zwangsgedanken heute?</ion-label>
              <ion-toggle v-model="tracking.compulsiveThoughts.present" color="primary"></ion-toggle>
            </ion-item>

            <ion-item v-if="tracking.compulsiveThoughts.present">
              <ion-textarea
                v-model="tracking.compulsiveThoughts.description"
                placeholder="Beschreibe deine Gedanken..."
                :auto-grow="true"
                class="custom-textarea"
              ></ion-textarea>
            </ion-item>

            <ion-item class="ion-margin-top">
              <ion-icon :icon="handLeft" slot="start" color="primary"></ion-icon>
              <ion-label>Zwangshandlungen heute?</ion-label>
              <ion-toggle v-model="tracking.compulsiveActions.present" color="primary"></ion-toggle>
            </ion-item>

            <ion-item v-if="tracking.compulsiveActions.present">
              <ion-textarea
                v-model="tracking.compulsiveActions.description"
                placeholder="Beschreibe deine Handlungen..."
                :auto-grow="true"
                class="custom-textarea"
              ></ion-textarea>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Reflexion -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Tagesreflexion</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item>
              <ion-icon :icon="leaf" slot="start" color="success"></ion-icon>
              <ion-textarea
                v-model="tracking.relaxationActivities"
                placeholder="Was hat dir heute geholfen zu entspannen?"
                :auto-grow="true"
                class="custom-textarea"
              ></ion-textarea>
            </ion-item>

            <ion-item>
              <ion-icon :icon="warning" slot="start" color="warning"></ion-icon>
              <ion-textarea
                v-model="tracking.difficulties"
                placeholder="Was war heute besonders herausfordernd?"
                :auto-grow="true"
                class="custom-textarea"
              ></ion-textarea>
            </ion-item>

            <ion-item>
              <ion-icon :icon="sunny" slot="start" color="tertiary"></ion-icon>
              <ion-textarea
                v-model="tracking.planForTomorrow"
                placeholder="Was nimmst du dir für morgen vor?"
                :auto-grow="true"
                class="custom-textarea"
              ></ion-textarea>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" class="ion-margin" @click="saveTracking" color="primary">
        <ion-icon :icon="save" slot="start"></ion-icon>
        Eintrag speichern
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonList, IonItem, IonLabel, IonInput, IonTextarea, IonToggle,
  IonRange, IonButton, IonIcon
} from '@ionic/vue';
import {
  happyOutline,
  pulseOutline,
  medicalOutline,
  handLeft,
  leaf,
  warning,
  sunny,
  save
} from 'ionicons/icons';
import type { DailyTracking } from '@/types/tracker';
import { StorageService } from '@/services/storage.service';

const tracking = ref<DailyTracking>({
  date: new Date().toISOString().split('T')[0],
  mood: 5,
  stressLevel: 5,
  compulsiveThoughts: {
    present: false,
    description: '',
  },
  compulsiveActions: {
    present: false,
    description: '',
  },
  relaxationActivities: '',
  difficulties: '',
  planForTomorrow: '',
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const saveTracking = async () => {
  try {
    console.log('Speichere Tracking:', JSON.stringify(tracking.value));
    await StorageService.saveDailyTracking(tracking.value);
    console.log('Speichern erfolgreich');
    // Reset form after saving
    tracking.value = {
      date: new Date().toISOString().split('T')[0],
      mood: 5,
      stressLevel: 5,
      compulsiveThoughts: {
        present: false,
        description: '',
      },
      compulsiveActions: {
        present: false,
        description: '',
      },
      relaxationActivities: '',
      difficulties: '',
      planForTomorrow: '',
    };
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
    alert('Fehler beim Speichern: ' + JSON.stringify(error));
  }
};
</script>

<style scoped>
.mood-container, .stress-container {
  margin: 1rem 0;
}

.mood-indicator, .stress-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.custom-textarea {
  --padding-start: 0;
  margin-top: 0.5rem;
}

ion-card {
  margin: 1rem 0;
  border-radius: 16px;
}

ion-card-header {
  padding-bottom: 0;
}

ion-card-content {
  padding-top: 1rem;
  background: transparent;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent !important;
}

ion-icon {
  font-size: 24px;
}

.happy-icon {
  color: var(--ion-color-primary);
}

.stress-icon {
  color: var(--ion-color-danger);
}

ion-button {
  margin-bottom: 2rem;
  height: 48px;
  font-size: 1.1em;
  --border-radius: 12px;
}

ion-list {
  background: transparent !important;
  --ion-item-background: transparent !important;
  --background: transparent !important;
}
</style> 
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Verlauf</ion-title>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon :icon="filter" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-segment v-model="viewType" class="ion-margin-bottom">
        <ion-segment-button value="list">
          <ion-icon :icon="list"></ion-icon>
          <ion-label>Liste</ion-label>
        </ion-segment-button>
        <ion-segment-button value="calendar">
          <ion-icon :icon="calendar"></ion-icon>
          <ion-label>Kalender</ion-label>
        </ion-segment-button>
      </ion-segment>

      <div v-if="viewType === 'list'">
        <ion-card v-for="entry in sortedEntries" :key="entry.date" class="entry-card">
          <ion-card-header>
            <div class="card-header-content">
              <ion-card-subtitle>{{ formatDate(entry.date) }}</ion-card-subtitle>
              <ion-button fill="clear" color="danger" size="small" @click="confirmDelete(entry.date)">
                <ion-icon :icon="trash" slot="icon-only"></ion-icon>
              </ion-button>
            </div>
            <div class="mood-stress-indicators">
              <div class="indicator">
                <ion-icon :icon="happyOutline" :color="getMoodColor(entry.mood)"></ion-icon>
                <span>{{ entry.mood }}/10</span>
              </div>
              <div class="indicator">
                <ion-icon :icon="pulseOutline" :color="getStressColor(entry.stressLevel)"></ion-icon>
                <span>{{ entry.stressLevel }}/10</span>
              </div>
            </div>
          </ion-card-header>

          <ion-card-content>
            <ion-list lines="none">
              <ion-item v-if="entry.compulsiveThoughts.present" class="thought-item">
                <ion-icon :icon="medicalOutline" slot="start" color="primary"></ion-icon>
                <ion-label>
                  <h3>Zwangsgedanken</h3>
                  <p>{{ entry.compulsiveThoughts.description }}</p>
                </ion-label>
              </ion-item>

              <ion-item v-if="entry.compulsiveActions.present" class="action-item">
                <ion-icon :icon="handLeft" slot="start" color="primary"></ion-icon>
                <ion-label>
                  <h3>Zwangshandlungen</h3>
                  <p>{{ entry.compulsiveActions.description }}</p>
                </ion-label>
              </ion-item>

              <ion-item v-if="entry.relaxationActivities" class="relaxation-item">
                <ion-icon :icon="leaf" slot="start" color="success"></ion-icon>
                <ion-label>
                  <h3>Entspannung</h3>
                  <p>{{ entry.relaxationActivities }}</p>
                </ion-label>
              </ion-item>

              <ion-item v-if="entry.difficulties" class="difficulty-item">
                <ion-icon :icon="warning" slot="start" color="warning"></ion-icon>
                <ion-label>
                  <h3>Herausforderungen</h3>
                  <p>{{ entry.difficulties }}</p>
                </ion-label>
              </ion-item>

              <ion-item v-if="entry.planForTomorrow" class="plan-item">
                <ion-icon :icon="sunny" slot="start" color="tertiary"></ion-icon>
                <ion-label>
                  <h3>Plan für morgen</h3>
                  <p>{{ entry.planForTomorrow }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <div v-if="sortedEntries.length === 0" class="ion-text-center ion-padding">
          <ion-icon :icon="documentText" size="large" color="medium"></ion-icon>
          <p>Keine Einträge vorhanden</p>
        </div>
      </div>

      <div v-else class="calendar-view">
        <vue-cal
          :time-from="7 * 60"
          :time-to="22 * 60"
          :disable-views="['years', 'year', 'week', 'day']"
          :events="calendarEvents"
          :on-event-click="onEventClick"
          class="custom-calendar"
          locale="de"
        />
      </div>
    </ion-content>

    <!-- Alert zum Löschen eines Eintrags -->
    <ion-alert
      :is-open="showDeleteAlert"
      header="Eintrag löschen"
      message="Möchtest du diesen Eintrag wirklich löschen?"
      :buttons="alertButtons"
      @didDismiss="showDeleteAlert = false"
    ></ion-alert>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardContent,
  IonList, IonItem, IonLabel, IonIcon, IonSegment,
  IonSegmentButton, IonButtons, IonButton, IonAlert
} from '@ionic/vue';
import {
  happyOutline,
  pulseOutline,
  medicalOutline,
  handLeft,
  leaf,
  warning,
  sunny,
  filter,
  list,
  calendar,
  trash,
  documentText
} from 'ionicons/icons';
import type { DailyTracking } from '@/types/tracker';
import { StorageService } from '@/services/storage.service';

const entries = ref<DailyTracking[]>([]);
const viewType = ref('list');
const showDeleteAlert = ref(false);
const entryToDelete = ref('');

const sortedEntries = computed(() => {
  return [...entries.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const calendarEvents = computed(() => {
  return entries.value.map(entry => {
    const mood = entry.mood;
    const eventColor = getMoodColor(mood);
    let colorClass = 'mood-low';
    
    if (mood >= 7) colorClass = 'mood-high';
    else if (mood >= 4) colorClass = 'mood-medium';
    
    return {
      start: `${entry.date} 12:00`,
      end: `${entry.date} 13:00`,
      title: `Stimmung: ${mood}/10 - Stress: ${entry.stressLevel}/10`,
      class: colorClass,
      content: entry,
    };
  });
});

const alertButtons = [
  {
    text: 'Abbrechen',
    role: 'cancel',
  },
  {
    text: 'Löschen',
    role: 'confirm',
    handler: () => {
      deleteEntry(entryToDelete.value);
    },
  },
];

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getMoodColor = (mood: number) => {
  if (mood >= 7) return 'success';
  if (mood >= 4) return 'warning';
  return 'danger';
};

const getStressColor = (stress: number) => {
  if (stress <= 3) return 'success';
  if (stress <= 6) return 'warning';
  return 'danger';
};

const loadEntries = async () => {
  try {
    entries.value = await StorageService.getDailyTrackingHistory();
  } catch (error) {
    console.error('Fehler beim Laden der Historie:', error);
  }
};

const confirmDelete = (date: string) => {
  entryToDelete.value = date;
  showDeleteAlert.value = true;
};

const deleteEntry = async (date: string) => {
  try {
    await StorageService.deleteDailyTrackingEntry(date);
    loadEntries(); // Liste neu laden
  } catch (error) {
    console.error('Fehler beim Löschen des Eintrags:', error);
  }
};

const onEventClick = (event: any) => {
  // Zeige Details des Events an oder navigiere zur Detailansicht
  console.log('Event clicked:', event);
};

loadEntries();
</script>

<style>
@import 'vue-cal/dist/vuecal.css';

.vue-cal {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  height: 65vh;
}

.mood-high {
  background-color: var(--ion-color-success) !important;
  color: white !important;
}

.mood-medium {
  background-color: var(--ion-color-warning) !important;
  color: black !important;
}

.mood-low {
  background-color: var(--ion-color-danger) !important;
  color: white !important;
}

.vue-cal__cell--today {
  background-color: rgba(var(--ion-color-primary-rgb), 0.15) !important;
}

.vue-cal__title {
  font-size: 1.4em !important;
  font-weight: 500 !important;
}

.vue-cal__header, .vuecal__menu {
  background-color: var(--ion-color-light) !important;
}

@media (prefers-color-scheme: dark) {
  .vue-cal__header, .vuecal__menu {
    background-color: var(--ion-color-dark) !important;
    color: var(--ion-color-light) !important;
  }
  
  .vue-cal {
    background-color: #2d2d2d;
    color: var(--ion-color-light);
  }
  
  .vue-cal__cell {
    border-color: rgba(255, 255, 255, 0.1) !important;
  }
}
</style>

<style scoped>
.entry-card {
  margin: 1rem 0;
  border-radius: 16px;
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mood-stress-indicators {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.indicator ion-icon {
  font-size: 24px;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  margin-bottom: 0.5rem;
}

ion-item h3 {
  font-size: 0.9em;
  font-weight: 600;
  margin-bottom: 4px;
}

ion-item p {
  font-size: 0.95em;
  color: var(--ion-color-medium);
  white-space: normal;
}

ion-segment {
  --background: var(--ion-color-light);
  border-radius: 8px;
  margin: 1rem 0;
}

ion-segment-button {
  --indicator-color: var(--ion-color-primary);
  --color-checked: var(--ion-color-primary);
  min-height: 44px;
}

.calendar-view {
  margin-top: 1rem;
}

ion-card-header {
  padding-bottom: 0;
}

ion-card-content {
  padding-top: 1rem;
}

ion-icon {
  font-size: 20px;
}

ion-list {
  background: transparent !important;
  --ion-item-background: transparent !important;
  --background: transparent !important;
}

.ion-item {
  --background: transparent !important;
}

ion-card-content {
  padding-top: 1rem;
  background: transparent;
}

ion-item h3 {
  font-size: 0.9em;
  font-weight: 600;
  margin-bottom: 4px;
}
</style> 
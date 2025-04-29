<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { addIcons } from 'ionicons';
import {
  happyOutline,
  pulseOutline,
  medicalOutline,
  handLeft,
  leaf,
  warning,
  sunny,
  save,
  filter,
  list,
  calendar,
  trash,
  documentText
} from 'ionicons/icons';

// Zentrale Registrierung aller Icons
addIcons({
  happyOutline,
  pulseOutline,
  medicalOutline,
  handLeft,
  leaf,
  warning,
  sunny,
  save,
  filter,
  list,
  calendar,
  trash,
  documentText
});
</script>

<style>
/* Fügen Sie hier globale Stile hinzu */
:root {
  --ion-background-color: #ffffff;
  --ion-item-background: transparent;
}

ion-content {
  --background: #f4f5f8;
}

ion-card {
  margin: 1rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  --background: transparent;
  --border-color: rgba(0, 0, 0, 0.1);
  --inner-border-width: 0;
}

ion-list {
  background: transparent !important;
  --background: transparent !important;
}

.list {
  background: transparent !important;
}

/* Material Design Liste anpassen */
.list-md {
  background: transparent !important;
  border-radius: 8px;
  padding: 0 !important;
}

/* Listenelement-Hintergrund immer transparent */
.item {
  --background: transparent !important;
}

.item-md {
  --background: transparent !important;
}

.item-ios {
  --background: transparent !important;
}

ion-button {
  --border-radius: 12px;
  font-weight: 600;
}

/* Dark mode Anpassungen */
@media (prefers-color-scheme: dark) {
  :root {
    --ion-background-color: #1e1e1e;
    --ion-text-color: #ffffff;
    --ion-border-color: #2d2d2d;
    --ion-item-background: transparent;
  }

  ion-content {
    --background: #121212;
  }

  ion-card {
    --background: #2d2d2d;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  ion-item {
    --background: transparent;
    --border-color: rgba(255, 255, 255, 0.1);
  }
}
</style>

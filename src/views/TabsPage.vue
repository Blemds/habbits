<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="daily" href="/tabs/daily">
          <ion-icon :icon="calendar"></ion-icon>
          <ion-label>Heute</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="history" href="/tabs/history">
          <ion-icon :icon="time"></ion-icon>
          <ion-label>Verlauf</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonPage, IonRouterOutlet } from '@ionic/vue';
import { calendar, time } from 'ionicons/icons';
</script> 
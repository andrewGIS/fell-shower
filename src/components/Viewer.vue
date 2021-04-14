<template>
  <v-container>
    <v-card >
      <v-tabs v-model="tab">
        <v-tab>Просмотр изменений</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :key="'Просмотр изменений'">
          <v-card flat>
            <fell-viewer></fell-viewer>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import FellViewer from './Viewer/FellViewer.vue';

export default {
  data: () => ({
    tab: null,
  }),
  components: {
    FellViewer
  }
};
</script>

<style>
</style>
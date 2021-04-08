<template>
  <v-container>
    <v-card height="40vh">
      <v-tabs v-model="tab">
        <v-tab>Просмотр изменений</v-tab>
        <v-tab>Создание карты </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :key="'Просмотр изменений'">
          <v-card flat>
            Просмотр изменений
          </v-card>
        </v-tab-item>
        <v-tab-item :key="'Создание карты'">
          <v-card flat>
            <pdf-maker></pdf-maker>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      
    </v-card>
  </v-container>
</template>

<script>
import PdfMaker from "./Viewer/PdfMaker";

export default {
  data: () => ({
    tab: null,
  }),
  components: {
    PdfMaker
  }
};
</script>

<style>
</style>
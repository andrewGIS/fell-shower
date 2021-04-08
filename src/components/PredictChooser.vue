<template>
  <v-container>
    <v-card height="40vh">
      <v-tabs v-model="tab" show-arrows>
        <v-tab>Доступные снимки</v-tab>
        <v-tab>Доступные маски облачности</v-tab>
        <v-tab>Доступные предсказания</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item :key="'Доступные снимки'">
          <v-card flat> 
            <images-lister></images-lister>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="'Доступные маски облачности'">
          <v-card flat>
            <cloud-mask-lister></cloud-mask-lister>
          </v-card>
        </v-tab-item>
        <v-tab-item :key="'Доступные предсказания'">
          <v-card flat>
            <model-predict-lister></model-predict-lister>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import ImagesLister from './Listers/ImagesLister'
import CloudMaskLister from './Listers/CloudMaskLister'
import ModelPredictLister from './Listers/ModelPredictLister'
export default {
  data: () => ({
    tab: null
  }),
  components:{
    ImagesLister,
    ModelPredictLister,
    CloudMaskLister
  }
};
</script>

<style>
</style>
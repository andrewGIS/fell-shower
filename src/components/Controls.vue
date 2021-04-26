<template>
  <v-container>
    <v-card >
      <v-tabs v-model="activeTab" show-arrows>
        <v-tab>Доступные снимки</v-tab>
        <v-tab>Доступные маски облачности</v-tab>
        <v-tab>Доступные предсказания</v-tab>
        <v-tab>Просмотр изменений</v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab">
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
        <!-- eager attribute Need for acces to map before click on this tab-->
        <v-tab-item :key="'Просмотр изменений'" eager>
          <v-card flat>
            <fell-viewer></fell-viewer>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>

import {mapMutations} from "vuex"

import ImagesLister from './Controls/ImagesLister'
import CloudMaskLister from './Controls/CloudMaskLister'
import ModelPredictLister from './Controls/ModelPredictLister'
import FellViewer from './Controls/FellViewer'
export default {
  computed:{
    activeTab:{
      get(){
        return this.$store.state.activeTabIndex;
      },
      set(value){
        this.setActiveTabIndex(value);
      }
    }
  },
  methods:{
    ...mapMutations({ setActiveTabIndex: "SET_ACTIVE_TAB_INDEX" }),
  },
  components:{
    ImagesLister,
    ModelPredictLister,
    CloudMaskLister,
    FellViewer
  }
};
</script>

<style>
</style>
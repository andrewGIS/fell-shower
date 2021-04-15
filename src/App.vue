<template>
  <v-app>
    <v-app-bar class="app-toolbar"
      app
      color="primary"
      dark
    >
    <v-toolbar-title > АВТОМАТИЗИРОВАННАЯ СИСТЕМА ОПЕРАТИВНОГО КАРТОГРАФИРОВАНИЯ НАРУШЕНИЙ ЛЕСНОГО ПОКРОВА </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-row>
        <v-col>
          <vue-map></vue-map>
        </v-col>
        <v-col cols=6>
          <controls></controls>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import VueMap from './components/Map';
import Controls from './components/Controls';

export default {
  name: 'App',

  components: {
    VueMap,
    Controls
  },

  data: () => ({
    //
  }),
};
</script>
<style>
.app-toolbar{
  font-weight: 600;
}
</style>

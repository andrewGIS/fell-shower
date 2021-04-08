<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-row>
        <v-col>
          <vue-map></vue-map>
        </v-col>
        <v-col>
          <viewer></viewer>
          <predict-chooser></predict-chooser>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import VueMap from './components/Map';
import Viewer from './components/Viewer';
import PredictChooser from './components/PredictChooser';

export default {
  name: 'App',

  components: {
    VueMap,
    Viewer,
    PredictChooser
  },

  data: () => ({
    //
  }),
};
</script>

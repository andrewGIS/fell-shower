<template>
  <v-container fluid style="height: 86vh">
    <l-map :center="[59, 59]" :zoom="6">
      <l-tile-layer :url="url"></l-tile-layer>
      <!-- <l-geo-json :geojson="data" :options="optionsGeoJSON"></l-geo-json> -->
      <l-geo-json
        v-if="selectedCoudMask"
        :geojson="selectedCoudMask"
        :options-style="cloudStyle"
      ></l-geo-json>
      <l-geo-json
        v-if="selectedPredict"
        :geojson="selectedPredict"
        :options="optionsPredictGeoJSON"
      ></l-geo-json>
    </l-map>
  </v-container>
</template>

<script>
// import L from 'leaflet'

import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import { testLayer } from "../assets/sampleGeojson";
import { mapMutations } from "vuex";
//console.log(JSON.parse(sampleJSON))
//const  hydroPosts = hydroPosts
export default {
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    data: testLayer,
    processing: false
  }),
  computed: {
    cloudStyle() {
      return () => {
        return {
          weight: 2,
          color: "#F1F50F",
          opacity: 1
        };
      };
    },
    optionsPredictGeoJSON() {
      return {
        onEachFeature: this.onEachFeature
      };
    },
    onEachFeature() {
      return (feature, layer) => {
        layer.on({
          click: e => {
            e.target.feature.geometry.coordinates;
            this.SET_SELECTED_GEOM(e.target.feature.geometry);
            //console.log(wkt.stringify(e.target.feature.geometry));
          }
        });
      };
    },
    selectedCoudMask() {
      return this.$store.state.cloudMaskGeoJSON;
    },
    selectedPredict() {
      return this.$store.state.predictedGeoJSON;
    }
  },
  methods: {
    ...mapMutations(["SET_SELECTED_GEOM"])
  },
  components: { LMap, LTileLayer, LGeoJson }
};
</script>

<style>
</style>
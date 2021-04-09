<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card height="200px">
        <l-map v-if="selectedGeom !== null" :options="options" :bounds="bounds">
          <l-polygon :lat-lngs="selectedTransformed"></l-polygon>
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
        </l-map>
        </v-card>
      </v-col>
      <v-col> </v-col>
      <v-col> </v-col>
    </v-row>
    <v-row>
      <v-checkbox
        v-for="channel in channels"
        v-model="selectedChannel"
        :key="channel"
        :value="channel"
        :label="channel"
        >{{ channel }}</v-checkbox
      >
    </v-row>
  </v-container>
</template>

<script>
import L from 'leaflet';
import { LMap, LTileLayer, LPolygon } from "vue2-leaflet";
export default {
  data: () => ({
    options:{
        zoomControl:false
    },
    selectedChannel: null,
    channels: ["B04", "B08", "B11", "B12", "TCI"]
  }),
  computed: {
    selectedGeom() {
      return this.$store.state.selectedGeom;
    },
    selectedPredictID() {
      return this.$store.state.predictID.replace('.geojson', '');
    },
    oldImgID() {
      let idx = this.selectedPredictID.search("_S2")
      return this.selectedPredictID.slice(0, idx);
    },
    newImgID() {
      let idx = this.selectedPredictID.search("_S2")
      // + 1 for sckip _ string. It is for contacenate of two images
      return this.selectedPredictID.slice(idx+1);
    },
    selectedTransformed() {
        // Strange behavior of leaflet for display polygon x y need to flipped. But init polygon
        // from native leaflet event
        if (this.selectedGeom !== null){
            return this.selectedGeom.coordinates[0].map(coordinate => [coordinate[1],coordinate[0]])
        } else {
            return [[0,0],[0,0],[0,0],[0,0]]
        }
    },
    bounds(){
        if (this.selectedGeom !== null){
            let ymax = Math.max(...this.selectedGeom.coordinates[0].map(coordinate => coordinate[0]))
            let ymin = Math.min(...this.selectedGeom.coordinates[0].map(coordinate => coordinate[0]))
            let xmax = Math.max(...this.selectedGeom.coordinates[0].map(coordinate => coordinate[1]))
            let xmin = Math.min(...this.selectedGeom.coordinates[0].map(coordinate => coordinate[1]))
            return L.latLngBounds([[xmin, ymin], [xmax, ymax]])
        } else {
            return [[0,0],[0,0]]
        }
    }
  },
  components: {
    LMap,
    LPolygon,
    LTileLayer
  }
};
</script>

<style>
</style>
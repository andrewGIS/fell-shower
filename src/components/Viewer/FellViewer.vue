<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card height="200px">
        <l-map :options="options" :bounds="bounds">
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
    selectedTransformed() {
        // Strange behavior of leaflet for display polygon x y need to flipped. But init polygon
        // from native leaflet event
        if (this.selectedGeom){
            return this.selectedGeom.coordinates[0].map(coordinate => [coordinate[1],coordinate[0]])
        } else {
            return null
        }
    },
    bounds(){
        if (this.selectedGeom.coordinates){
            let ymax = Math.max(...this.selectedGeom.coordinates[0].map(coordinate => coordinate[0]))
            let ymin = Math.min(...this.selectedGeom.coordinates[0].map(coordinate => coordinate[0]))
            let xmax = Math.max(...this.selectedGeom.coordinates[0].map(coordinate => coordinate[1]))
            let xmin = Math.min(...this.selectedGeom.coordinates[0].map(coordinate => coordinate[1]))
            //return L.latLngBounds([[50, 40], [60, 50]])[xmax, xmin, ymax, ymin]
            return L.latLngBounds([[xmin, ymin], [xmax, ymax]])
        } else {
            return [0,0,0,0]
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
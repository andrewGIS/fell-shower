<template>
  <v-container fluid style="height: 86vh">
    <l-map :center="[59, 59]" :zoom="6">
      <l-tile-layer :url="url"></l-tile-layer>
      <l-geo-json :geojson="data" :options="optionsGeoJSON"></l-geo-json>
    </l-map>
  </v-container>
</template>

<script>
// import L from 'leaflet'
import { LMap, LTileLayer, LGeoJson } from "vue2-leaflet";
import { testLayer } from "../assets/sampleGeojson";
//console.log(JSON.parse(sampleJSON))
//const  hydroPosts = hydroPosts
export default {
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    data: testLayer
  }),
  computed: {
    optionsGeoJSON() {
      return {
        pointToLayer: this.pointToLayer,
        onEachFeature: this.onEachFeature
      };
    },
    onEachFeature() {
      return (feature, layer) => {
        layer.on({
          click: e => {
            console.log(e.target.feature.geometry);
            // layer.openPopup("Hi!");
            // e.layer.setStyle({
            //   weight: 5
            // })
          }
        });
      };
    }
  },
  components: { LMap, LTileLayer, LGeoJson }
};
</script>

<style>
</style>
<template>
  <v-container fluid style="height: 86vh">
    <l-map ref="map" :center="[59, 59]" :zoom="6">
      <l-tile-layer :url="url"></l-tile-layer>
      <!-- <l-geo-json :geojson="data" :options="optionsGeoJSON"></l-geo-json> -->
      <l-geo-json
        ref="cloudLayer"
        v-if="selectedCoudMask"
        :geojson="selectedCoudMask"
        :options-style="cloudStyle"
      ></l-geo-json>
      <l-geo-json
        ref="predictLayer"
        v-if="selectedPredict"
        :geojson="selectedPredict"
        :options="optionsPredictGeoJSON"
      ></l-geo-json>
      <l-polygon
        v-if="selectedGeom"
        :lat-lngs="selectedTransformed"
        :color="'yellow'"
      ></l-polygon>
    </l-map>
  </v-container>
</template>

<script>
import L from "leaflet";

import { LMap, LTileLayer, LGeoJson, LPolygon } from "vue2-leaflet";
import { testLayer } from "../assets/sampleGeojson";
import { mapMutations } from "vuex";
//console.log(JSON.parse(sampleJSON))
//const  hydroPosts = hydroPosts
export default {
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    data: testLayer,
    processing: false,
    map: null,
    test: true
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
            this.SET_SELECTED_GEOM(e.target.feature.geometry);
            //e.stopImmediatePropagation()
            L.DomEvent.stopPropagation(e);
            //console.log(wkt.stringify(e.target.feature.geometry));
          }
        });
      };
    },
    selectedTransformed() {
      // Strange behavior of leaflet for display polygon x y need to flipped. But init polygon
      // from native leaflet event
      if (this.selectedGeom !== null) {
        return this.selectedGeom.coordinates[0].map(coordinate => [
          coordinate[1],
          coordinate[0]
        ]);
      }
      return [
        [0, 0],
        [0, 0]
      ];
    },
    selectedGeom() {
      return this.$store.state.selectedGeom;
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
  components: { LMap, LTileLayer, LGeoJson, LPolygon },
  mounted() {
    this.$nextTick(() => {
      this.map = this.$refs.map.mapObject; // work as expected
      this.map.on("click", e => {
        // TODO when clicked again on selected feature resets clicked
        // if on clicked point no features from predict layer
        // clear selceted feature highlight
        if (e.target instanceof L.Map && this.selectedPredict) {
          this.SET_SELECTED_GEOM(null);
        }
      });
    });
  },
  watch:{
    selectedCoudMask (val){
      if (!val) return;
      this.$nextTick(() => {
        this.map.fitBounds(this.$refs.cloudLayer.mapObject.getBounds())
      })
      
    },
    selectedPredict (val){
      if (!val) return;
      this.$nextTick(() => {
        this.map.fitBounds(this.$refs.predictLayer.mapObject.getBounds())
      })
    }
  }
};
</script>

<style>
</style>
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card height="200px">
          <l-map
            v-if="selectedGeom !== null"
            :options="options"
            :bounds="bounds"
          >
            <l-polygon :lat-lngs="selectedTransformed"></l-polygon>
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            ></l-tile-layer>
          </l-map>
        </v-card>
      </v-col>
      <v-col>
        <v-card height="200px">
          <v-img :src="src"></v-img>
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
    <v-row>
      <pdf-maker></pdf-maker>
    </v-row>
  </v-container>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LPolygon } from "vue2-leaflet";
import PdfMaker from "./PdfMaker.vue";
export default {
  data: () => ({
    options: {
      zoomControl: false
    },
    selectedChannel: null,
    channels: ["B04", "B08", "B11", "B12", "TCI"],
    src:
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  }),
  computed: {
    selectedGeom() {
      return this.$store.state.selectedGeom;
    },
    selectedPredictID() {
      return this.$store.state.predictID.replace(".geojson", "");
    },
    oldImgID() {
      let idx = this.selectedPredictID.search("_S2");
      return this.selectedPredictID.slice(0, idx);
    },
    newImgID() {
      let idx = this.selectedPredictID.search("_S2");
      // + 1 for sckip _ string. It is for contacenate of two images
      return this.selectedPredictID.slice(idx + 1);
    },
    selectedTransformed() {
      // Strange behavior of leaflet for display polygon x y need to flipped. But init polygon
      // from native leaflet event
      if (this.selectedGeom !== null) {
        return this.selectedGeom.coordinates[0].map(coordinate => [
          coordinate[1],
          coordinate[0]
        ]);
      } else {
        return [
          [0, 0],
          [0, 0],
          [0, 0],
          [0, 0]
        ];
      }
    },
    bounds() {
      if (this.selectedGeom !== null) {
        let ymax = Math.max(
          ...this.selectedGeom.coordinates[0].map(coordinate => coordinate[0])
        );
        let ymin = Math.min(
          ...this.selectedGeom.coordinates[0].map(coordinate => coordinate[0])
        );
        let xmax = Math.max(
          ...this.selectedGeom.coordinates[0].map(coordinate => coordinate[1])
        );
        let xmin = Math.min(
          ...this.selectedGeom.coordinates[0].map(coordinate => coordinate[1])
        );
        return L.latLngBounds([
          [xmin, ymin],
          [xmax, ymax]
        ]);
      } else {
        return [
          [0, 0],
          [0, 0]
        ];
      }
    }
  },
  watch: {
    bounds: function(val) {
      // Stream reading will stole from official WEB api docs
      fetch(
        `http://localhost:5000/get_image_part?imgFld=S2B_MSIL1C_20190203T074129_N0207_R092_T40VEL_20190203T093456.SAFE&channel=TCI&xmin=${val._southWest.lng}&xmax=${val._northEast.lng}&ymin=${val._southWest.lat}&ymax=${val._northEast.lat}`
      )
        .then(response => response.body)
        .then(rb => {
          const reader = rb.getReader();

          return new ReadableStream({
            start(controller) {
              // The following function handles each data chunk
              function push() {
                // "done" is a Boolean and value a "Uint8Array"
                reader.read().then(({ done, value }) => {
                  // If there is no more data to read
                  if (done) {
                    console.log("done", done);
                    controller.close();
                    return;
                  }
                  // Get the data and send it to the browser via the controller
                  controller.enqueue(value);
                  // Check chunks by logging to the console
                  //console.log(done, value);
                  push();
                });
              }

              push();
            }
          });
        })
        .then(stream => {
          // Respond with our stream
          return new Response(stream, {
            headers: { "Content-Type": "image/bmp" }
          }).blob();
        })
        .then(result => {
          // Do things with result
          //console.log(result);
          this.src = URL.createObjectURL(result);
        });
    }
  },
  components: {
    LMap,
    LPolygon,
    LTileLayer,
    PdfMaker
  }
};
</script>

<style>
</style>
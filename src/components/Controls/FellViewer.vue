<template>
  <v-container>
    <v-alert
      v-if="selectedGeom === null"
      border="right"
      colored-border
      type="error"
      elevation="2"
    >
      {{
        "Выберите один из слоев с предсказанием модели и выберите объект в нем"
      }}
    </v-alert>
    <v-row v-if="selectedGeom !== null">
      <v-col cols="6">
        <v-card height="200px">
          <l-map :options="options" :bounds.sync="mapBounds">
            <l-polygon :lat-lngs="selectedTransformed"></l-polygon>
            <l-image-overlay :url="srcOld" :bounds="overlaybounds"></l-image-overlay>
          </l-map>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="200px">
          <l-map :options="options" :bounds.sync="mapBounds">
            <l-polygon :lat-lngs="selectedTransformed"></l-polygon>
            <l-image-overlay :url="srcNew" :bounds="overlaybounds"></l-image-overlay> 
          </l-map>
        </v-card>
      </v-col>
      <v-col> </v-col>
      <v-col> </v-col>
    </v-row>
    <v-row align="center">
      Подложка
      <v-checkbox
        v-for="channel in channels"
        v-model="selectedChannel"
        :key="channel"
        :value="channel"
        :label="channel"
        >{{ channel }}</v-checkbox
      >
    </v-row>
    <v-row v-if="selectedGeom !== null">
      <pdf-maker></pdf-maker>
    </v-row>
          <v-alert style="margin-top:16px;" border="right" colored-border type="info" elevation="2">
        На данной странице можно посмотреть результат работы модели по отдельному объекту. В качестве подложки можно использовать каналы спутника Sentinel - 2. (Выбраны наиболее информативные каналы для дешифрирования лесной растительности). Для выбранного полигона можно построить карту.
      </v-alert>
  </v-container>
</template>

<script>
// TODO map sync destroyed when you navigate throw small map
import L from "leaflet";
import { LMap, LPolygon, LImageOverlay } from "vue2-leaflet";
import PdfMaker from "./PdfMaker.vue";
export default {
  data: () => ({
    options: {
      zoomControl: false,
      dragging: false
    },
    selectedChannel: "TCI",
    channels: ["B04", "B08", "B11", "B12", "TCI"],
    srcOld:
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    srcNew:
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    mapBounds: null,
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
      }
      return null;
    },
    overlaybounds() {
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
      }
      return null;
    }
  },
  methods: {
    getImagePart(leaflet_bounds, fldName, channel) {
      // Stream reading was stolen from official WEB api docs
      return fetch(
        `http://localhost:5000/get_image_part` +
          `?imgFld=${fldName}` +
          `&channel=${channel}` +
          `&xmin=${leaflet_bounds._southWest.lng}` +
          `&xmax=${leaflet_bounds._northEast.lng}` +
          `&ymin=${leaflet_bounds._southWest.lat}` +
          `&ymax=${leaflet_bounds._northEast.lat}`
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
                    // console.log("done", done);
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
          return URL.createObjectURL(result);
        });
    },
    async updateGeom() {

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

        let bounds = L.latLngBounds([
          [xmin, ymin],
          [xmax, ymax]
        ]);

        this.mapBounds = bounds;
        this.srcOld = await this.getImagePart(
          bounds,
          this.oldImgID,
          this.selectedChannel
        );
        this.srcNew = await this.getImagePart(
          bounds,
          this.newImgID,
          this.selectedChannel
        );
      }
  },
  watch: {
    async selectedChannel(val) {
      this.srcOld = await this.getImagePart(
        this.overlaybounds,
        this.oldImgID,
        val
      );
      this.srcNew = await this.getImagePart(
        this.overlaybounds,
        this.newImgID,
        val
      );
    },
    selectedGeom(val){
      if (val === null) return;
      this.updateGeom(val);
    }
  },
  components: {
    LMap,
    LPolygon,
    LImageOverlay,
    PdfMaker
  }
};
</script>

<style>
</style>
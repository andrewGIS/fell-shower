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
    <v-row v-show="selectedGeom !== null">
      <v-col cols="6">
        <v-card height="400px">
          <l-map 
            ref="mapFirst"
            :options="optionsMap1"
            @update:bounds="boundsUpdated"
          >
            <l-polygon
              v-if="selectedGeom !== null"
              :lat-lngs="selectedTransformed"
            ></l-polygon>
            <l-image-overlay
              ref="imgoverlayFirst"
              v-if="mapBounds !== null && selectedGeom !== null && srcOld !== null"
              :url="srcOld"
              :bounds="mapBounds"
            ></l-image-overlay>
          </l-map>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card height="400px">
          <l-map ref="mapSecond" :options="optionsMap2" :bounds="mapBounds">
            <l-polygon
              v-if="selectedGeom !== null"
              :lat-lngs="selectedTransformed"
            ></l-polygon>
            <l-image-overlay
              ref="imgoverlaySecond"
              v-if="mapBounds !== null && selectedGeom !== null && srcNew !== null"
              :url="srcNew"
              :bounds="mapBounds"
            ></l-image-overlay>
          </l-map>
        </v-card>
      </v-col>
      <v-col> </v-col>
      <v-col> </v-col>
    </v-row>
    <v-row>
      <v-container>
        <v-row justify="space-around"> Канал Sentinel - 2 для подложки: </v-row>
        <v-row justify="space-around">
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
    </v-row>
    <v-row >
      <pdf-maker></pdf-maker>
    </v-row>
    <v-alert
      style="margin-top: 16px"
      border="right"
      colored-border
      type="info"
      elevation="2"
    >
      На данной странице можно посмотреть результат работы модели по отдельному
      объекту. В качестве подложки можно использовать каналы спутника Sentinel -
      2. (Выбраны наиболее информативные каналы для дешифрирования лесной
      растительности). Для выбранного полигона можно построить карту.
    </v-alert>
  </v-container>
</template>

<script>
import { latLngBounds} from 'leaflet';
import { LMap, LPolygon, LImageOverlay} from "vue2-leaflet";
import PdfMaker from "./PdfMaker.vue";
import { mapMutations } from "vuex";
export default {
  data: () => ({
    optionsMap1: {
      minZoom: 12
    },
   optionsMap2: {
      zoomControl: false,
      dragging: false
    },
    channels: ["B04", "B08", "B11", "B12", "TCI"],
    srcOld: null,
    srcNew: null,
    mapBounds:null,
    loading: false,
    map1: null,
    map2: null
  }),
  computed: {
    selectedGeom() {
      return this.$store.state.selectedGeom;
    },
    selectedPredictID() {
      if (!this.selectedGeom) return null;
      return this.$store.state.predictID.replace(".geojson", "");
    },
    oldImgID() {
      if (!this.selectedGeom) return null;
      let idx = this.selectedPredictID.search("_S2");
      return this.selectedPredictID.slice(0, idx);
    },
    newImgID() {
      if (!this.selectedGeom) return null;
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
    selectedChannel: {
      get() {
        return this.$store.state.selectedChannel;
      },
      set(value) {
        this.setSelectedChannel(value);
      }
    }
  },
  methods: {
    ...mapMutations({ setSelectedChannel: "SET_SELECTED_CHANNEL" }),
    getImagePart(leaflet_bounds, fldName, channel) {
      // Stream reading was stolen from official WEB api docs
      return fetch(
        `${process.env.VUE_APP_API_BASE}/get_image_part` +
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
        })
        .catch(() => {
          return;
        });
    },
    async boundsUpdated() {

      //bounds bounds that are use in this function get the wrong result
      // for correct display need this construction
      this.map1.invalidateSize();
      let bounds = this.map1.getBounds();
      this.$nextTick(() => this.$refs.mapSecond.mapObject.invalidateSize());
      //await this.$nextTick();
      // end of construction

      this.loading = true;
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
      this.loading = false;

      this.mapBounds = bounds;
    }
  },
  watch: {
    async selectedChannel(val) {
      if (val === null) return;
      this.srcOld = await this.getImagePart(this.mapBounds, this.oldImgID, val);
      this.srcNew = await this.getImagePart(this.mapBounds, this.newImgID, val);
    },
    async selectedGeom(val) {
      if (val === null) {
        return ;
      }

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

      // x широта
      // y долгота

      let bounds;
      bounds = latLngBounds(
        {lat:xmin, lng:ymin}, 
        {lat:xmax, lng:ymax}
        );
      this.map1.fitBounds(bounds);

      this.loading = true;
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
      this.loading = false;

    }
  },
  mounted() {
    this.$nextTick(() => {
      this.map1 = this.$refs.mapFirst.mapObject;
      this.map2 = this.$refs.mapSecond.mapObject;
    });
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
<template>
  <v-container fluid >
        <v-row>
          <v-col cols=8>
            <v-btn small
              :disabled="selectedGeom === null"
              color="primary"
              @click="createMap()"
            >
              Создать карту c выбранным объектом
            </v-btn>
          </v-col>
          <!-- <div>{{ this.selectedGeom.type }}</div> -->
          <v-col cols=4>
            <v-btn small v-show="link" :href="link" target="_blank">Загрузить результат</v-btn>
          </v-col>
        </v-row>
        <v-overlay :value="processing" :z-index=100000>
          <v-progress-circular
            indeterminate
            color="blue"
          ></v-progress-circular>
        </v-overlay>
  </v-container>
</template>

<script>
import * as wkt from "wkt";

export default {
  data: () => ({
    link: null,
    processing: false
  }),
  computed: {
    selectedGeom() {
      return this.$store.state.selectedGeom;
    },
    selectedPredictID() {
      if (!this.selectedGeom) return null;
      return this.$store.state.predictID.replace(".geojson", "");
    },
    newImgID() {
      if (!this.selectedGeom) return null;
      let idx = this.selectedPredictID.search("_S2");
      // + 1 for sckip _ string. It is for contacenate of two images
      return this.selectedPredictID.slice(idx + 1);
    },
    selectedChannel(){
      return this.$store.state.selectedChannel
    }
  },
  methods: {
    createMap() {
      // folder on server '/net/ogs_home/andrew/webApp/data' constant
      // run script with this ImgFolder param
      let baseURL = `http://maps.psu.ru:8080/arcgis/rest/services/andrew/FellPrinter/GPServer/MapPrinter/submitJob?in_polygon=${wkt.stringify(this.selectedGeom)}&in_fld=${this.newImgID}&in_channel=${this.selectedChannel}&img_fld=/net/ogs_home/andrew/webApp/data`;
      //console.log(baseURL);
      //return;
      fetch(baseURL)
        .then(response => response)
        .then(data => {
          console.log(data.url + "?f=pjson");
          this.startJob(data.url);
        })
        .catch(error => {
          console.log(error);
        });
    },
    startJob(url) {
      fetch(url + "?f=pjson")
        .then(stresponse => stresponse.json())
        .then(statusdata => {
          console.log(statusdata.jobStatus);
          if (statusdata.jobStatus !== "esriJobSucceeded") {
            this.startJob(url);
            this.processing = true;
          } else if (statusdata.jobStatus === "esriJobFailed"){
            this.processing = false;
            return;
          } else {
            this.getpdfUrl(url);
            this.processing = false;
          }
        });
    },
    getpdfUrl(url) {
      fetch(url + "/results/out_fc?f=pjson")
        .then(urlresponse => urlresponse.json())
        .then(urlpdfdata => {
          this.link = urlpdfdata.value.url;
        });
    }
  },
  watch: {
    selectedGeom: function() {
      this.link = null;
    }
  }
};
</script>

<style>
</style>
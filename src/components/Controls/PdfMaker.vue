<template>
  <v-container fluid >
        <v-row>
          <v-col cols=8>
            <v-btn small
              :disabled="selectedGeom.type === 'Null'"
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
    }
  },
  methods: {
    createMap() {
      let baseURL = `http://maps.psu.ru:8080/arcgis/rest/services/_Test/MapPrinter/GPServer/MapPrinter/submitJob?`;
      baseURL += `in_fc=test`;
      baseURL += `&in_polygon=${wkt.stringify(this.selectedGeom)}`;
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
      this.link = "";
    }
  }
};
</script>

<style>
</style>
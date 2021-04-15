<template>
  <v-container>
    <v-card flat height="100%">
      <v-checkbox
        v-for="img in images"
        :key="img"
        :label="beautifyName(img)"
        v-model="selectedImages"
        :value="img"
      >
      </v-checkbox>
      <v-alert
        v-if="error"
        border="right"
        colored-border
        type="error"
        elevation="2"
      >
        {{ this.error }}
      </v-alert>
      <v-card-actions>
        <v-container>
          <v-row>
            <v-btn
              :disabled="error !== null"
              color="deep-purple lighten-2"
              text
              @click="startPredict"
            >
              Запустить расчет для выбранных снимков
            </v-btn>
          </v-row>
          <v-row>
            <v-btn
              :disabled="selectedImages.length !== 1"
              color="deep-purple lighten-2"
              text
              @click="startMakeCloudMask"
            >
              Рассчитать маску облачности для выбрано снимка
            </v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>

// import * as io from 'socket.io-client'
import {mapActions} from 'vuex';

export default {
  data: () => ({
    images: [],
    selectedImages: []
  }),
  methods: {
    ...mapActions({
      runPredict:'RUN_PREDICT',
      runMakeCloudMask: 'RUN_MAKE_CLOUD_MASK'
    }),
    getImageList() {
      fetch(`${process.env.VUE_APP_API_BASE}/images`)
        .then(resp => resp.json())
        .then(data => (this.images = data.images))
        .catch(error => console.log(error));
    },
    startPredict() {
      console.log("run predict");
      let firstDate = this.getDateFromImgID(this.selectedImages[0])
      let secondDate = this.getDateFromImgID(this.selectedImages[1])

      let payload = {}
      if (secondDate > firstDate){
        payload.oldImg = this.selectedImages[0]
        payload.newImg = this.selectedImages[1]
      } else {
        payload.oldImg = this.selectedImages[1]
        payload.newImg = this.selectedImages[0]
      }

      this.runPredict(payload);
    },
    startMakeCloudMask() {
      //console.log("run cloud mask");
      this.runMakeCloudMask(this.selectedImages[0])
    },
    getDateFromImgID(imgID){
      /**
      Return date from img id
      img id S2B_MSIL1C_20190120T080239_N0207_R035_T39VXH_20190120T090436.SAFE
      */
     let date = imgID.split("_")[2]
     let year = date.slice(0,4)
     let month = date.slice(4,6)
     let day = date.slice(6,8)
     return new Date(year, month, day)
    },
    beautifyName(name){
        /**
         * Transfrom name of geojson ("S2A_MSIL1C_20180901T073611_N0206_R092_T40VEL_
         * 20180901T091932.SAFE_S2B_MSIL1C_20190203T074129_N0207_R092_T40VEL_20190203T093456.SAFE.geojson")
         * to date before date after
         */
        let splitted = name.split("_")
        return `${splitted[5]}_${splitted[2]}`
    }
  },
  computed: {
    selectedTiles() {
      return this.selectedImages.map(img => img.split("_")[5]);
    },
    error() {
      if (this.selectedImages.length != 2) {
        return "Для запуска расчета выберите два снимка";
      }
      if (this.selectedTiles[0] != this.selectedTiles[1]) {
        return "Для запуска расчета выберите снимки с одним идентификатором тайла (например T40VEL)";
      }
      return null;
    },
    tileIDS(){
      return Array.from(new Set(this.images.map(img => img.split("_")[5])));
    }
  },
  mounted() {
    this.images = this.getImageList();
  }
};
</script>

<style>
</style>
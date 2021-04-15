<template>
  <v-container>
    <v-card :loading="loadingCard" flat>
      <v-checkbox
        :disabled="loadingCard"
        v-for="mask in masks"
        :key="mask"
        :label="beautifyName(mask)"
        v-model="selectedMask"
        :value="mask"
      >
      </v-checkbox>
      <v-alert border="right" colored-border type="info" elevation="2">
        На данной странице представлены маски облачности, уже созданные по
        доступным снимкам. Для просмотра маски выберите необходимый слой для
        просмотра. Они используются для фильтрации данных, полученных от модели
      </v-alert>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    masks: [],
    selectedMask: null,
    loadingCard: false
  }),
  methods: {
    ...mapActions({
      updateCloudMask: "LOAD_CLOUD_MASK"
    }),
    getPredictList() {
      fetch(`${process.env.VUE_APP_API_BASE}/cloudmasks`)
        .then(resp => resp.json())
        .then(data => (this.masks = data.masks))
        .catch(error => console.log(error));
    },
    beautifyName(name) {
      /**
       * Transfrom name of geojson ("S2A_MSIL1C_20180901T073611_N0206_R092_T40VEL_
       * 20180901T091932.SAFE_S2B_MSIL1C_20190203T074129_N0207_R092_T40VEL_20190203T093456.SAFE.geojson")
       * to date before date after
       */
      let splitted = name.split("_");
      return `${splitted[5]}_${splitted[2]}`;
    }
  },
  mounted() {
    this.predicts = this.getPredictList();
  },
  watch: {
    selectedMask: async function(cloudMaskID) {
      this.loadingCard = true;
      await this.updateCloudMask(cloudMaskID);
      this.loadingCard = false;
    }
  }
};
</script>
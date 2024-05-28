<template>
  <div class="container">
    <ViolinPlot></ViolinPlot>
    <LineChart></LineChart>
    <Quality_score_heatmap></Quality_score_heatmap>
    <Quality_score_heatmap2></Quality_score_heatmap2>
  </div>
</template>

<script>
import axios from 'axios'
import LineChart from '../../components/origin/original_LineChart.vue'
import ViolinPlot from '../../components/origin/original_ViolinPlot.vue'
import Quality_score_heatmap from "../../components/origin/original_quality_score_heatmap.vue"
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'analysis',
  components: {
    Quality_score_heatmap,
    LineChart,
    ViolinPlot,
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: start;
}
.ViolinPlot .LineChart .Quality_score_heatmap {
  flex: 1;
}
</style>

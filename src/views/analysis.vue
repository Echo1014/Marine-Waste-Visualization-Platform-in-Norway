<template>
  <div class="container">
    <ViolinPlot></ViolinPlot>
    <LineChart></LineChart>
    <Quality_score_heatmap></Quality_score_heatmap>
  </div>
</template>

<script>
import axios from 'axios'
import LineChart from '@/components/LineChart.vue'
import ViolinPlot from '@/components/ViolinPlot.vue'
import Quality_score_heatmap from '@/components/quality_score_heatmap.vue'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'analysis',
  components: {
    Quality_score_heatmap,
    LineChart,
    ViolinPlot
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

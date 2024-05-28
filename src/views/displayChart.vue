<template>
  <div class="container">
    <stacked-bar-chart></stacked-bar-chart>
    <timeline-chart></timeline-chart>
    <TimeMaxCountyData></TimeMaxCountyData>
<!--    <leidatu></leidatu>-->
<!--    <Bar></Bar>-->
  </div>
</template>

<script>
import StackedBarChart from '../components/stackedBarChart.vue'
import TimelineChart from '../components/timelineChart.vue'
import TimeMaxCountyData from '../components/TimeMaxCountydata.vue'
import Leidatu from '../components/leidatu.vue'
import Bar from '../components/bar.vue'
export default {
  name: 'displayChart',
  components: { TimeMaxCountyData, TimelineChart, StackedBarChart ,Leidatu,Bar}
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: start;
}
</style>

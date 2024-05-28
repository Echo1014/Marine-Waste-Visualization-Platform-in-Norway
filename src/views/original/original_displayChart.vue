<template>
  <div class="container">
    <stacked-bar-chart></stacked-bar-chart>
    <timeline-chart></timeline-chart>
    <TimeMaxCountyData></TimeMaxCountyData>
  </div>
</template>

<script>
import StackedBarChart from '../../components/origin/stackedBarChart.vue'
import TimelineChart from '../../components/origin/original_timelineChart.vue'
import TimeMaxCountyData from '../../components/origin/original_TimeMaxCountydata.vue'
export default {
  name: 'displayChart',
  components: { TimeMaxCountyData, TimelineChart, StackedBarChart }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: start;
}
</style>

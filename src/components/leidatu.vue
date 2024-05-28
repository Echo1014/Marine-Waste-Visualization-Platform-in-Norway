<template>
  <div ref="leida" style="width: 500px; height: 500px"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "leda",
  data() {
    return {
      data: [
        { name: 'Friendliness',  max: 5 },
        { name: 'Speed',  max:5 },
        { name: 'Functionality', max: 5},
        { name: 'Accuracy',  max:5},
        { name: 'Accessibility',  max: 5 },
        { name: 'Satisfaction',  max:5 }
      ]
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw() {
      let leida = this.$refs.leida;
      let myChart = echarts.init(leida)
      const data = this.data;
      const indicator =data
      const option = {
        title: {
          // text: 'Likert scales',
        },
        legend: {
          data:["Likert scales 1-5"]
        },
        tooltip: {},
        radar: {
          indicator: indicator,
          name: {
            textStyle: {
              color: 'black'
            }
          },
        },
        series: [{
          type: 'radar',
          data: [{value: [3, 2, 2, 3, 3, 3], name: 'Likert scales 1-5'}],
          label: {
            show: true,
          }
        }]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>

</style>
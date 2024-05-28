<template>
  <div
    ref="lineChart"
    style="
      width: 1200px;
      height: 500px;
      margin-top: 10px;
      margin-bottom: 20px;
      padding-top: 20px;
      border-bottom-style: dotted;
      border-top-style: dotted;
      justify-content: left;
    "
  ></div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'lineChart',
  data() {
    return {
      activities: [],
      missActivities: []
    }
  },
  mounted() {
    this.setLinetData()
  },
  methods: {
    async setLinetData() {
      try {
        const activitiesResponse = await axios.get('http://47.108.61.203:8081/originalActivities/')
        const missActivitiesResponse = await axios.get('http://47.108.61.203:8081/originalMissActivities/')
        this.activities = activitiesResponse.data
        this.missActivities = missActivitiesResponse.data
        this.drawLineChart()
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    },
    drawLineChart() {
      const chart = echarts.init(this.$refs.lineChart)

      const option = {
        title: {
          text: 'Activities and Missed Activities Over Time',
          left: 'center', // 标题居中
          top: '0' // 标题位于顶部
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Activities', 'Missed Activities'],
          top: '30', // 图例位于距顶部30px的位置，确保在标题下方
          left: 'center' // 图例居中
        },
        grid: {
          left: '8%'
          // right: '10%'
        },
        xAxis: {
          type: 'category',
          data: this.activities.map((a) => `${a.year}-${'0' + a.month}`),
          axisLabel: {
            interval: 0, // 显示所有标签
            rotate: 90, // 竖直显示
            margin: 8 // 增加与轴线的间距
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Activities',
            type: 'line',
            data: this.activities.map((a) => a.count)
          },
          {
            name: 'Missed Activities',
            type: 'line',
            data: this.missActivities.map((m) => m.count)
          }
        ]
      }
      chart.setOption(option)
    }
  }
}
</script>

<style scoped></style>

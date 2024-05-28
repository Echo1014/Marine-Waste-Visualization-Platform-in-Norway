<template>
  <div ref="violinPlot" style="width: 1200px; height: 600px; justify-content: left"></div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
import Plotly from 'plotly.js-dist-min'
export default {
  name: 'ViolinPlot',
  data() {
    return {
      ActivityData: null
    }
  },
  mounted() {
    this.setChartData()
  },
  methods: {
    setChartData() {
      axios
        .get('http://47.108.61.203:8081/originalActivities/')
        .then((response) => {
          this.ActivityData = response.data
          console.log('display chartData=', this.ActivityData)
          this.drawViolinPlot(response.data)
        })
        .catch((error) => {
          console.error('Error fetching the data: ', error)
        })
    },
    drawViolinPlot(activities) {
      // const chart = echarts.init(this.$refs.violinPlot);
      let plotData = this.prepareDataForPlotly(activities)
      let layout = {
        title: 'Activity Intensity Level by Month',
        xaxis: {
          title: 'Month',
          tickvals: [...Array(12).keys()].map((x) => x + 1),
          ticktext: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
        },
        yaxis: {
          title: 'Activities Count'
        }
      }
      Plotly.newPlot(this.$refs.violinPlot, plotData, layout)
    },
    prepareDataForPlotly(data) {
      let plotData = []

      // 将数据按月份分组，每个月份的数据作为一个小提琴图的y值数组
      let groupedData = {}
      data.forEach((activity) => {
        if (!groupedData[activity.month]) {
          groupedData[activity.month] = []
        }
        groupedData[activity.month].push(activity.count)
      })

      Object.keys(groupedData).forEach((month) => {
        plotData.push({
          type: 'violin',
          name: month,
          y: groupedData[month],
          box: {
            visible: true
          },
          meanline: {
            visible: true
          }
        })
      })

      return plotData
    }
  }
}
</script>

<style scoped></style>

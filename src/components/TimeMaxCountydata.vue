<template>
  <span style="text-align: center; font-size: larger; font-weight: bold; margin-bottom: 10px"
    >Total amount of garbage classification in recent years</span
  >
  <div ref="stackedBarChart" style="width: 1200px; height: 600px"></div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'TimeMaxCountyData',
  data() {
    return {}
  },
  mounted() {
    this.settStackedBarData()
  },
  methods: {
    settStackedBarData() {
      axios
        .get('http://47.108.61.203:8081/giveTimeMaxData/')
        .then((response) => {
          console.log('StackedBarData=', response.data)
          this.drawStackedBarChart(response.data)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    drawStackedBarChart(data) {
      const chartInstance = echarts.init(this.$refs.stackedBarChart)
      const dataNames = ['personal_use', 'fisheries', 'hygiene', 'industrial', 'others']
      const years = Object.keys(data)

      // 准备ECharts series数据
      const series = dataNames.map((category) => ({
        name: category,
        type: 'bar',
        stack: 'total',
        data: years.map((year) => data[year][category] || 0)
      }))

      // 配置ECharts选项
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params) {
            let year = params[0].axisValue.substring(0, 4)
            let tooltipContent = `${params[0].axisValue}<br />` // axisValue typically represents the year
            params.forEach((param) => {
              tooltipContent += `${param.seriesName}: ${param.value}<br />`
              // tooltipContent += `<strong>Total Waste: ${param.value} kg</strong><br />`;
            })
            tooltipContent += `<strong>Total Waste: ${data[year]['kg_of_collected_waste']} kg</strong>`
            return tooltipContent
          }
        },
        legend: {
          orient: 'vertical', // 垂直显示图例
          left: 'right', // 图例放在右侧
          top: '30%', // 图例放在中间
          data: dataNames
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'category',
          data: years.map((year) => year + ': ' + data[year]['county_name'])
        },
        xAxis: {
          type: 'value'
        },
        series: series
      }

      // 使用配置项和数据显示图表
      chartInstance.setOption(option)
    }
  }
}
</script>

<style scoped></style>

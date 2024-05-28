<template>
  <span style="text-align: center; font-size: larger; font-weight: bold; font-style: italic"
    >Total amount of garbage classification in recent years</span
  >
  <div
    ref="stackedBarChart"
    style="width: 1200px; height: 600px; border-bottom-style: dotted; justify-content: left"
  ></div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'stackedBarChart',
  data() {
    return {}
  },
  mounted() {
    this.setDefaultStackedBarData()
  },
  methods: {
    setDefaultStackedBarData() {
      axios
        .get('http://47.108.61.203:8081/originalGivePieData/')
        .then((response) => {
          console.log('setDefaultStackedBarData=', response.data)
          this.drawStackedBarChart(response.data)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    drawStackedBarChart(provinceData) {
      const chartInstance = echarts.init(this.$refs.stackedBarChart)

      // 数据名称，对应各个堆叠系列
      const dataNames = ['personal_use', 'fisheries', 'hygiene', 'industrial', 'others']

      // 先计算每个county的总量，用于排序
      const totals = provinceData.map((county) => ({
        name: county.county_name,
        total: dataNames.reduce((sum, key) => {
          const item = county.data.find((d) => d.name === key)
          return sum + (item ? item.value : 0)
        }, 0)
      }))

      // 根据总量对county进行排序
      totals.sort((a, b) => a.total - b.total)

      // 根据排序结果设置categories
      const categories = totals.map((item) => item.name)

      // 转换数据格式
      const seriesData = dataNames.map((name) => {
        return {
          name: name,
          type: 'bar',
          stack: 'total', // 这个属性确保了数据堆叠
          data: totals.map((item) => {
            const county = provinceData.find((c) => c.county_name === item.name)
            const dataItem = county.data.find((d) => d.name === name)
            return dataItem ? dataItem.value : 0
          })
        }
      })

      // 绘制图表
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          orient: 'vertical', // 垂直显示图例
          left: 'right', // 图例放在右侧
          top: '30%', // 图例放在中间
          data: dataNames
          // padding: [600, 0, 0, 0],
        },
        grid: {
          left: '8%'
          // right: '10%'
        },
        yAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            // rotate: 20, // 如果名称过长，可以旋转标签
            // margin: 20, // 增加标签和轴线之间的距离
            interval: 0 // 显示所有标签
          }
        },
        xAxis: {
          type: 'value',
          // axisLabel: {
          //   rotate: 0, // 不需要旋转标签
          //   margin: 20, // 增加标签和轴线之间的距离
          // },
          position: 'top'
        },
        series: seriesData
      }

      chartInstance.setOption(option)
    }
  }
}
</script>

<style scoped></style>

<template>
  <div style="height: 1500px" >
    <div ref="barChart" style="height: 500px"></div>
    <div v-show="isdraw"  class="rose-chart-window">
      <div ref="roseChart" style="width: 500px; height: 500px;"></div>
      <button @click="isdraw=false" style="margin-left: 50%;">CLOSE</button>
    </div>
<!--    <div ref="roseChart" style="width: 100%; height: 500px;"></div>- -->
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'

export default {
  name: 'ChartComponent',
  props: ['currentProvince', 'selectedPointData'],
  data() {
    return {
      DbarData: null, //默认数据
      barData: null ,//绘制数据
      isdraw: false,
    }
  },

  mounted() {
    this.setDefaultBarData()
    // this.setDefaultStackedBarData()
    // this.setTimelineChartData()
  },
  watch: {
    DbarData: {
      handler(newVal) {
        this.drawBarChart(newVal)
      }
    },
    currentProvince(newVal) {
      var data = {
        currentProvince: newVal
      }
      axios
        .post('http://47.108.61.203:8081/originalGiveBarData/', data)
        .then((response) => {
          this.barData = response.data
          var currentProvinceData = response.data
          this.drawBarChart(currentProvinceData)
          console.log('display barData=', this.barData)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    selectedPointData(newVal) {
      this.isdraw = true
      this.drawRoseChart(newVal)
    }
  },
  methods: {
    /**
     *设置数据
     * */
    setDefaultBarData() {
      axios
        .get('http://47.108.61.203:8081/originalGiveBarData/')
        .then((response) => {
          this.DbarData = response.data
          console.log('display DbarData=', this.DbarData)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    /**
     *绘制数据
     * */
    drawBarChart(data) {
      let myChart = echarts.init(this.$refs.barChart)
      console.log('barData=', data)
      console.log('barData.data=', data.data)
      let categories = data.data.map((item) => item.name)
      let values = data.data.map((item) => item.value)
      console.log('categories=', categories)
      let option = {
        title: {
          text: data.county_name + ' Marine Debris Monitoring and Analysis'
        },
        grid: {
          left: '15%',
        },
        tooltip: {},
        xAxis: {
          data: ['personal_use', 'fisheries', 'hygiene', 'industrial', 'others'],
          axisLabel: {
            rotate: 20, // 如果名称过长，可以旋转标签
            margin: 20, // 增加标签和轴线之间的距离
            interval: 0 // 显示所有标签
          }
        },
        yAxis: {},
        series: [
          {
            name: 'Quantity of garbage',
            type: 'bar',
            data: values,
            itemStyle: {
              color: '#42b983' // Vue.js 的颜色，你可以选择其他颜色
            },
            label: {
              show: true, // 显示每个柱子的数据标签
              position: 'top'
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    drawRoseChart(scatterData) {
      const chartInstance = echarts.init(this.$refs.roseChart)
      const option = {
        title: {
          text: scatterData.county_name + ' Distribution of garbage types',
          subtext:
              'date: ' +
              scatterData.startData +
              '\nlocation: ' +
              scatterData.value.slice(0, 2).join(', '),
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: ['personal_use', 'fisheries', 'hygiene', 'industrial', 'others']
        },
        series: [
          {
            name: '垃圾类型',
            type: 'pie',
            radius: [20, '50%'], // 使饼图变成南丁格尔玫瑰图
            center: ['50%', '50%'],
            roseType: 'radius', // 南丁格尔图的模式，半径显示数据大小
            itemStyle: {
              borderRadius: 5
            },
            label: {
              formatter: '{b}: {c} ({d}%)'
            },
            data: [
              { value: scatterData.type.personal_use, name: 'personal_use' },
              { value: scatterData.type.fisheries, name: 'fisheries' },
              { value: scatterData.type.hygiene, name: 'hygiene' },
              { value: scatterData.type.industrial, name: 'industrial' },
              { value: scatterData.type.others, name: 'others' }
            ]
          }
        ]
      }

      chartInstance.setOption(option)
    },

    /**
     *
     *
     * */
  }
}
</script>

<style scoped>

.rose-chart-window {
  width: 500px;
  height: 500px;
  position: fixed;
  top: 10%;  /* 顶部对齐 */
  right: 1%;  /* 右侧对齐 */
  background-color: white;
  z-index: 1000;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}
</style>

<template>
  <div ref="timelineChart" style="width: 1200px; height: 600px; border-bottom-style: dotted"></div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'timelineChart',
  data() {
    return {}
  },
  mounted() {
    this.setTimelineChartData()
  },
  methods: {
    setTimelineChartData() {
      axios
        .get('http://47.108.61.203:8081//giveTimeBarData/')
        .then((response) => {
          console.log('setTimelineChartData=', response.data)
          this.drawTimelineChart(response.data)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    drawTimelineChart(resultData) {
      const chartInstance = echarts.init(this.$refs.timelineChart)

      const years = Object.keys(resultData).sort() // 获取所有年份，并进行排序
      const timelineOptions = years.map((year) => {
        const yearData = resultData[year]
        return {
          title: {
            text: `Time chart of total amount of waste in provinces`,
            left: 'center',
            top: 0
          },
          yAxis: {
            type: 'category',
            data: resultData[year].map((item) => item.county_name), // 取第一个年份的county_name作为示例
            axisLabel: {
              interval: 0,
              rotate: 0
            }
          },
          series: [
            {
              data: yearData.map((item) => ({
                name: item.county_name,
                value: item.data.find((d) => d.name === 'kg_of_collected_waste').value
              })),
              label: {
                show: true, // 显示每个柱子的数据标签
                position: 'right'
              }
            }
          ]
        }
      })

      let option = {
        baseOption: {
          timeline: {
            axisType: 'category',
            autoPlay: true,
            data: years,
            playInterval: 5000, // 自动播放间隔时间
            bottom: 0 // 增加时间轴底部的空间
          },
          tooltip: {},
          legend: {
            data: ['kg_of_collected_waste'],
            top: '20', // 图例位于距顶部30px的位置，确保在标题下方
            left: 'right' // 图例居中
          },
          grid: {
            left: '8%',
            right: '0%'
          },
          yAxis: {
            type: 'category',
            data: resultData[years[0]].map((item) => item.county_name), // 取第一个年份的county_name作为示例
            axisLabel: {
              interval: 0,
              rotate: 45
            }
          },
          xAxis: {
            type: 'value',
            position: 'top'
          },
          series: [
            {
              name: 'kg_of_collected_waste',
              type: 'bar',
              emphasis: {
                itemStyle: {
                  // color: 'green'
                }
              }
            }
          ]
        },
        options: timelineOptions
      }

      chartInstance.setOption(option)

      let selectedName = null

      chartInstance.on('click', function (params) {
        if (params.componentType === 'series' && params.seriesType === 'bar') {
          // 记录被点击的柱子名称
          selectedName = params.name
          console.log('Selected county:', params)
          // 更新图表选项以反映颜色变化
          console.log('Selected county color:', params.color)
          if (params.color !== 'green') {
            chartInstance.setOption({
              series: [
                {
                  index: params.seriesIndex,
                  itemStyle: {
                    color: function (params) {
                      // 如果当前柱子名称与被选中名称相同，则改变颜色为绿色
                      return params.name === selectedName ? 'green' : '#5470C6'
                    }
                  }
                }
              ]
            })
          } else {
            chartInstance.setOption({
              series: [
                {
                  index: params.seriesIndex,
                  itemStyle: {
                    color: function (params) {
                      // 如果当前柱子名称与被选中名称相同，则改变颜色为#5470C6
                      return '#5470C6'
                    }
                  }
                }
              ]
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped></style>

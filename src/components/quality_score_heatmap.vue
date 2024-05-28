<template>
  <div>
    <div ref="qualityHeatmapChart" style="width: 1100px; height: 400px"></div>
    <div ref="compositeHeatmapChart" style="width: 1100px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import axios from 'axios'
export default {
  name: 'quality_score_heatmap',
  data() {
    return {}
  },
  mounted() {
    this.setQualityScores()
    this.setCompositeHeatmap()
  },
  methods: {
    setQualityScores() {
      axios
        .get('http://47.108.61.203:8081/qualityScores/')
        .then((response) => {
          let qualityScoresJson = response.data
          console.log('qualityScoresJson=', qualityScoresJson)
          this.qualityScoreHeatmap(qualityScoresJson)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    },
    setCompositeHeatmap() {
      axios
        .get('http://47.108.61.203:8081/compositeQualityScore/')
        .then((response) => {
          let composite_quality_score_dict = response.data
          console.log('composite_quality_score_dict=', composite_quality_score_dict)
          this.compositeQualityScoreHeatmap(composite_quality_score_dict)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    },

    qualityScoreHeatmap(qualityScoresJson) {
      const chartInstance = echarts.init(this.$refs.qualityHeatmapChart)
      console.log(typeof qualityScoresJson)
      const qualityScoresData = qualityScoresJson.map((item) => ({
        year: item.year,
        month: item.month - 1, // 月份索引从0开始，所以需要减1
        qualityScore: item.quality_score
      }))
      let minYear = Math.min(...qualityScoresJson.map((d) => d.year))
      let maxYear = Math.max(...qualityScoresJson.map((d) => d.year))
      const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)
      console.log('years=', years)
      const heatmapData = qualityScoresData.map((item) => [
        item.month,
        item.year - Math.min(...qualityScoresJson.map((d) => d.year)),
        item.qualityScore
      ])

      const option = {
        title: {
          text: 'Data Quality Score by Year and Month',
          left: 'center'
        },
        tooltip: {
          position: 'top',
          formatter: function (params) {
            console.log(params.value)
            const date = new Date(params.value[1] + minYear, params.value[0] + 1)
            const dateStr = `${date.getFullYear()}-${date.getMonth()}`
            return 'Date: ' + dateStr + '<br>' + 'Quality Score: ' + params.value[2]
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [...new Set(qualityScoresData.map((item) => item.month + 1))], // 月份为1-12
          splitArea: {
            show: true
          },
          name: 'Month',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false
          },
          axisLabel: {
            formatter: (value) => `Month ${value}`
          }
        },
        yAxis: {
          type: 'category',
          data: years,
          splitArea: {
            show: true
          },
          name: 'Year',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false
          }
        },
        visualMap: {
          min: 0,
          max: 100,
          calculable: true,
          // orient: 'horizontal',
          left: 'right',
          top: '10px',
          color: ['#6da8d2', '#317256'],
          textStyle: {
            color: '#000'
          }
        },
        series: [
          {
            name: 'Quality Score',
            type: 'heatmap',
            data: heatmapData,
            label: {
              show: true,
              formatter: function (params) {
                return params.value[2]
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      chartInstance.setOption(option)
    },

    compositeQualityScoreHeatmap(composite_quality_score_dict) {
      const chartInstance = echarts.init(this.$refs.compositeHeatmapChart)
      console.log(typeof composite_quality_score_dict)
      const qualityScoresData = composite_quality_score_dict.map((item) => ({
        year: item.year,
        month: item.month - 1, // 月份索引从0开始，所以需要减1
        composite_quality_score: item.composite_quality_score
      }))
      let minYear = Math.min(...composite_quality_score_dict.map((d) => d.year))
      let maxYear = Math.max(...composite_quality_score_dict.map((d) => d.year))
      const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)
      console.log('years=', years)
      const heatmapData = qualityScoresData.map((item) => [
        item.month,
        item.year - Math.min(...composite_quality_score_dict.map((d) => d.year)),
        item.composite_quality_score.toFixed(3)
      ])
      console.log('heatmapData=', heatmapData)

      const option = {
        title: {
          text: 'Composite Data Quality Score by Year and Month',
          left: 'center'
        },
        tooltip: {
          position: 'top',
          formatter: function (params) {
            console.log(params.value)
            const date = new Date(params.value[1] + minYear, params.value[0] + 1)
            const dateStr = `${date.getFullYear()}-${date.getMonth()}`
            return 'Date: ' + dateStr + '<br>' + 'Quality Score: ' + params.value[2]
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [...new Set(qualityScoresData.map((item) => item.month + 1))], // 月份为1-12
          splitArea: {
            show: true
          },
          name: 'Month',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false
          },
          axisLabel: {
            formatter: (value) => `Month ${value}`
          }
        },
        yAxis: {
          type: 'category',
          data: years,
          splitArea: {
            show: true
          },
          name: 'Year',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false
          }
        },
        visualMap: {
          min: 0,
          max: 10,
          calculable: true,
          // orient: 'horizontal',
          left: 'right',
          top: '10px',
          color: ['#4baab3', '#6a4c93'],
          textStyle: {
            color: '#000'
          }
        },
        series: [
          {
            name: 'Quality Score',
            type: 'heatmap',
            data: heatmapData,
            label: {
              show: true,
              formatter: function (params) {
                return params.value[2]
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      chartInstance.setOption(option)
    }
  }
}
</script>

<style scoped></style>

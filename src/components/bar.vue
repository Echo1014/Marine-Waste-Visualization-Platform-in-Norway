<template>
  <div ref="bar" style="width:1000px; height: 900px"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "bar",
  mounted() {
    this.draw()
  },
  methods: {
    draw(){
      let bar = this.$refs.bar;
      let myChart = echarts.init(bar)
      const option = {
        textStyle: {
          fontWeight: 'bold' , // 设置全局字体加粗
          color:'black',
          fontSize: 16
        },
        legend: {},
        tooltip: {},
        dataset: [
          {
            source: [
              ['Fp1-2', 'ACC', 'PRE', 'RECALL', 'F1-SCORE'],
              ['FE', 39.44, 39.44, 100, 56.57],
              ['FE_B', 61.11, 53.06, 68.42, 59.77],
              ['FE_B_STFT', 90, 98.11, 75.36, 85.25]
            ]
          },
          {
            source: [
              ['01-2', 'ACC', 'PRE', 'RECALL', 'F1-SCORE'],
              ['FE', 73.33, 66.67, 18.87, 29.41],
              ['FE_B', 88.33, 91.78, 81.71, 86.45],
              ['FE_B_STFT', 90.56, 97.96, 75, 84.96]
            ]
          },
          {
            source: [
              ['Fp1-2+01-2', 'ACC', 'PRE', 'RECALL', 'F1-SCORE'],
              ['FE', 89.44, 96.49, 76.39, 85.27],
              ['FE_B', 96.67, 96.67, 93.55, 95.08],
              ['FE_B_STFT', 98.89, 100, 97.01, 98.48]
            ]
          }
        ],
        xAxis: [
          { type: 'category', gridIndex: 0 ,axisLabel: {
              textStyle: {
                fontSize: 15
              }
            }},
          { type: 'category', gridIndex: 1 ,axisLabel: {
              textStyle: {
                fontSize: 15
              }
            }},
          { type: 'category', gridIndex: 2 ,axisLabel: {
              textStyle: {
                fontSize: 15
              }
            }},
        ],
        yAxis: [
          { gridIndex: 0 },
          { gridIndex: 1 },
          { gridIndex: 2 }
        ],
        grid: [
          // 第一个 grid，在顶部，从容器顶部开始，留出底部到第二个 grid 的间隙
          { top: '3%', bottom: '64%' ,},
          // 第二个 grid，位于中间，顶部和底部均留有间隙
          { top: '38.5%', bottom: '35%' },
          // 第三个 grid，位于底部，顶部留出间隙到第二个 grid，底部到容器底部
          { top: '68 %', bottom: '3%' }
        ],
        label: {
          show: true,
          textStyle: {
            fontWeight: 'bold'  // 字体加粗
          },
        },
        series: [
          // Series for the first grid (gridIndex 0)
          { type: 'bar', xAxisIndex: 0, yAxisIndex: 0, datasetIndex: 0 ,barGap:0.2},
          { type: 'bar', xAxisIndex: 0, yAxisIndex: 0, datasetIndex: 0 },
          { type: 'bar', xAxisIndex: 0, yAxisIndex: 0, datasetIndex: 0 },
          { type: 'bar', xAxisIndex: 0, yAxisIndex: 0, datasetIndex: 0 ,barWidth: '15%'},

          // Series for the second grid (gridIndex 1)
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, datasetIndex: 1 ,barGap:0.1,},
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, datasetIndex: 1 },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, datasetIndex: 1 },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, datasetIndex: 1 ,barWidth: '15%'},

          // Series for the third grid (gridIndex 2)
          { type: 'bar', xAxisIndex: 2, yAxisIndex: 2, datasetIndex: 2 ,barGap:0.1},
          { type: 'bar', xAxisIndex: 2, yAxisIndex: 2, datasetIndex: 2 },
          { type: 'bar', xAxisIndex: 2, yAxisIndex: 2, datasetIndex: 2 },
          { type: 'bar', xAxisIndex: 2, yAxisIndex: 2, datasetIndex: 2 ,barWidth: '15%'},
        ]
      };
      myChart.setOption(option)
    }
  }

}
</script>

<style scoped>

</style>
<template>
  <div>
    <div class="select-container">
      <span>MapMode</span>
      <el-select
        v-model="selectedMapType"
        placeholder="select"
        @change="loadMap"
        style="width: 150px"
      >
        <el-option
          v-for="item in mapTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span class="demonstration" style="margin-left: 30px">Details</span>
      <el-cascader
        style="width: 300px"
        v-model="optionValue"
        :options="options"
        @change="handleOptionsChange"
      >
      </el-cascader>
    </div>
    <div ref="Map" id="main"></div>
  </div>
</template>

<script>
import { ElSelect, ElOption } from 'element-plus'
import * as echarts from 'echarts'
import NorwaymapJson1 from '../assets/json/NorwayMap.json'
import axios from 'axios'
export default {
  name: 'MapComponent',
  data() {
    return {
      scatter: [
        {
          name: '1',
          value: [11.5358, 58.868, 9],
          type: { personal_use: 20, fisheries: 39, industrial: 20, hygiene: 0, others: 12 },
          symbolSize: 10
        },
        {
          name: 'Point 1',
          value: [12.5358, 56.868, 9],
          type: { personal_use: 10, fisheries: 5, industrial: 20, hygiene: 8, others: 15 }
        },
        {
          name: 'Point 2',
          value: [10.5358, 59.868, 9],
          type: { personal_use: 5, fisheries: 12, industrial: 18, hygiene: 7, others: 10 }
        }
        // ... 更多散点数据
      ],
      isDraw: false,
      mycharts: null,
      geoData: [], //全体数据
      pieData: [], //按省分类的数据，各项值进行了累加,数据格式[{"county_name":?,"data":[{"name":personal_use ,"value":?},]},...]
      timeTitle: [], //日期
      dateDate: null, //依据日期分类的数据，数据格式{2020:[{}],...}
      heatData: [], //热力图需要的数据，数据格式[[经度, 纬度, 值], [...], ...]
      selectedMapType: ['drawScatter', 'drawPie', 'drawTimeScatter', 'drawHeatmap'],
      mapTypes: [
        { label: 'Load Scatter', value: 'scatter' },
        { label: 'Load Pie Chart', value: 'pie' },
        { label: 'Load Original Map', value: 'original' },
        { label: 'Load HeatMap', value: 'heatMap' },
        { label: 'Load Time Scatter', value: 'timeScatter' },
        { label: 'Load Time HeatMap', value: 'timeHeatMap' }
      ],
      typeSelected: null,
      seriesType: null,

      optionValue: [],
      options: [
        {
          value: 'scatterMap',
          label: 'SCATTERMAP',
          children: [
            { value: 'personal_use', label: 'PERSONAL_USE' },
            { value: 'fisheries', label: 'FISHERIES' },
            { value: 'hygiene', label: 'HYGIENE' },
            { value: 'industrial', label: 'INDUSTRIAL' },
            { value: 'others', label: 'OTHERS' }
          ]
        },
        {
          value: 'heatMap',
          label: 'HEATMAP',
          children: [
            { value: 'personal_use', label: 'PERSONAL_USE' },
            { value: 'fisheries', label: 'FISHERIES' },
            { value: 'hygiene', label: 'HYGIENE' },
            { value: 'industrial', label: 'INDUSTRIAL' },
            { value: 'others', label: 'OTHERS' }
          ]
        }
      ],
      isAlltyep: false
    }
  },
  mounted() {
    const myChart = echarts.init(this.$refs.Map)
    this.mycharts = myChart
    this.initMap()
    this.setGeoData()
    this.setPieData()
  },
  watch: {
    'geoData.length'(newLength, oldLength) {
      if (newLength !== oldLength) {
        this.setScatter()
        this.groupedByStartData()
        this.setHeatdata()
      }
    }
  },
  methods: {
    loadMap() {
      if (this.selectedMapType === 'scatter') {
        this.drawScatter()
      } else if (this.selectedMapType === 'pie') {
        this.drawPie()
      } else if (this.selectedMapType === 'original') {
        this.reset()
      } else if (this.selectedMapType === 'heatMap') {
        this.drawHeatmap()
      } else if (this.selectedMapType === 'timeScatter') {
        this.drawTimeScatter()
      } else if (this.selectedMapType === 'timeHeatMap') {
        this.setTimeHeatmapData()
      }
    },

    handleOptionsChange(value) {
      console.log(value)
      if (value[0] === 'scatterMap') {
        this.setScatterTypeData(value[1])
      } else if (value[0] === 'heatMap') {
        this.setHeatTypeData(value[1])
      }
    },

    initMap() {
      //初始化一个echarts容器
      const myChart = this.mycharts
      //注册地图
      echarts.registerMap('norway', NorwaymapJson1)
      let geo_labelFontSize = 10
      myChart.on('click', (params) => {
        if (params.componentType === 'geo') {
          this.$emit('provinceSelected', params.name)
        }
      })
      let option = {
        geo: {
          type: 'map',
          map: 'norway', //用上述注册地图
          roam: true, //是否允许缩放
          zoom: 8, //初始化大小
          scaleLimit: {
            min: 1,
            max: 500
          },

          label: {
            show: true,
            fontSize: geo_labelFontSize
          },
          //设置中心点
          center: [6.595407938897836, 67.06621414564643],
          //省份地图添加背景
          //regions: this.regions,
          itemStyle: {
            areaColor: 'white',
            //areaColor:{},
            color: 'red',
            borderColor: '#232652',
            borderWidth: 2
          },
          zlevel: 0,
          //高亮状态
          emphasis: {
            itemStyle: {
              areaColor: '#1af'
              // color: 'green',
            }
          }
        }
      }
      myChart.setOption(option)
    },
    drawClear() {
      if (this.isDraw) {
        console.log('series clear')
        this.reset()
        this.isDraw = false
      }
    },
    reset() {
      this.mycharts.clear()
      this.initMap()
    },
    /*
     * 配置数据
     * */
    //使用axios设置geoData
    setGeoData() {
      axios
        .get('http://47.108.61.203:8081/giveData/')
        .then((response) => {
          this.geoData = response.data
          console.log('display geodata=', this.geoData)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    setPieData() {
      axios
        .get('http://47.108.61.203:8081/givePieData/')
        .then((response) => {
          this.pieData = response.data
          console.log('display piedata=', this.pieData)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    setScatter(data) {
      this.scatter = [] // 先清空现有数据
      //设置散点数据
      for (var i = 0; i < this.geoData.length; i++) {
        var tem = {
          name: this.geoData[i].name,
          value: this.geoData[i].geom_wkt,
          type: this.geoData[i].type,
          kg_of_collected_waste: this.geoData[i].kg_of_collected_waste,
          county_name: this.geoData[i].county_name,
          startData: this.geoData[i].startData
        }
        this.scatter.push(tem)
      }
      console.log('scatter:   ', this.scatter)
    },
    groupedByStartData() {
      // 使用 reduce 方法按照 startData 属性进行分类
      var date = []
      var groupedByStartDate = this.geoData.reduce(function (acc, obj) {
        var key = obj.startData
        // 如果该 startData 对应的数组不存在，则创建一个空数组
        obj.value = obj.geom_wkt
        if (!acc[key]) {
          acc[key] = []
          date.push(key)
        }
        // 将当前对象添加到对应的数组中
        acc[key].push(obj)
        return acc
      }, {})
      this.timeTitle = date
      date.sort((a, b) => a - b)
      this.dateDate = groupedByStartDate
      console.log('dateDate:   ', this.dateDate)
      console.log('date:   ', this.timeTitle)
    },
    setHeatdata() {
      for (var i = 1; i < this.geoData.length; i++) {
        var value = [
          this.geoData[i].geom_wkt[0],
          this.geoData[i].geom_wkt[1],
          this.geoData[i].kg_of_collected_waste
        ]
        var tem = { name: i, value: value }
        this.heatData.push(tem)
      }
      console.log('heat', this.heatData)
    },

    setScatterTypeData(selectedType) {
      let data = {
        params: {
          type: selectedType
        }
      }
      axios
        .get('http://47.108.61.203:8081/giveScattertypeData/', data)
        .then((response) => {
          console.log('display typeData=', response.data)
          this.drawTypeScatter(response.data)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    setHeatTypeData(selectedType) {
      let data = {
        params: {
          type: selectedType
        }
      }
      axios
        .get('http://47.108.61.203:8081/giveHeatmaptypeData/', data)
        .then((response) => {
          console.log('display typeData=', response.data)
          this.drawTypeHeatmap(response.data, selectedType)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },
    setTimeHeatmapData() {
      axios
        .get('http://47.108.61.203:8081/giveTimeHeatmapData/')
        .then((response) => {
          console.log('display TimeHeatmapData=', response.data)
          this.drawTimeHeatmap(response.data)
        })
        .catch((error) => {
          console.error('There was an error!', error)
        })
    },

    /**
     * 绘制地图上的数据
     * */
    //绘制散点图
    drawScatter() {
      this.drawClear()
      let thisChart = this.mycharts
      this.isAlltyep = true
      thisChart.on('click', (params) => {
        if (params.seriesType === 'scatter' && this.isAlltyep) {
          var pointData = params.data
          this.$emit('selectedPointData', pointData)
        }
      })
      var newOption = {
        //提示框
        tooltip: {
          trigger: 'item',
          formatter(params) {
            if (params.componentType === 'series' && params.seriesType === 'scatter') {
              // console.log('params:',params.data.value)
              const data = params.data // 获取选中的散点数据
              const rubType = data.type // 获取 rubType 对象
              const rubTypeKeys = ['personal_use', 'fisheries', 'industrial', 'hygiene', 'others']
              const barData = rubTypeKeys.map((key) => rubType[key])

              //简单样式输出
              var result = ''
              result +=
                'County: ' + data.county_name + '<br />' + 'Year: ' + data.startData + '<br />'
              for (var i = 0; i < 5; i++) {
                result += rubTypeKeys[i] + ': ' + barData[i] + '<br />'
              }
              return result
            } else return ''
          }
        },

        //配置属性
        //散点的配置属性
        series: {
          type: 'scatter',
          //type: 'effectScatter',
          coordinateSystem: 'geo',
          data: this.scatter,
          showEffectOn: 'render',
          rippleEffect: {
            //涟漪特效相关配置
            brushType: 'stroke' //波纹的绘制方式，可选 'stroke' 和 'fill'
          },
          hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果
          itemStyle: {
            //图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时
            //color:'white', //散点的颜色
            show: true
            // shadowBlur: 0,
            // shadowColor:'transparent',
          },
          symbolSize: 10, // 设置散点的大小
          zlevel: 1,
          symbol:
            'image://data:image/png;base64,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'
        }
      }
      thisChart.setOption(newOption)
      this.isDraw = true
    },
    //绘制饼图
    drawPie() {
      this.drawClear()
      let thisChart = this.mycharts
      const radius = [
        18.022041145049922, 22.678099795103808, 26.80504068314522, 16.43824097213175, 35,
        15.506140963841151, 26.660251323534638, 13.215567372946596, 11.905949095732712,
        12.027643220067983, 11.12485639501143, 10.296092759939834, 10.03553113119278
      ]
      //每个省的饼图中心点
      const center = [
        [4.732561, 60.872091],
        [5.923173, 59.301698],
        [13.645292, 67.994069],
        [6.802845, 62.784375],
        [22.448044, 70.463485],
        [10.988482, 59.128791],
        [8.027554, 58.090047],
        [9.759097, 58.983307],
        [10.700121, 59.875606],
        [10.72302, 64.673937],
        [10.974006, 60.731743],
        [26.41126132293, 70.798674760997],
        [15.6357942833288, 78.2662080115]
      ]
      var series = []
      for (var i = 0; i < this.pieData.length; i++) {
        // eslint-disable-next-line no-unused-vars
        var temseries = {
          name: this.pieData[i].county_name,
          type: 'pie',
          coordinateSystem: 'geo',
          data: this.pieData[i].data,
          center: center[i],
          // roseType: 'area',
          radius: radius[i],
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          animationDuration: 0,
          // itemStyle: {
          //   borderRadius: 5
          // },
          emphasis: {
            label: {
              show: true,
              fontSize: 5,
              fontWeight: 'bold'
            }
          }
        }
        series.push(temseries)
      }
      console.log(series)

      let newoption = {
        series: series,
        tooltip: {
          trigger: 'item',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          top: '5%',
          left: 'center',
          // doesn't perfectly work with our tricks, disable it
          selectedMode: false
        }
      }
      thisChart.setOption(newoption)
      this.isDraw = true
    },
    //绘制时间类散图
    drawTimeScatter() {
      this.drawClear()
      let thisChart = this.mycharts
      this.isAlltyep = true
      thisChart.on('click', (params) => {
        if (params.seriesType === 'scatter' && this.isAlltyep) {
          var pointData = params.data
          this.$emit('selectedPointData', pointData)
        }
      })
      var newoption = {
        baseOption: {
          timeline: {
            data: this.timeTitle,
            axisType: 'category',
            autoPlay: false,
            playInterval: 3000,
            left: '10%',
            right: '10%',
            bottom: '2%',
            width: '80%',
            label: {
              normal: {
                textStyle: {
                  color: 'rgb(179, 239, 255)'
                }
              },
              emphasis: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            symbolSize: 10,
            lineStyle: {
              color: '#8df4f4'
            },
            checkpointStyle: {
              borderColor: '#8df4f4',
              color: '#53D9FF',
              borderWidth: 2
            },
            controlStyle: {
              showNextBtn: true,
              showPrevBtn: true,
              normal: {
                color: '#53D9FF',
                borderColor: '#53D9FF'
              },
              emphasis: {
                color: 'rgb(58,115,192)',
                borderColor: 'rgb(58,115,192)'
              }
            }
          },
          tooltip: {
            trigger: 'item',
            formatter(params) {
              if (params.componentType === 'series' && params.seriesType === 'scatter') {
                //console.log('params:',params.data.value)
                const data = params.data // 获取选中的散点数据
                const rubType = data.type // 获取 rubType 对象
                const rubTypeKeys = ['personal_use', 'fisheries', 'industrial', 'hygiene', 'others']
                const barData = rubTypeKeys.map((key) => rubType[key])
                //简单样式输出
                var result = ''
                for (var i = 0; i < 5; i++) {
                  result += rubTypeKeys[i] + ': ' + barData[i] + '<br />'
                }
                return result
              } else return ''
            }
          }
        },
        //变量则写在options中
        options: []
      }
      this.timeTitle.forEach((item) => {
        console.log('this ', item, '  :', this.dateDate[item])
        var title = 'In ' + item
        console.log('title ', title)
        newoption.options.push({
          title: {
            text: title
          },
          series: [
            {
              name: '散点',
              type: 'scatter',
              coordinateSystem: 'geo',
              rippleEffect: {
                brushType: 'fill'
              },
              color: 'red',
              data: this.dateDate[item],
              symbolSize: 7
              // symbolSize: function (val) {
              //   let value = val[2]
              //   if (value == max) {
              //     return 27
              //   }
              //   return 10
              // },
              // showEffectOn: 'render', //加载完毕显示特效
            }
          ]
        })
      })
      thisChart.setOption(newoption)
      this.isDraw = true
    },
    drawHeatmap() {
      this.drawClear()
      let thisChart = this.mycharts
      var newoption = {
        visualMap: {
          type: 'continuous',
          min: 0,
          max: 1000, // 假设这是kg_of_collected_waste的最大值
          left: 'left',
          top: 'top',
          text: ['kg_of_collected_waste'], // 映射条两端的文本
          calculable: true,
          inRange: {
            color: ['blue', 'green', 'yellow', 'red'] // 根据需要设置颜色
          },
          textStyle: {
            color: '#000'
          }
        },
        series: [
          {
            type: 'heatmap',
            coordinateSystem: 'geo',
            data: this.heatData,
            pointSize: 10
          }
        ]
      }
      thisChart.setOption(newoption)
      this.isDraw = true
    },
    drawTimeHeatmap(data){
      this.drawClear()
      let thisChart=this.mycharts;
      let newoption={
        timeline: {
          data: this.timeTitle,
          axisType: 'category',
          autoPlay: false,
          playInterval: 3000,
          left: '10%',
          right: '10%',
          bottom: '0%',
          width: '80%',
          label: {
            normal: {
              textStyle: {
                color: 'rgb(179, 239, 255)'
              }
            },
            emphasis: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          symbolSize: 10,
          lineStyle: {
            color: '#8df4f4'
          },
          checkpointStyle: {
            borderColor: '#8df4f4',
            color: '#53D9FF',
            borderWidth: 2,
          },
          controlStyle: {
            showNextBtn: true,
            showPrevBtn: true,
            normal: {
              color: '#53D9FF',
              borderColor: '#53D9FF'
            },
            emphasis: {
              color: 'rgb(58,115,192)',
              borderColor: 'rgb(58,115,192)'
            }
          },
        },
        visualMap: {
          type: 'continuous',
          min: 0,
          max: 1000, // 假设这是kg_of_collected_waste的最大值
          left: 'left',
          top: 'top',
          text: [ 'kg_of_collected_waste'], // 映射条两端的文本
          calculable: true,
          inRange: {
            color: ['blue', 'green', 'yellow', 'red'] // 根据需要设置颜色
          },
          textStyle: {
            color: '#000'
          }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'geo',
        },
        options: [],
      }
      this.timeTitle.forEach((item)=>{
        var i=0
        var title='In '+ item
        newoption.options.push({
          title:{
            text:title,
            right: '50%',
          },
          series:{
            // name:title,
            // geoIndex:0,
            // type: 'heatmap',
            // coordinateSystem: 'geo',
            data:data[item],
            pointSize:10,
          },
        })
        i++
      })
      console.log('newoption:',newoption)
      thisChart.setOption(newoption);
      this.isDraw=true
    },
    drawTypeScatter(data) {
      this.drawClear()
      this.isAlltyep = false
      let thisChart = this.mycharts
      if (data != null) {
        var newOption = {
          //提示框
          tooltip: {
            trigger: 'item',
            formatter(params) {
              if (params.componentType === 'series' && params.seriesType === 'scatter') {
                // console.log('params:',params.data.value)
                const data = params.data // 获取选中的散点数据

                //简单样式输出
                var result = ''
                result +=
                  'County: ' + data.county_name + '<br />' + 'Year: ' + data.startData + '<br />'
                result += data.type + ': ' + data[data.type] + '<br />'
                return result
              } else return ''
            }
          },

          //配置属性
          //散点的配置属性
          series: {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: data,
            hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果
            itemStyle: {
              show: true
            },
            symbolSize: 10, // 设置散点的大小
            zlevel: 1,
            symbol:
              'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGFUlEQVR4nO2Ye2xTZRjGD723p/EPQ4LxD43sBtvabr2c75wzWGFhKJgYoiIEQRA16owQ5I8RNV4mqEi4BDGISoQA2yyMy8aEtesubGNbd2+pMkFMWMYGrGCikbjEPeY7u6QY0xvdtAlv8qQnadL8nve833PeU4a5X/frfsWlekQmzSvI1nlFuaNHlPl6ePntbkGObkGBLkHxa6cg93YKitJ2QbG+g1cnM/+HarcwSh8ve8EryjxeUQ6qHioJfAIenWPqkKREOxWv9HgE5Sr6G/8JvFeQP+kVZJd9ogxRwwtKtI3JIyh724hq8ZSBd+czrE+YdoCC3zu8Ch5ehVYqovqm28iwkwrvJcwMnyDrijs8r0ILr0Izr25rJuyMSYG/YGMe8gmy3smCb+HV1ACaeHVv3E1csDN6nyjrmGz482NqJOrOdguji58Bcdr+qYJvkqRBI9Hsj1vaTDk8P6p6Qf34PcHTjPaKsp+igW8mSrisSnxvUaDcPKrTFiWqLCo0cJHDN1ARTa9jKSOP2YBPkK2KFL6VV6DKosTeRQasfe8zLDjcAnKmXxK9Xvv+VnzxhEEy00gigsc5okWdTbMiZgNeUdYaCXwzUeAEx2JN0U5YqgMwu2//u5xDWP3Bdhy16lHHhYc/Rw1w2qaY4P2ESYm08xT+qS8r7oatDsBa1isp2xVAtusWspy3YKoKYPHnp+Cw6lFPQsPXUwNEO9JgVc+MpftvRjLzdGzWFO2SoPdduYOBO3/Bc7kPy9a8jHnz5iE3Nxdi/iJYN+2G6fQAjGcCMJwZwsp3t6Hcog4JP2YAtTbtazEYkJdEcmDpzNOxeaXjNwSX2+2G3W7H3LlzIYoieJ6H+bmXYKgYQGblEDLLB7Er34gaLjR8HdGhhtMeitpAtyDrDheVNG3ogaXd33Th97sMdHV1SfA5OTkQBAEcx8FqtcK4cQcyKm4ivfwmVhZuQYVFHRK+dlTtMRiQB8LlPI3KBUdaYa6+DdEdwOUrv0jww8PDKCwsxJw5cya6b7PZYDabYRRzkX5yELNP3kDOvgYcz1aHg6d34HosBobDPaRoxnOVfchy3YLZ8SPy8vJQUFCAJUuWSJ0PhrdYLMjKyoLRaMSsAz6knbiOzJKf4cjShIYnOriJ7s8YDCiGwz1hJQMVV6VkMZX+IAGPi44NIWQCPjs7W4LPzMxE2rc+pJYNIuPIJclAGHhUc+wfURvoFBSBcOsBfSjZDzaPJkvlDXDzF0rQVOMzPw5vMpkk+Nk2EamOfqQcHQS/pw7HsjUh4d2ERTWni36EOnh5V7jdhq4Hq9/5ZDRVKodg2rhjAnocfHxsKHx6ejrS3tiKZMeApOUbPsIpsyY0vGSA9URvQFAcDreY0d1mz0KDFInpNFmO98P09IsSNO04BTcYDMjIyJDgUxevQHJJH5K+G0BycR925BngtIWFh9PGHozaQLugKIhkq6Rj9Pzb2zD71A0pWWYd60f6um3I4HImwGdZBaS8/imSivsws/QaZpZcw9INH6NM6n5oeBdHP7WvxnAHNI+2CcqRcCsxXczobrNwexnSjl+XRA9oiqMfqV/3IOWrbiSV9iNpDPyx4muwb3ag2Kynsx0W3smxIy6L5pGoDUh3gVc2RbLP08XMYWWxvHAr0sYOKJ1xOipJpQMT4EmHruLZDVskeKctPLyLY1FlYxuYWMtDlMsifRmhixndbXYuMGD5W5tBdtch7eAlpB64BNuuGixbX4Tt8w3S2ETSeZfUfT1cRP9MzAZq7YzCIyj90bxJ0d2Grgf0CUsznopGJU2bSA6sKwi+yqbvuacXGlptRJ3fwqtGonyTCr8ehIPn9CNVHJvHxKNaiGrvVMI7Rw3sZuJV53lG28yrmqcOnm2qtTMaJp7VbtFPP0/UF6cA/mKtRT+dmYyi/5g18Wr/ZMGf5dhep6h9eFLgg0008hp/QsIHm2jgNf6EhA82UU+0/oSEH69qws6oI1p/QsIHm6glWn9Cwv/TRELCB5uoIVp/QsIHm3ATnT8h4YNNuGw6f0LCB5tw2nT+hIQfr7P8Aw86ObaoysZ+SK8nvrhfzF31N5yrHRKO9AxAAAAAAElFTkSuQmCC'
          }
        }
        thisChart.setOption(newOption)
        this.isDraw = true
      }
    },
    drawTypeHeatmap(data, selectedType) {
      this.drawClear()
      let thisChart = this.mycharts
      var newoption = {
        visualMap: {
          type: 'continuous',
          min: 0,
          max: 400, //
          left: 'left',
          top: 'top',
          text: [selectedType], // 映射条两端的文本
          calculable: true,
          inRange: {
            color: ['blue', 'green', 'yellow', 'red'] // 根据需要设置颜色
          },
          textStyle: {
            color: '#000'
          }
        },
        series: [
          {
            type: 'heatmap',
            coordinateSystem: 'geo',
            data: data,
            pointSize: 5
          }
        ]
      }
      thisChart.setOption(newoption)
      this.isDraw = true
    }
  }
}
</script>

<style scoped>
#main {
  /* width: 800px;*/
  height: 580px;
  /*border: 1px solid black;*/
  margin-top: 20px;
}
</style>

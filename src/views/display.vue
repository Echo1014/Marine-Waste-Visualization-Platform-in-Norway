<template>
    <span style="text-align: center; font-size: larger; font-weight: bold; font-style: italic">
<!--    SIMPLE DATA DISPLAY-->
  </span>
  <div class="container">
    <!--  <h1>display</h1>-->
    <MapComponent
      @provinceSelected="handleProvinceSelection"
      @selectedPointData="handleSelectedPointData"
      class="map-component"
    />
    <ChartComponent
      :currentProvince="currentProvince"
      :selectedPointData="selectedPointData"
      class="chart-component"
    />
  </div>

</template>

<script>
// import axios from 'axios'
import MapComponent from '../components/MapComponent.vue'
import ChartComponent from '../components/ChartComponent.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'display',
  components: {
    // StackedBarChart,
    ChartComponent,
    // eslint-disable-next-line vue/no-unused-components
    MapComponent
  },
  data() {
    return {
      geoData: [],
      currentProvince: null,
      selectedPointData: null
    }
  },
  mounted() {},
  methods: {
    handleProvinceSelection(data) {
      this.currentProvince = data
    },
    handleSelectedPointData(data) {
      this.selectedPointData = data
    }
  }
}
</script>

<style>
#main {
  width: 100%;
  height: 100vh;
}
.container {
  display: flex; /* 使用Flexbox布局 */
  justify-content: space-between; /* 子元素水平间隔均匀分布 */
}

.map-component {
  flex: 5; /* Flexbox弹性比例，MapComponent和ChartComponent各占一半空间 */
  margin-right: 0px; /* 右边距，确保两个组件之间有间隔 */
}

.chart-component {
  flex: 3; /* Flexbox弹性比例，MapComponent和ChartComponent各占一半空间 */
  margin-left: 10px;
}
</style>

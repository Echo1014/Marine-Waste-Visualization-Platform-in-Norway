<script setup lang="ts">
import {
  Setting,
  Loading,
  ArrowRight,
  Delete,
  Edit,
  Share,
  Expand,
  Fold,
  MapLocation,
  Menu,
  HelpFilled,
  Film
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { defineComponent, ref } from 'vue'
import { ElButton, ElIcon, ElMenu, ElMenuItem, ElSubMenu } from 'element-plus'
const router = useRouter()
const routes = router.options.routes
const activeIndex = ref('/')
const isCollapsed = ref(false) // 控制侧边栏收缩状态
// 显式地为图标组件提供一个名字
defineComponent({
  components: {
    Setting,
    ArrowRight,
    Delete,
    Edit,
    Share,
    Fold,
    Expand,
    MapLocation,
    Menu,
    HelpFilled,
    Film
  }
})
// 筛选出 /dataVis 路由的子路由
const dataVisRoute = routes.find((route) => route.path === '/dataVis')
const dataVisChildren = dataVisRoute ? dataVisRoute.children : []

function handleSelect(index, indexPath) {
  router.push(index) // 导航到选中的路由
}
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
// 根据路由元数据中的图标名称获取对应的图标组件
const getIconComponent = (iconName) => {
  // 先检查 routeMeta 是否存在，然后再尝试获取 icon 属性
  // const iconName = routeMeta?.icon;
  switch (iconName) {
    case 'Simple-DataIcon':
      return Menu
    case 'AnalysisIcon':
      return HelpFilled
    case 'DisplayChartIcon':
      return Film
    case 'DisplayIcon':
      return MapLocation
    // 添加更多图标的 case...
    default:
      return null
  }
}
console.log('routes: ') // 查看路由数组是否正确
console.log(routes) // 查看路由数组是否正确
console.log('dataVisRoute: ') // 查看路由数组是否正确
console.log(dataVisRoute) // 查看路由数组是否正确
console.log('dataVisChildren: ') // 查看路由数组是否正确
console.log(dataVisChildren) // 查看路由数组是否正确
</script>
<template>
  <el-container>
    <el-header>
      <span style="display: flex; width: 100%; position: relative; justify-content: center">
        <h1 id="title" style="text-align: center; font-weight: bold; color: #74bbd6">
          Norwegian Garbage Data Visualization System
        </h1>
        <!-- 下拉菜单<el-dropdown style="text-align;: right;">
          <el-button type="primary" :icon="Setting"></el-button>
          <el-button type="primary" :icon="Setting"> Dropdown List </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>Action 1</el-dropdown-item>
              <el-dropdown-item>Action 2</el-dropdown-item>
              <el-dropdown-item>Action 3</el-dropdown-item>
              <el-dropdown-item disabled>Action 4</el-dropdown-item>
              <el-dropdown-item divided>Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </span>
    </el-header>
    <el-container>
      <el-aside :width="isCollapsed" style="width: auto; background-color: #2f4050">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="vertical"
          :collapse="isCollapsed"
          :collapse-transition="true"
          @select="handleSelect"
          :default-openeds="['/simple-data']"
        >
          <el-menu-item @click="toggleCollapse"
            ><el-icon
              ><component v-if="isCollapsed" :is="Expand"></component
              ><component v-else :is="Fold"></component></el-icon
          ></el-menu-item>
          <template v-for="route in dataVisChildren" :key="route.path">
            <el-menu-item v-if="!route.children" :index="route.path">
              <el-icon
                ><component v-if="1" :is="getIconComponent(route.meta.icon)"></component
              ></el-icon>
              <span>{{ route.name }}</span>
            </el-menu-item>
            <el-sub-menu v-else :index="route.path" style="color: aliceblue">
              <template #title
                ><el-icon
                  ><component v-if="1" :is="getIconComponent(route.meta.icon)"></component></el-icon
                ><span>{{ route.name }}</span></template
              >
              <el-menu-item v-for="child in route.children" :key="child.path" :index="child.path">
                <el-icon
                  ><component v-if="1" :is="getIconComponent(child.meta.icon)"></component
                ></el-icon>
                <span>{{ child.name }}</span>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-header {
  padding-top: 10px;
  border-bottom: solid;
}
.el-menu-item {
  background-color: #2f4050;
  color: aliceblue;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
#title:hover {
  font-size: 29px;
}
</style>

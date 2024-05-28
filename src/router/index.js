import { createRouter, createWebHistory, routerKey } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import display from '../views/display.vue'
import analysis from '../views/analysis.vue'
import Index from '../views/Index.vue'
import displayChart from '../views/displayChart.vue'
import original_display from '../views/original/original_display.vue'
import original_analysis from '../views/original/original_analysis.vue'
import original_displayChart from '../views/original/original_displayChart.vue'

const router = createRouter({
  mode: 'hash',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/dataVis',
      name: 'dataVis',
      meta: { icon: 'AnalysisIcon' }, // 假设的图标名
      component: Index,
      redirect: '/display',
      children: [
        {
          path: '/simple-data',
          name: 'simple-data',
          meta: { icon: 'Simple-DataIcon' }, // 假设的图标名
          children: [
            {
              path: '/display',
              name: 'display',
              meta: { icon: 'DisplayIcon' }, // 假设的图标名
              component: display
            },
            {
              path: '/analysis',
              name: 'analysis',
              meta: { icon: 'AnalysisIcon' }, // 假设的图标名
              component: analysis
            },
            {
              path: '/displayChart',
              name: 'displayChart',
              meta: { icon: 'DisplayChartIcon' }, // 假设的图标名
              component: displayChart
            }
          ]
        },

        {
          path: '/original-data',
          name: 'original-data',
          meta: { icon: 'DisplayIcon' }, // 假设的图标名
          children: [
            {
              path: '/originalDisplay',
              name: 'original_display',
              meta: { icon: 'DisplayIcon' }, // 假设的图标名
              component: original_display
            },
            {
              path: '/originalAnalysis',
              name: 'original_analysis',
              meta: { icon: 'AnalysisIcon' }, // 假设的图标名
              component: original_analysis
            },
            {
              path: '/originalDisplayChart',
              name: 'original_displayChart',
              meta: { icon: 'DisplayIcon' }, // 假设的图标名
              component: original_displayChart
            }
          ]
        }

      ]
    }
  ]
})

export default router

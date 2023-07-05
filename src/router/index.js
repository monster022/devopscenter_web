import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/project/index',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'house-solid' }
    }]
  },

  {
    path: '/project',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/project/index'),
        meta: { title: 'Project', icon: 'el-icon-s-shop' }
      },
      {
        path: 'detail/:project',
        meta: { title: '构建详情页' },
        component: () => import('@/views/project/detail/index'),
        hidden: true
      }
    ]
  },

  {
    path: '/machine',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/machine/index'),
        meta: { title: 'Machine', icon: 'el-icon-cpu' },
        hidden: true
      }
    ]
  },
  {
    path: '/componentDemo',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/componentDemo/index'),
        meta: { title: 'componentDemo', icon: 'el-icon-video-camera' },
        hidden: true
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'info',
        meta: { title: 'UserCenter' },
        component: () => import('@/views/userInfo/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'info',
        meta: { title: 'OrderCenter' },
        component: () => import('@/views/order/index'),
        hidden: true
      }
    ]
  },
  // 暂不显示
  {
    path: '/kubernetes',
    component: Layout,
    redirect: '/kubernetes/table',
    name: 'Kubernetes',
    meta: { title: 'Kubernetes', icon: 'el-icon-cloudy' },
    hidden: true,
    children: [
      {
        path: 'deployment',
        component: () => import('@/views/kubernetes/deployment/index'),
        meta: { title: 'DeployMent', icon: '' }
      },
      {
        path: 'configmap',
        component: () => import('@/views/kubernetes/deployment/index'),
        meta: { title: 'ConfigMap', icon: '' }
      },
      {
        path: 'service',
        component: () => import('@/views/kubernetes/deployment/index'),
        meta: { title: 'Service', icon: '' }
      },
      {
        path: 'ingress',
        component: () => import('@/views/kubernetes/deployment/index'),
        meta: { title: 'Ingress', icon: '' }
      },
      {
        path: 'cronjob',
        component: () => import('@/views/kubernetes/deployment/index'),
        meta: { title: 'CronJob', icon: '' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

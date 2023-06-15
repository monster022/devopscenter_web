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
    redirect: '/dashboard',
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
        name: 'Project',
        component: () => import('@/views/project/index'),
        meta: { title: 'Project', icon: 'el-icon-s-shop' }
      },
      {
        path: 'detail/:project',
        meta: { title: '构建详情页' },
        component: () => import('@/views/detail/build/index'),
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
        name: 'Machine',
        component: () => import('@/views/machine/index'),
        meta: { title: 'Machine', icon: 'el-icon-cpu' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'info',
        meta: { title: '用户中心' },
        component: () => import('@/views/userInfo/index'),
        hidden: true
      }
    ]
  },

  {
    path: '/kubernetes',
    component: Layout,
    redirect: '/kubernetes/table',
    name: 'Kubernetes',
    meta: { title: 'Kubernetes', icon: 'el-icon-cloudy' },
    children: [
      {
        path: 'dev',
        name: 'Dev',
        component: () => import('@/views/kubernetes/dev/index'),
        meta: { title: 'Dev', icon: 'el-icon-hot-water' }
      },
      {
        path: 'fat',
        name: 'Fat',
        component: () => import('@/views/kubernetes/fat/index'),
        meta: { title: 'Fat', icon: 'el-icon-ice-cream' }
      },
      // {
      //   path: 'office',
      //   name: 'Office',
      //   component: () => import('@/views/kubernetes/office/index'),
      //   meta: { title: 'Office', icon: 'el-icon-dessert' }
      // },
      {
        path: 'deployment',
        name: 'DeployMent',
        component: () => import('@/views/kubernetes/deployment/index'),
        meta: { title: '工作负载', icon: '' }
      },
      {
        path: 'service',
        name: 'Service',
        component: () => import('@/views/kubernetes/deployment/index'),
        meta: { title: '服务发现', icon: '' }
      },
      {
        path: 'ingress',
        name: 'Ingress',
        component: () => import('@/views/kubernetes/deployment/index'),
        meta: { title: '负载均衡', icon: '' }
      },
      {
        path: 'cronjob',
        name: 'CronJob',
        component: () => import('@/views/kubernetes/deployment/index'),
        meta: { title: '定时任务', icon: '' }
      }
      // {
      //   path: 'prd',
      //   name: 'Prd',
      //   component: () => import('@/views/kubernetes/prd/index'),
      //   meta: { title: 'Prd', icon: 'el-icon-dessert' }
      // },
      // {
      //   path: 'old',
      //   name: 'Old',
      //   component: () => import('@/views/kubernetes/old/index'),
      //   meta: { title: 'Old', icon: 'el-icon-dessert' }
      // },
      // {
      //   path: 'struct',
      //   name: 'Struct',
      //   component: () => import('@/views/kubernetes/struct/index'),
      //   meta: { title: 'Struct', icon: 'el-icon-dessert' }
      // }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      },
      {
        path: 'expand',
        name: 'Expand',
        component: () => import('@/views/expand/index'),
        meta: { title: 'Expand', icon: 'el-icon-arrow-right' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
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

import Vue from 'vue'
import Router from 'vue-router'
import Cookies from "js-cookie"
import Login from '@/views/Login'
import Registe from '@/views/Registe'
import NotFound from '@/views/Error/404'
import Home from '@/views/Home'
import Intro from '@/views/Intro/Intro'
import Generator from '@/views/Generator/Generator'
/*import Member from '@/views/Sys/Member'
import MemberInfo from '@/views/Sys/MemberInfo'
import SensitiveWord from '@/views/Word/SensitiveWord'
import NewsArticle from '@/views/News/NewsArticle'

import NewsCategory from '@/views/News/NewsCategory'
import ResourceReport from '@/views/Resource/ResourceReport'
import ResourceList from '@/views/Resource/ResourceList'
import ResourceInfo from '@/views/Resource/ResourceInfo'
import AdvertList from '@/views/Advert/AdvertList'
import AdvertAdd from '@/views/Advert/AdvertAdd'*/
import PersonnelManagement from '@/views/Sys/PersonnelManagement'
import Member from '@/views/Sys/Member'
import MemberInfo from '@/views/Sys/MemberInfo'
import AdvertSource from '@/views/Advert/AdvertSource'
import AdvertSourceAdd from '@/views/Advert/AdvertSourceAdd'
import AdvertAdd from '@/views/Advert/AdvertAdd'
import ArticleAdd from '@/views/News/ArticleAdd'
import ResourceInfo from '@/views/Resource/ResourceInfo'
import api from '@/http/api'
import store from '@/store'

import utils from '@/assets/js/utils'

import { getIFramePath, getIFrameUrl } from '@/utils/iframe'

Vue.use(Router)

const white_url = ['/404','/registe'];

const router = new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home,
      children: [
        {
          path: '',
          name: '首页',
          component: Intro,
          meta: {
            icon: 'fa fa-home fa-lg',
            index: 0
          }
        }
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFound
    },
    {
      path: '/registe',
      name: '注册',
      component: Registe
    },
    {
      path: '/',
      name: '会员详情',
      component: Home,
      children: [{
        path: '/sys/memberInfo/:id',
        name: '会员详情',
        component: MemberInfo
      }]
    },
    {
      path: '/',
      name: '新增广告位',
      component: Home,
      children: [{
        path: '/advert/advertAdd/:id',
        name: '新增广告位',
        component: AdvertAdd
      }]
    },
    {
      path: '/',
      name: '广告素材管理',
      component: Home,
      children: [{
        path: '/advert/advertSource/:id',
        name: '广告素材管理',
        component: AdvertSource
      }]
    }
    ,{
      path: '/',
      name: '新增资讯',
      component: Home,
      children: [{
        path: '/news/articleAdd/:articleId',
        name: '新增资讯',
        component: ArticleAdd
      }]
    },
    {path: '/',
      name: '广告素材',
      component: Home,
      children: [{
        path: '/advert/advertSourceAdd/:adCodeId/:adSourceId/:isEdit',
        name: '广告素材',
        component: AdvertSourceAdd
      }]
    },
    {path: '/',
      name: '资源详情',
      component: Home,
      children: [{
        path: '/resource/ResourceInfo/:resourceId',
        name: '资源详情',
        component: ResourceInfo
      }]
    },
    {path: '/',
    name: 'PersonnelManagement',
    component: Home,
        children: [{
          path: '/sys/PersonnelManagement',
          name: '员工管理',
          component: PersonnelManagement
        }]
    },
  ]
})

router.beforeEach((to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let token =   localStorage.getItem('token');
  let userId = localStorage.getItem('id')
  if (to.path === '/login') {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if(token) {
      next({ path: '/' })
    } else {
      next()
    }
  } else {

    var isFilter = true;
    $.each(white_url,function(key, val){
        if(val == to.path){
          isFilter = false;
          return;
        }
    })

    if (!token && isFilter) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({ path: '/login' })
    } else {

      if(isFilter){
          // 加载动态菜单和路由
         addDynamicMenuAndRoutes(userId, to, from)
      }
      next()
    }
  }
})

/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes(userId, to, from) {

  // 处理IFrame嵌套页面
  handleIFrameUrl(to.path)

  if(store.state.app.menuRouteLoaded) {
    console.log('动态菜单和路由已经存在.')
    return
  }

  // 保存加载状态
  store.commit('menuRouteLoaded', true)

  utils.request.findNavTree({userid:userId}, function(response){
      var code = response.code;
      if(code == "0000"){
            //添加动态路由
            let dynamicRoutes = addDynamicRoutes(response.data)
            // 处理静态组件绑定路由
            handleStaticComponent(router, dynamicRoutes)
            router.addRoutes(router.options.routes)
            console.log(dynamicRoutes)
            // 保存菜单树
            store.commit('setNavTree', response.data)
      }else{
           // 保存加载状态
           store.commit('menuRouteLoaded', false)
      }
  });

   utils.request.findPermissions({userid:userId}, function(response){
      var code = response.code;
      if(code == "0000"){

        // 保存用户权限标识集合
        store.commit('setPerms', response.data)


      }
   });


}





/**
 * 处理路由到本地直接指定页面组件的情况
 * 比如'代码生成'是要求直接绑定到'Generator'页面组件
 */
function handleStaticComponent(router, dynamicRoutes) {
  for(let j=0;j<dynamicRoutes.length; j++) {
    if(dynamicRoutes[j].name == '代码生成') {
      dynamicRoutes[j].component = Generator
      break
    }
  }
  router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
}

/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(path) {
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  let url = path
  let length = store.state.iframe.iframeUrls.length
  for(let i=0; i<length; i++) {
    let iframe = store.state.iframe.iframeUrls[i]
    if(path != null && path.endsWith(iframe.path)) {
      url = iframe.url
      store.commit('setIFrameUrl', url)
      break
    }
  }
}

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes (menuList = [], routes = []) {
 var temp = []
 for (var i = 0; i < menuList.length; i++) {
   if (menuList[i].children && menuList[i].children.length >= 1) {
     temp = temp.concat(menuList[i].children)
   } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      // 创建路由配置
      var route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].name,
        meta: {
          icon: menuList[i].icon,
          index: menuList[i].id
        }
      }
      let path = getIFramePath(menuList[i].url)
      if (path) {
        // 如果是嵌套页面, 通过iframe展示
        route['path'] = path
        route['component'] = resolve => require([`@/views/IFrame/IFrame`], resolve)
        // 存储嵌套页面路由路径和访问URL
        let url = getIFrameUrl(menuList[i].url)
        let iFrameUrl = {'path':path, 'url':url}
        store.commit('addIFrameUrl', iFrameUrl)
      } else {
       try {
         // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
         // 如url="sys/user"，则组件路径应是"@/views/sys/user.vue",否则组件加载不到
         let array = menuList[i].url.split('/')
         let url = ''
         for(let i=0; i<array.length; i++) {
            url += array[i].substring(0,1).toUpperCase() + array[i].substring(1) + '/'
         }
         url = url.substring(0, url.length - 1)
         route['component'] = resolve => require([`@/views/${url}`], resolve)
       } catch (e) {}
     }
     routes.push(route)
   }
 }
 if (temp.length >= 1) {
   addDynamicRoutes(temp, routes)
 } else {
   //console.log('动态路由加载...')
   //console.log(routes)
   //console.log('动态路由加载完成.')
 }
 return routes
}

export default router

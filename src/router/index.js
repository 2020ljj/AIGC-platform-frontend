import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AdminView from '../views/AdminView.vue'
import RegisterView from '../views/RegisterView.vue'
import Layout from '../views/Layout.vue'
import FrontLayout from '../views/Front.vue'

Vue.use(VueRouter)

const routes = [
  {path: '/login',name: 'login',component: LoginView},
  {path: '/register',name: 'register',component: RegisterView},
  {
    path: '/front',
    name: 'front',
    component: FrontLayout,
    children: [
      { path: 'home', name: 'Home', meta: { name: '系统首页' }, component: () => import('../views/front/Home.vue') },
      { path: 'person', name: 'Person', meta: { name: '个人信息' }, component: () => import('../views/front/Person.vue') },
    ]
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children:[
      {path: '', name: 'home', component: HomeView},
      {path: 'admin',name: 'admin', component: AdminView},
      {path: 'tool',  name: 'tool',  component: () => import('../views/ToolView.vue')},
      {path: 'passage',  name: 'passage',  component: () => import('../views/PassageView.vue')}
      
    ]
  }
  

]

const router = new VueRouter({
  mode: 'history',
  routes
})
//路由守卫
router. beforeEach((to ,from, next) => {
  if (to.path ===' /login') {
  next();
  }
  const user = localStorage . getItem("user");
  if (!user && to.path !== '/login') {
  return next("/login");
  }
  next(); 
  })
  
export default router

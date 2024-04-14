import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios';
import qs from 'qs';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/global.css'
import "@/assets/css/front.css"; 
import "@/assets/css/iconfont/iconfont.css"; 
import request from '@/utils/request.js'
import E from "wangeditor"
import { setCookie, getCookie, checkCookie, clearCookie } from '@/utils/cookie';

Vue.prototype.$qs = qs;
Vue.prototype.$setCookie = setCookie;
Vue.prototype.$getCookie = getCookie;
Vue.prototype.$checkCookie = checkCookie;
Vue.prototype.$clearCookie = clearCookie;
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.request = request
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

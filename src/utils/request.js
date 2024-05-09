import axios from 'axios'
import {
    getCookie
} from '@/utils/cookie'
//创建一个axios对象出来
const request = axios.create({
    baseURL: 'http://localhost:8081' ,
    timeout: 20000
})
//request拦截器
//可以自请求发送前对请求做一些处理//比如统—加token，对请求参数统─加密
request.interceptors.request.use(config =>{
    config.headers ['Content-Type'] ='application/json;charset=utf-8';
    ///// let user = JSON.parse(localStorage.getItem('user') || '{}')  
    if (getCookie("satoken")) {
        config.headers['satoken']  = getCookie("satoken")
    }
    return config
}, error => {
        return Promise.reject(error)
});
    // response拦截器
    //可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
    // response.data即为后端返回的Result
        let res = response.data;
    //兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error =>{
        console.log('err' + error)  // for debug
        return Promise.reject(error)
    }
)

export default request
    
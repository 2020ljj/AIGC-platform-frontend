<template>
    <div class="container">
    <div style="width: 400px; padding: 30px; background-color: white; border-radius: 5px;">
      <div style="text-align: center; font-size: 20px; margin-bottom: 20px; color: #333">AIGC论坛后台登录</div>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入账号" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" show-password  v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%; background-color: #333; border-color: #333; color: white" @click="login">登 录</el-button>
        </el-form-item>
<!--        <div style="display: flex; align-items: center">-->
<!--          <div style="flex: 1"></div>-->
<!--          <div style="flex: 1; text-align: right">-->
<!--            还没有账号？请 <a href="/register">注册</a>-->
<!--          </div>-->
<!--        </div>-->
      </el-form>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request.js'

export default {
    name:'LoginView',
    data(){
        return{
            form: {
                username :'',
                password :''
            }
        }
    },
    created(){

    },
    methods: {
        login(){
            request.post('/user/login',this.form).then(res =>{
                if(res.code == '20000'){
                    this.$setCookie("satoken",res.data.token);
                    localStorage.setItem("user",JSON.stringify(res.data));
                    this.$message({
                        message: '登录成功',
                        type: 'success'
                    });
                    this.$router.push("/")
                }else{
                    this.$message({
                        message: res.message,
                        type: 'error'
                    });
                }
            })
        }
    }
}
</script>
<style scoped>
.container {
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/imgs/bg.jpg");
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
a {
  color: #2a60c9;
}
</style>
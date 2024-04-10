<template>
    <div>
      <el-container>
      <el-header style = "background-color: #4c535a">
        <img src="@/assets/logo.png" alt="" style="width: 40px; position: relative; top: 10px ; ">
        <span style="font-size: 28px; margin-left: 15px; color: white">AIGC论坛后台管理</span>
        <el-dropdown style="float: right; height: 60px; line-height: 60px;">
          <span class="el-dropdown-link" style = "font-size: 16px">
            {{ user.nickname }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div style="text-decoration: none" @click="logout">注销</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
    </el-container>
    <el-container>
      <el-aside style = "overflow: hidden; min-height: 100vh; background-color: #545c64; width: 250px">
        <el-menu default-active="$route.path" router class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span>系统首页</span>
        </el-menu-item>

        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index = "/admin">管理员信息</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="3">
          <template slot="title">
          <i class="el-icon-setting"></i>
          <span>工具管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index = "/tool">工具信息</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="4">
          <template slot="title">
          <i class="el-icon-setting"></i>
          <span>内容管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index = "/passage">文章信息</el-menu-item>
            <el-menu-item index = "4-2">评论信息</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
    
    
    </div>
</template>
<script>
export default{
  data(){
    return{
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },
  methods:{
      logout(){
        localStorage.removeItem("user");
        this.$router.push("/login");
      }
    }
}
</script>
<style>
 .el-menu{
  border-right: none !important;
 }
 .el-dropdown-link {
    cursor: pointer;
    color: white;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
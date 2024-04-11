<template>
  <div>
    <div class="front-notice"><i class="el-icon-bell" style="margin-right: 2px"></i>公告：{{ top }}</div>
    <!--头部-->
    <div class="front-header">
      <div class="front-header-left">
        <img src="@/assets/imgs/logo.png" alt="">
        <div class="title">AICG交流服务平台</div>
      </div>
      <div class="front-header-center">
        <div class="front-header-nav">
          <el-menu :default-active="$route.path" mode="horizontal" router>
						<el-menu-item index="/front/home">首页</el-menu-item>
            <!-- <el-menu-item index="/front/insight">发现</el-menu-item>
						<el-menu-item index="/front/tool">工具</el-menu-item>
            <el-menu-item index="/front/resource">资源</el-menu-item> -->
            <el-menu-item index="/front/person">个人中心</el-menu-item>
          </el-menu>
        </div>
      </div>
      <div>
      <el-input placeholder="请输入关键字搜索" v-model="input" class="input-with-select">
        <el-select v-model="select" slot="prepend" placeholder="请选择" >
          <el-option label="文章" value="passage"></el-option>
          <el-option label="工具" value="tool"></el-option>
          <el-option label="用户" value="user"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      </div>
      <div class="front-header-right">
        <div v-if="!user.nickname">
          <el-button @click="$router.push('/login')">登录</el-button>
          <el-button @click="$router.push('/register')">注册</el-button>
        </div>
        <div v-else>
          <el-dropdown>
            <div class="front-header-dropdown">
              <img :src="user.avatar" alt="">
              <div style="margin-left: 10px">
                <span>{{ user.nickname }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div style="text-decoration: none" @click="logout">注销</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!--主体-->
    <div class="main-body">
      <router-view ref="child" @update:user="updateUser" />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {
  name: 'Front',
  data () {
    return {
      top: '',
      notice: [],
      user: JSON.parse(localStorage.getItem("user") || '{}'),
      form: {},
      select:'passage',
      input:''
    }
  },

  mounted() {
    // this.loadNotice()
  },
  methods: {
    loadNotice() {
      request.get('/notice/selectAll').then(res => {
        this.notice = res.data
        let i = 0
        if (this.notice && this.notice.length) {
          this.top = this.notice[0].content
          setInterval(() => {
            this.top = this.notice[i].content
            i++
            if (i === this.notice.length) {
              i = 0
            }
          }, 2500)
        }
      })
    },
    updateUser() {
      this.user = JSON.parse(localStorage.getItem('user') || '{}')   // 重新获取下用户的最新信息
    },
    // 退出登录
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  }

}
</script>

<style scoped>
@import "@/assets/css/front.css";
</style>
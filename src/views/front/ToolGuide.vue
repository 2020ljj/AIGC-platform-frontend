<template>
    <div class="main-content">
      
      <div style="display: flex; align-items: flex-start; grid-gap: 10px">
      
        <div style="width: 150px;" class="card">
        <div class="category-item" :class="{ 'category-item-active': item === current }"
             v-for="(item , index) in categoryList" :key="index" @click="setLabel(item)">{{ item }}</div>
      </div>

        <div style="flex: 1;" class="card">
          <div style="margin-left: 10px; margin-top: 20px">
          <el-row>
          <div>
            <el-col :span="5" v-for="item in tableData" :key="item.toolId" style = "background-color: white; margin: 10px 5px 0 5px">
              <a :href="'/toolDetail?toolId=' + item.toolId" target="_blank">
                <img :src="'http://localhost:8081/cover/' + item.cover" alt="" style="width:100%; height:200px ;border-radius:10px ; border: #cccccc 1px solid">
              </a>
            <div style="margin-top: 10px; font-weight: 500; font-size: 16px; width: 160pX; color:#000000FF"> {{ item.name }}</div>
            <div class="line1" style="font-size: 16px; color: #666; margin-bottom: 10px;" v-html="item.introduction" ></div>
            <div style="color: rgb(96, 145, 188); font-size: 15px;">{{ item.label }}</div>
            <el-divider></el-divider>
            <span style="color: #666; margin-right: 20px"><i class="el-icon-people"></i> {{ item.nickname }}</span>
            </el-col>
          </div>
          </el-row> 
          </div>
        </div>
      </div >
      </div>
  </template>
  
  <script>
  import request from '@/utils/request.js'
  export default {
    name: 'toolGuide',
    data() {
      return{
        current: '全部工具',  //当前选中的分类名称
        categoryList: ['AI工具','AI对话','AI写作','AI办公','AI绘画','AI设计','AI音频','AI视频','AI 3D','AI游戏','AI SEO','AI数据','AI编程','AI教育','AI HR','AI法律','AI商业','AI金融','AI提示','AI邮件','AI释义','AI其他'],
        tableData:[],
        total:'',
        queryParam:{}
      }
      
    }
  ,
  watch: {
    $route: {
      immediate: true, // 一旦监听到路由的变化立即执行
      handler (to, from) {
        if (typeof this.$route.query.queryParam !== 'undefined') {
        this.queryParam = this.$route.query.queryParam;
        this.queryTool()
      } else {
        this.queryParam = null; 
      }
      }
    },
  },
    created() {
      this.queryTool();
    },
    methods: {
      setLabel(labelName){
        this.current = labelName
        this.currentPage = 1
        this.queryTool()
      },
      queryTool(){
        const params = new URLSearchParams();
        if(this.queryParam !== null){
          params.append('name',this.queryParam)
          params.append('label',this.queryParam)
        }else if(this.current !== null && this.current !== '全部工具'){
          params.append('label',this.current)
        }
        request.get('/tool/page', {
          params: params
        }).then(res =>{
           if(res.code === 20000){
               this.tableData = res.data.page.records;
               this.total = res.data.page.total;
           }else{
           }
      })}
    }
}
  </script>
  
  <style scoped>
.el-col-5{
  width:20%;
  max-width: 20%;
  padding: 10px 10px;
}
.line1 {
 /* white-space: nowrap;  */

  display:-webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
  
  </style>
<template>
    <div class="container">
      <div class="ai-title">AIGC交流服务平台</div>
      <div>分享全球AI产品资源，探索前沿资讯，共享创新成果。懂Ai，用Ai，用好Ai</div>
      <div style="margin-top: 15px;" class="search-box">
        <el-input placeholder="输入关键词搜索" v-model="queryParam" class="input-with-select" style="height: 40px;">
          <el-select v-model="select" slot="prepend" placeholder="请选择" >
            <el-option label="文章" value="passage"></el-option>
          <el-option label="工具" value="tool"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
        </el-input>
      </div >
      <div class="flex-container">
       <div style="margin-right: 200px;">
        <ChatGpt></ChatGpt>
       </div>
        <AIImage></AIImage>
      </div>
    </div>
  </template>


  <script>
  import request from '@/utils/request.js'
  import ChatGpt from './ChatGpt.vue'
  import AIImage from './AIImage.vue'
  export default {
    name: 'Home',
    components:{
        ChatGpt,
        AIImage
    },
    data(){
      return{
        select:'passage',
        queryParam:''
      }
    },
    methods:{
      search(){
      if(this.select === 'passage'){
        this.$router.push({
					name: 'PassageGuide',
					query: {
            queryParam: this.queryParam
          }
				})
      }else if(this.select === 'tool'){
        this.$router.push({
					name: 'toolGuide',
					query: {
            queryParam: this.queryParam
          }
				})
      }else if(this.select === 'user'){

      }
    }
    }
  }
  </script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh; /* 降低容器高度 */
}
.ai-title {
  font-size: 60px; 
  /* font-weight: bold;  */
  margin-bottom: 150px;
}
.search-box {
  margin-top: 18px; /* 调整上边距 */
  width: 800px; /* 调整宽度 */
  height: 100px; /* 增加搜索框高度 */
}
.el-input-group{
  width: 800px !important;
  }
.flex-container {
  display: flex; 
  justify-content: space-around; /* 左右排列，并且中间间隔均匀 */
  align-items: flex-start; /* 如果需要垂直居中则使用center */
}
</style>

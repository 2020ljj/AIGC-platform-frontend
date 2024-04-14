<template>
  <div class="main-content">
    <div style="display: flex; align-items: flex-start; grid-gap: 10px">

      <div style="width: 150px;" class="card">
        <div class="category-item" :class="{ 'category-item-active': item === current }"
             v-for="(item , index) in categoryList" :key="index" @click="setLabel(item)">{{ item }}</div>
      </div>

      <div style="flex: 1;" class="card">

        <div class="blog-box" v-for="item in tableData" :key="item.id" v-if="total > 0" style="display: flex ; padding: 15px 0;">
          <div style="flex: 1; width: 0">
            <a :href="'/passageDetail?passageId=' + item.passageId" target="_blank"><div class="blog-title">{{ item.title }}</div></a>
            <div class="line1" style="font-size: 16px; color: #666; margin-bottom: 10px;">{{ item.content }}</div>
            <div style="display: flex">
              <div style="flex: 1;">
                <span style="color: #666; margin-right: 20px"><i class="el-icon-people"></i> {{ item.nickname }}</span>
                <span style="color: #666; margin-right: 20px"><i class="el-icon-star-on"></i> {{ item.collectionAmount }}</span>
                <span style="color: #666"><i class="el-icon-appreciate"></i> {{ item.likeAmount }}</span>
              </div>
              <div style="width: fit-content">
                <el-tag v-for="item in item.label.split('/')"  :key="item" type="primary" style="margin-right:5px">{{ item }}</el-tag>

              </div>
            </div>
          </div>
          <div style="width: 180px">
            <img style="width: 100%; height: 120px; border-radius: 5px" :src="'http://localhost:8081/cover/' + item.cover" alt="">
          </div>
        </div>
        <div v-if="total === 0" style="padding: 20px 0; text-align: center; font-size: 16px; color: #666">暂无数据</div>

        <div style="margin-top: 10px" v-if="total">
          <el-pagination
              background
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 20]"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="total">
          </el-pagination>
        </div>

      </div>

      <div style="width: 260px;" class="card">
        <div class="card" style="margin-bottom: 10px">
          <div style="display: flex; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #ddd">
            <div style="font-size: 20px; flex: 1">快讯</div>
            <div style="font-size: 12px; color: #666; cursor: pointer;" @click="refreshTop"><i class="el-icon-refresh"></i> 换一换</div>
          </div>
          <div>
            <div v-for="item in showList" :key="item.id" style="margin: 15px 0; " class="line1">
                  <span style="width: 18px; display: inline-block; text-align: right; margin-right: 10px">
                    <span style="color: orangered" v-if="item.index === 1">{{ item.index }}</span>
                    <span style="color: goldenrod" v-else-if="item.index === 2">{{ item.index }}</span>
                    <span style="color: dodgerblue" v-else-if="item.index === 3">{{ item.index }}</span>
                    <span style="color: #666" v-else>{{ item.index }}</span>
                  </span>
                  <span>{{ item.title }}</span>
              <div style="display: flex; font-size : 13px; color: rgb(190,193,197);">
                <span style="margin-right: 50px">{{ item.label }}</span>
                <span> 作者: {{ item.nickname }}</span>
              </div>

              
            </div>
          </div>
        </div>
      </div>

    </div>
    
  </div>
</template>

<script>
import request from '@/utils/request.js'
export default {

  name: 'Home',
  data() {
    return {
      current: '全部博客',  //当前选中的分类名称
      categoryList: ['AI资讯','AI教程'],
      tableData: [],  // 所有的数据
      currentPage: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
      topList: [],
      showList: [],
      lastIndex: 0,
      tagsArr:[]
    }
  },
  created() {
    this.queryPassage()
    this.refreshTop()
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    setLabel(labelName) {
      this.current = labelName
      this.currentPage = 1
      this.queryPassage()
    },
    queryPassage() {
      const params = new URLSearchParams();
      if(this.current !==null && this.current !== '全部博客')
            params.append('label',this.current)
      params.append('currentPage',this.currentPage)
      params.append('pageSize',this.pageSize)
      request.get('/passage/page', {
        params: params
      }).then(res =>{
         if(res.code === 20000){
             this.tableData = res.data.page.records;
             this.total = res.data.page.total;
         }else{
         }
      })
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.queryPassage()
    },
    refreshTop() {
      request.get('/passage/recent').then(res => {
        this.topList = res.data.page || [];
        let i = 1;
        this.topList.forEach(item => item.index = i++);
      
        // 0  5  0
        if (this.lastIndex === 20) {
          this.lastIndex = 0;
        }
        this.showList = this.topList.slice(this.lastIndex, this.lastIndex+5);  // 0-5   5- 10  // 0-5
        this.lastIndex += 5;  // 5  10  5
  })
},
  }
}
</script>

<style>
.category-item {
  text-align: center;
  padding: 10px 0;
  font-size: 16px;
  cursor: pointer;
}
.category-item-active {
  background-color: #1890ff;
  color: #fff;
  border-radius: 5px;
}
.line1 {
 /* white-space: nowrap;  */

  display:-webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;
  
  overflow: hidden;
  text-overflow: ellipsis;
}
.blog-box {
  display: flex;
  grid-gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}
.blog-box:first-child {
  padding-top: 0;
}
.blog-title {
  font-size: 18px; 
  font-weight: bold; 
  margin-bottom: 10px;
  cursor: pointer;
}
a {
 color: #333;
}
</style>

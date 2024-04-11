<template>
  <div class="main-content">
    <div style="display: flex; align-items: flex-start; grid-gap: 10px">

      <div style="width: 150px" class="card">
        <div class="category-item" :class="{ 'category-item-active': item === current }"
             v-for="(item , index) in categoryList" :key="index" @click="setLabel(item)">{{ item }}</div>
      </div>

      <div style="flex: 1" class="card">

        <div class="blog-box" v-for="item in tableData" :key="item.id" v-if="total > 0">
          <div style="flex: 1; width: 0">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px">{{ item.title }}</div>
            <div class="line1" style="color: #666; margin-bottom: 10px; font-size: 13px">{{ item.descr }}</div>
            <div style="display: flex">
              <div style="flex: 1; font-size: 13px">
                <span style="color: #666; margin-right: 20px"><i class="el-icon-people"></i> {{ item.userId }}</span>
                <span style="color: #666; margin-right: 20px"><i class="el-icon-star-on"></i> {{ item.collectionAmount }}</span>
                <span style="color: #666"><i class="el-icon-appreciate"></i> {{ item.likeAmount }}</span>
              </div>
              <div style="width: fit-content">
                <el-tag type="primary" style="margin-right: 10px">后端</el-tag>
                <el-tag type="primary">面试</el-tag>
              </div>
            </div>
          </div>
          <div style="width: 150px">
            <img style="width: 100%; height: 80px; border-radius: 5px" :src="item.cover" alt="">
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

      <div style="width: 260px" class="card"></div>

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
    }
  },
  created() {
    this.queryPassage()
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
            params.append('label',this.current,)
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
  white-space: nowrap;
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
</style>

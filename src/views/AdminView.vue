<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-input  style="width: 800px;" placeholder="请输入内容" v-model="input" class="input-with-select">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="用户名" value='username'></el-option>
          <el-option label="昵称" value= 'nickname'></el-option>
          <el-option label="性别" value= 'gender'></el-option>
          <el-option label="用户权限" value= 'permission'></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="queryUser()">查询</el-button>
        
      </el-input>
      
    </div>
    <div style="margin-bottom: 40px;">
      <el-table :data="tableData" style="width: 100%">
        <!-- <el-table-column prop="userId" label="用户Id" width="180"></el-table-column> -->
        <el-table-column label="头像" width="100">
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
              <el-image style="width: 40px; height: 40px; border-radius: 50%" v-if="scope.row.avatar"
                        :src="'http://localhost:8081/avatar/' + scope.row.avatar" :preview-src-list="[scope.row.avatar]"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="130"></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="130"></el-table-column>
        <el-table-column prop="gender" label="性别" width="80"></el-table-column>
        <el-table-column prop="permission" label="权限等级" width="80"></el-table-column>
        <el-table-column prop="followerAmount" label="粉丝" width="80"></el-table-column>
        <el-table-column prop="signature" label="签名" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="passageAmount" label="文章数" width="80"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>

        <el-table-column label="操作">
          <template  slot-scope="scope">
          <el-dropdown>
          <el-button type="danger" style="margin-left: 10px" @click = deleteTool(scope.row.toolId)>封禁用户<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>封禁三天</el-dropdown-item>
              <el-dropdown-item>封禁七天</el-dropdown-item>
              <el-dropdown-item>永远封禁</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-button type="success" style="margin-left: 10px">解封</el-button>
        </template>
        </el-table-column>

      </el-table>
    </div>
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 400]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </div>
</template>

<script>
import request from '@/utils/request.js'
    export default {
      data() {
        return {
          tableData: [],
          select: '',
          input:'',
          currentPage: 1,
          pageSize: 10,
          total: 0,
          form:{}
        }
      },
      //页面加载的时候，做一些事情
      created(){
        this.queryUser();
      },
      methods:{
        load() {
            request.get("/user/page").then(res => {
              if(res.code !== '20000'){
                  this.tableData = res.data.page.records;
              }else{

              }
            })
        },
        queryUser(){
          const params = new URLSearchParams();
          params.append(this.select,this.input)
          params.append('currentPage',this.currentPage)
          params.append('pageSize',this.pageSize)
          request.get(
            '/user/page', 
            {params: params}).
                then( res =>{
                  if(res.code !== '20000'){
                    this.tableData = res.data.page.records;
                    this.total = res.data.page.total;
                  }else{
                      console.log('error')
                  }
          })
        },
        handleSizeChange(pageSize){
            this.pageSize = pageSize
            this.queryUser()
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage
            this.queryUser()
        }
      }
    }
  </script>

<style>
.el-select{
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
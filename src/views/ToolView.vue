<template>
    <div>
        <div style="margin-bottom: 20px;">
          <el-input  style="width: 800px;" placeholder="请输入内容" v-model="input" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="上传用户" value='userId'></el-option>
              <el-option label="名称" value= 'name'></el-option>
              <el-option label="标签" value= 'label'></el-option>
              <el-option label="评分" value= 'rate'></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="queryTool()">查询</el-button>
          </el-input>
          <el-button type="success" style="margin-left: 10px;" @click = "addTool()">新增</el-button>
        </div>
        <div style="margin-bottom: 40px;">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="toolId" label="工具Id" width="180"></el-table-column>
          <el-table-column prop="userId" label="上传用户Id" width="180"></el-table-column>
          <el-table-column prop="name" label="名称" width="130"></el-table-column>
          <el-table-column prop="introduction" label="介绍" width="250" show-overflow-tooltip></el-table-column>
          <el-table-column prop="link" label="链接" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="label" label="标签" width="80"></el-table-column>
          <el-table-column prop="rate" label="评分" width="80"></el-table-column>
          <el-table-column prop="commentAmount" label="评论数量" width="80"></el-table-column>
          <el-table-column prop="createTime" label="上传时间" width="180"></el-table-column>  
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" @click="editTool(scope.row)">编辑</el-button>
                <el-popconfirm title="这确定删除吗？" @confirm = "deleteTool(scope.row.toolId)">
                <el-button slot="reference" type = "danger" style="margin-left: 10px">删除</el-button>
                </el-popconfirm>            
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
        <div>
            <el-dialog title="新增AIGC工具" :visible.sync="dialogFormVisible1" width="30%">
                <el-form :model="form">
                  <el-form-item label="名称" label-width="15%">
                    <el-input v-model="form.name" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="介绍" label-width="15%">
                    <el-input v-model="form.introduction" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="链接" label-width="15%">
                    <el-input v-model="form.link" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="标签" label-width="15%">
                    <el-input v-model="form.label" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="活动区域" label-width="15%">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                  <el-button type="primary" @click="submitAdd()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-dialog title="修改AIGC工具信息" :visible.sync="dialogFormVisible2" width="30%">
                <el-form :model="form">
                  <el-form-item label="名称" label-width="15%">
                    <el-input v-model="form.name" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="介绍" label-width="15%">
                    <el-input v-model="form.introduction" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="链接" label-width="15%">
                    <el-input v-model="form.link" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="标签" label-width="15%">
                    <el-input v-model="form.label" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="活动区域" label-width="15%">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible2 = false">取 消</el-button>
                  <el-button type="primary" @click="submitModify()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
  
<style>
  .el-select{
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
  <script>
import request from '@/utils/request.js'
  export default {
    data(){
        return {
            tableData: [],
            select: '',
            input:'',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            dialogFormVisible1:false,
            dialogFormVisible2:false,
            form:{}
        }
    },
    created(){
            this.queryTool();
        },
    methods: {
        queryTool(){
            const params = new URLSearchParams();
            params.append(this.select,this.input)
            params.append('currentPage',this.currentPage)
            params.append('pageSize',this.pageSize)
            request.get(
              '/tool/page', 
                {params: params}).
            then( res =>{
                if(res.code === 20000){
                    this.tableData = res.data.page.records;
                    this.total = res.data.page.total;
                }else{

                }
            })
        },
        addTool(){
            this.form = {};
            this.dialogFormVisible1 = true;
        },
        editTool(obj){
            this.$delete(obj, 'createTime');
            this.$delete(obj, 'updateTime');
            this.$delete(obj, 'commentAmount');
            this.$delete(obj, 'rate');
            this.$delete(obj, 'userId');
            this.form = obj;
            this.dialogFormVisible2 = true;
        },
        deleteTool(id){
            request.delete('/tool/' + id).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '删除工具成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        submitAdd(){
            this.dialogFormVisible1 = false
            request.post('/tool/upload',this.form).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '新增工具成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        submitModify(){
            this.dialogFormVisible2 = false
            request.put('/tool/upload',this.form).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '修改工具成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        handleSizeChange(pageSize){
            this.pageSize = pageSize
            this.queryTool()
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage
            this.queryTool()
        }
    }
  }
  </script>
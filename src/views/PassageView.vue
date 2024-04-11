<template>
    <div>
        <div style="margin-bottom: 20px;">
          <el-input  style="width: 800px;" placeholder="请输入内容" v-model="input" class="input-with-select">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="上传用户" value='userId'></el-option>
              <el-option label="标题" value= 'title'></el-option>
              <el-option label="内容" value= 'content'></el-option>
              <el-option label="标签" value= 'label'></el-option>
              <el-option label=">=点赞数" value= 'likeAmount'></el-option>
              <el-option label=">=评论数" value= 'commentAmount'></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="queryPassage()">查询</el-button>
          </el-input>
          <el-button type="success" style="margin-left: 10px;" @click = "addPassage()">新增</el-button>
        </div>
        <div style="margin-bottom: 40px;">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="passageId" label="文章Id" width="180"></el-table-column>
          <el-table-column prop="userId" label="上传用户Id" width="180"></el-table-column>
          <el-table-column prop="title" label="标题" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="label" label="标签" width="130"></el-table-column>
          <el-table-column prop="content" label="内容" width="250" show-overflow-tooltip></el-table-column>
          <el-table-column prop="isCited" label="是否引用" width="80" ></el-table-column>
          <el-table-column prop="commentAmount" label="点赞数" width="80"></el-table-column>
          <el-table-column prop="collectionAmount" label="收藏数" width="80"></el-table-column>  
          <el-table-column prop="likeAmount" label="评论数" width="80"></el-table-column>  
          <el-table-column prop="createTime" label="上传时间" width="180"></el-table-column>  
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" @click="editPassage(scope.row)">编辑</el-button>
                <el-popconfirm title="这确定删除吗？" @confirm = "deletePassage(scope.row.passageId)">
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
            <el-dialog title="新增文章" :visible.sync="dialogFormVisible1" width="30%">
                <el-form :model="form">
                  <el-form-item label="标题" label-width="15%">
                    <el-input v-model="form.title" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="内容" label-width="15%">
                    <el-input v-model="form.content" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="标签" label-width="15%">
                    <el-select v-model="form.label" placeholder="请选择标签">
                      <el-option label="AI资讯" value="AI资讯"></el-option>
                      <el-option label="AI教程" value="AI教程"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否引用" label-width="15%">
                      <el-radio-group v-model="form.isCited">
                        <el-radio :label=1>是</el-radio>
                        <el-radio :label=0>否</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="参考文献" label-width="15%">
                      <el-input type="textarea" v-model="form.referenceSource"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                  <el-button type="primary" @click="submitAdd()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <el-dialog title="修改文章信息" :visible.sync="dialogFormVisible2" width="30%">
                <el-form :model="form">
                  <el-form-item label="标题" label-width="15%">
                    <el-input v-model="form.title" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="内容" label-width="15%">
                    <el-input v-model="form.content" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="标签" label-width="15%">
                    <el-select v-model="form.label" placeholder="请选择标签">
                      <el-option label="AI资讯" value="AI资讯"></el-option>
                      <el-option label="AI教程" value="AI教程"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="参考文献" label-width="15%">
                      <el-input type="textarea" v-model="form.referenceSource"></el-input>
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
            this.queryPassage();
        },
    methods: {
        queryPassage(){
            const params = new URLSearchParams();
            params.append(this.select,this.input)
            params.append('currentPage',this.currentPage)
            params.append('pageSize',this.pageSize)
            request.get(
              '/passage/page', 
                {params: params}).
            then( res =>{
                if(res.code == '20000'){
                    this.tableData = res.data.page.records;
                    this.total = res.data.page.total;
                }else{

                }
            })
        },
        addPassage(){
            this.form = {};
            this.dialogFormVisible1 = true;
        },
        editPassage(obj){
            this.form = obj;
            this.dialogFormVisible2 = true;
        },
        deletePassage(id){
            request.delete('/passage/' + id).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '删除文章成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        submitAdd(){
            this.dialogFormVisible1 = false
            request.post('/passage/upload',this.form).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '新增文章成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        submitModify(){
            let obj = {
              "passageId" : this.form.passageId,
              "title": this.form.title,
              "content" : this.form.content,
              "label": this.form.label, 
              "referenceSource": this.form.referenceSource
          }
          console.log(JSON.stringify(obj));
            this.dialogFormVisible2 = false
            request.put('/passage/upload',obj).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '修改文章成功',
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
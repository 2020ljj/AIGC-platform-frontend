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
          <!-- <el-table-column prop="passageId" label="文章Id" width="180"></el-table-column> -->
          <el-table-column label="封面" width="100">
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
              <el-image style="width: 40px; height: 40px;" v-if="scope.row.cover"
                        :src="'http://localhost:8081/cover/' + scope.row.cover" :preview-src-list="[scope.row.cover]"></el-image>
            </div>
          </template>
        </el-table-column>
          <el-table-column prop="name" label="名字" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="nickname" label="作者昵称" width="100"></el-table-column>
          <el-table-column prop="label" label="标签" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="introduction" label="介绍" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="rate" label="评分" width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="link" label="链接" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="上传时间" width="100"></el-table-column>  
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
            <el-dialog title="新增工具" :visible.sync="dialogFormVisible1" width="50%" destory-on-close>
                <el-form :model="form">
                  <el-form-item label="名字" label-width="15%">
                    <el-input v-model="form.name" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="封面" prop="cover" label-width="15%">
                    <el-upload
                        :action="'http://localhost:8081/tool/cover'"
                        name="avatarFile"
                        :with-credentials="true"
                        list-type="picture"
                        :on-success="handleCoverSuccess"
                    >
                      <el-button type="primary">上传封面</el-button>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="标签" prop="tags" label-width="15%">
                     <el-select v-model="labelsArr" multiple filterable allow-create default-first-option style="width: 100%">
                       <el-option value="AI教程"></el-option>
                       <el-option value="AI资讯"></el-option>
                       <el-option value="AI音乐"></el-option>
                       <el-option value="AI商业"></el-option>
                       <el-option value="AI办公"></el-option>
                       <el-option value="AI SEO"></el-option>
                       <el-option value="AI视频"></el-option>
                       <el-option value="AI其他"></el-option>
                       <el-option value="AI写作"></el-option>
                     </el-select>
                    </el-form-item>
                    <el-form-item label="链接" label-width="15%">
                      <el-input type="textarea" v-model="form.link"></el-input>
                  </el-form-item>
                  <el-form-item label="介绍" label-width="15%">
                    <div id="editor"></div>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible1 = false">取 消</el-button>
                  <el-button type="primary" @click="save()">确 定</el-button>
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
import E from "wangeditor"
import hljs from 'highlight.js'
import { getCookie } from '@/utils/cookie'
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
            form:{} ,
            labelsArr:[],
            editor: null
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
            this.labelsArr = []
            this.dialogFormVisible1 = true;
            this.setRichText();
            this.editor.txt.clear()  //清空富文本的内容
        },
        editTool(obj){
            this.$delete(obj, 'nickname');
            this.form = JSON.parse(JSON.stringify(obj)) 
            this.labelsArr = obj.label.split('/');
            this.dialogFormVisible1 = true;
            this.setRichText()
            setTimeout(() => {
                this.editor.txt.html(this.form.introduction)
            }, 0)
        },
        deleteTool(id){
            request.delete('/tool/' + id).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '删除工具成功',
                        type: 'success'
                    });
                    this.queryTool()
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        save(){
            this.dialogFormVisible1 = false
            this.form.label = this.labelsArr.join("/");
            this.form.introduction = this.editor.txt.html();
            if(!this.form.toolId){ //无工具id，新增工具
              request.post('/tool/upload',this.form).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '新增工具成功',
                        type: 'success'
                    });
                    this.queryTool()
                }else{
                    this.$message.error(res.message);
                }
              })
            }else{
              request.put('/tool/upload',this.form).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '修改工具成功',
                        type: 'success'
                    });
                    this.queryTool()
                }else{
                    this.$message.error(res.message);
                }
            })
            }
            
        },
        handleSizeChange(pageSize){
            this.pageSize = pageSize
            this.queryTool()
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage
            this.queryTool()
        },
        handleCoverSuccess(res) {
            this.form.cover = res.data.cover
        },
        setRichText() {
            this.$nextTick(() => {
            this.editor = new E(`#editor`)
            this.editor.highlight = hljs
            this.editor.config.uploadImgServer = 'http://localhost:8081/files/editor/upload'
            this.editor.config.uploadFileName = 'file'

            this.editor.config.uploadImgHeaders = {
              'satoken'  : getCookie("satoken")
            }
            
            this.editor.config.uploadImgParams = {
              type: 'img',
            }
            this.editor.create()  // 创建
        })
      },
    }
  }
  </script>
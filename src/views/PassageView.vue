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
          <!-- <el-table-column prop="passageId" label="文章Id" width="180"></el-table-column> -->
          <el-table-column label="封面" width="100">
          <template v-slot="scope">
            <div style="display: flex; align-items: center">
              <el-image style="width: 40px; height: 40px;" v-if="scope.row.cover"
                        :src="'http://localhost:8081/cover/' + scope.row.cover" :preview-src-list="[scope.row.cover]"></el-image>
            </div>
          </template>
        </el-table-column>
          <el-table-column prop="title" label="标题" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="nickname" label="作者昵称" width="130"></el-table-column>

          <el-table-column prop="label" label="标签" width="130" show-overflow-tooltip></el-table-column>

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
            <el-dialog title="新增文章" :visible.sync="dialogFormVisible1" width="50%" destory-on-close>
                <el-form :model="form">
                  <el-form-item label="标题" label-width="15%">
                    <el-input v-model="form.title" autocomplete="off" style="width: 90%;"></el-input>
                  </el-form-item>
                  <el-form-item label="封面" prop="cover" label-width="15%">
                    <el-upload
                        :action="'http://localhost:8081/passage/cover'"
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
                  <el-form-item label="是否引用" label-width="15%">
                      <el-radio-group v-model="form.isCited">
                        <el-radio :label=1>是</el-radio>
                        <el-radio :label=0>否</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="参考文献" label-width="15%">
                      <el-input type="textarea" v-model="form.referenceSource"></el-input>
                  </el-form-item>
                  <el-form-item label="内容" label-width="15%">
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
            this.queryPassage();
            // this.setRichText();
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
            this.labelsArr = []
            this.setRichText();
            this.editor.txt.clear()  //清空富文本的内容
            this.dialogFormVisible1 = true;
        },
        editPassage(obj){
            this.$delete(obj, 'nickname');
            this.form = JSON.parse(JSON.stringify(obj)) 
            this.labelsArr = obj.label.split('/');
            this.dialogFormVisible1 = true;
            this.setRichText()
            setTimeout(() => {
                this.editor.txt.html(this.form.content)
            }, 0)
        },
        deletePassage(id){
            request.delete('/passage/' + id).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '删除文章成功',
                        type: 'success'
                    });
                    this.queryPassage();
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        save(){
            this.dialogFormVisible1 = false
            this.form.label = this.labelsArr.join("/");
            this.form.content = this.editor.txt.html();
            if(!this.form.passageId){ //无文章id，新增文章
              request.post('/passage/upload',this.form).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '新增文章成功',
                        type: 'success'
                    });
                    this.queryPassage();
                }else{
                    this.$message.error(res.message);
                }
            })
            }else{
              request.put('/passage/upload',this.form).then(res =>{
                if(res.code === 20000){
                    this.$message({
                        message: '修改文章成功',
                        type: 'success'
                    });
                    this.queryPassage();
                }else{
                    this.$message.error(res.message);
                }
            })
            }
        },
        handleSizeChange(pageSize){
            this.pageSize = pageSize
            this.queryPassage();
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage
            this.queryPassage();
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
<template>
    <!--  评论开始  -->
    <div class="card">
      <h2 style="margin-bottom: 20px">{{ commentCount }} 条回复</h2>
  
      <div style="margin-bottom: 20px">
        <el-input type="textarea" placeholder="请输入评论内容" v-model="commentContent"></el-input>
        <div style="text-align: right; margin-top: 5px">
          <el-button type="primary" @click="addComment">评 论</el-button>
        </div>
      </div>
  
      <div>
        <div style="display: flex; grid-gap: 20px; margin-bottom: 20px" v-for="item in commentList" :key="item.id">
          <img :src="'http://localhost:8081/avatar/' + item.avatar" alt="" style="width: 50px; height: 50px; border-radius: 50%">
          <div style="flex: 1">
            <!--                这是第一级评论-->
            <div style="margin-bottom: 10px">
              <div style="color: #666; margin-bottom: 10px">{{ item.nickname }}</div>
              <div style="color: #444; margin-bottom: 10px">{{ item.content }}</div>
              <div style="color: #888; font-size: 13px; margin-bottom: 10px"><span style="margin-right: 20px">{{ item.createTime }}</span>
                <span style="cursor: pointer;" :class="{ 'comment-active' : item.showReplyInput }" @click="handleShowReplyInput(item)"><i class="el-icon-s-comment"></i>评论</span>
                <span style="margin-left: 20px; cursor: pointer" @click="del(item.commentId,1)" v-if="item.userId === user.userId"><i class="el-icon-delete"></i>删除</span>
              </div>
              <div v-if="item.showReplyInput">
                <el-input type="textarea" placeholder="请输入回复内容" v-model="item.replyContent"></el-input>
                <div style="text-align: right; margin-top: 5px">
                  <el-button type="primary" @click="addReplay(item, item.commentId)">回 复</el-button>
                </div>
              </div>
            </div>

            <!--                这是回复-->
            <div style="display: flex;  grid-gap: 20px; margin-bottom: 20px" v-for="sub in item.children" :key="sub.id">
              <img :src="'http://localhost:8081/avatar/' + sub.avatar" alt="" style="width: 50px; height: 50px; border-radius: 50%">
              <div style="flex: 1">
                <div style="color: #666; margin-bottom: 10px">{{ sub.nickname }} <span style="color: #333" v-if="sub.replyUser !== item.userName">回复  {{ sub.replyUser }}</span></div>
                <div style="color: #444; margin-bottom: 10px"> @{{ sub.targetNickname }}  {{ sub.content }}</div>
                <div style="color: #888; font-size: 13px; margin-bottom: 10px"><span style="margin-right: 20px">{{ sub.createTime }}</span>
                  <span style="cursor: pointer;" :class="{ 'comment-active' : sub.showReplyInput }" @click="handleShowReplyInput(sub)"><i class="el-icon-s-comment"></i>评论</span>
                  <span style="margin-left: 20px; cursor: pointer" @click="del(sub.commentId,2)" v-if="sub.userId === user.userId"><i class="el-icon-delete"></i>删除</span>
                </div>
                <div v-if="sub.showReplyInput">
                  <el-input type="textarea" placeholder="请输入回复内容" v-model="sub.replyContent"></el-input>
                  <div style="text-align: right; margin-top: 5px">
                    <el-button type="primary" @click="addReplay(sub, item.commentId)">回 复</el-button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!--  评论结束  -->
  
  </template>
  
  <script>
  import request from '@/utils/request.js'
  export default {
    name: "CommentComponent",
    props: {
      fid: null
    },
    data() {
      return {
        commentCount: 0,
        commentContent: '',
        commentList: [],
        user: JSON.parse(localStorage.getItem('user') || '{}')
      }
    },
    created() {
      this.loadComment()
    },
    methods: {
      del(id, mode) {   // 单个删除
        this.$confirm('您确定删除吗？', '确认删除', {type: "warning"}).then(response => {
          if(mode == 1){                      //删除一级评论
            request.delete('/comment/main/' + id).then(res => {
            if (res.code === 20000) {   
              this.$message.success('删除成功')
              this.loadComment()
            } else {
              this.$message.error(res.msg)  
            }
          })
          }else{                            //删除二级评论
            request.delete('/comment/sub/' + id).then(res => {
            if (res.code === 20000) {   
              this.$message.success('删除成功')
              this.loadComment()
            } else {
              this.$message.error(res.msg)  
            }
          })
          }
        }
          ).catch(() => {
        })
      },
      handleShowReplyInput(item) {
        this.$set(item, 'showReplyInput', !item.showReplyInput)
      },
      addReplay(item, father_Id) {
        request.post('/comment/sub/upload', { content: item.replyContent, fatherId: father_Id ,targetUserId: item.userId}).then(res => {
          if (res.code === 20000) {
            this.$message.success('评论成功')
            item.replyContent = ''
            this.loadComment()  // 重新加载数据
          }
        })
      },
      loadComment() {
        request.get('/comment/main/page', {
          params: {  fatherId : this.fid }
        }).then(res => {
          this.commentList = res.data.page.records || []
        })
  
        request.get('/comment/count/' + this.fid).then(res => {
          this.commentCount = res.data.totals || 0
        })
      },
      addComment() {
        request.post('/comment/main/upload', { content: this.commentContent, fatherId: this.fid}).then(res => {
          if (res.code === 20000) {
            this.$message.success('回复成功')
            this.commentContent = ''
            this.loadComment()  // 重新加载数据
          }
        })
      },
    }
  }
  </script>
  
  <style scoped>
  
  </style>
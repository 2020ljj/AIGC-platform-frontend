<template>
    <div class="main-content">
      <div style="display: flex; grid-gap: 10px">
  
        <div style="flex: 1">
          <div class="card" style="padding: 30px; margin-bottom: 10px">
            <div style="margin-bottom: 20px">
                <div style="font-weight: bold; font-size: 30px; margin-right: 750px; display:inline;">{{ tool.name }}</div>
                <div style="display:inline;">得分：&nbsp;&nbsp;</div>
                <div style="color : #FFD700 ; font-size: 27px; display:inline;">{{ tool.rate }}</div>
            </div>
            
            <div class="block" style="float:right">
                <el-rate v-model="myRate" :colors="colors"
                        @change="submitRate()">
                </el-rate>
            </div>
            <div style="color: #666; margin-bottom: 20px">
                <div style="width: fit-content; margin-right: 20px">
                    <el-tag v-for="item in tagsArr" :key="item" type="primary" style="margin-right:5px">{{ item }}</el-tag>
                <span style="margin-right: 20px"><i class="el-icon-date"></i> {{ tool.createTime }}</span>
              </div>
            </div>
            
            <div v-html="tool.introduction" class="w-e-text w-e-text-container"></div>
  
          </div>
  
          <!--     点赞和收藏数据   -->
          <div class="card" style="text-align: center; font-size: 20px; color: #666; margin-bottom: 10px">
            <!-- <span style="margin-right: 20px; cursor: pointer;" @click="setUnlikes" :class="{ 'active' : passage.userLike }"><i class="el-icon-oppose_light"></i> {{ passage.unlikeAmount }}</span> -->
            <!-- <span style=" cursor: pointer"  @click="setCollect"><i class="el-icon-star-off" :class="{ 'activeCollect' : ifUserCollect }"></i> {{ passage.collectionAmount }}</span> -->
          </div>
          
          <!-- 评论模块 -->
          <Comment :fid="toolId"></Comment>

        </div>
  
        <div style="width: 260px">
          <div class="card" style="margin-bottom: 10px">
            <div style="display: flex; align-items: center; grid-gap: 10px; margin-bottom: 10px">
              <img :src="statistics?.avatar" alt="" style="width: 50px; height: 50px; border-radius: 50%">
              <div style="flex: 1;">
                <div style="font-weight: bold; margin-bottom: 5px">{{ statistics?.nickname }}</div>
                <div style="color: #666; font-size: 13px" class="line2">{{ statistics?.signature }}</div>
              </div>
            </div>
  
            <div style="display: flex">
              <div style="flex: 1; text-align: center">
                <div style="margin-bottom: 5px">文章</div>
                <div style="color: #888">{{ statistics?.passageAmount }}</div>
              </div>
              <div style="flex: 1; text-align: center">
                <div style="margin-bottom: 5px">获赞</div>
                <div style="color: #888">{{ statistics?.likeAmount }}</div>
              </div>
              <div style="flex: 1; text-align: center">
                <div style="margin-bottom: 5px">收藏</div>
                <div style="color: #888">{{statistics?.collectionAmount}}</div>
              </div>
            </div>
          </div>
  
          <div class="card" style="margin-bottom: 10px">
            <div style="font-weight: bold; font-size: 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd; margin-bottom: 10px">相关推荐</div>
  
            <div>
              <div style="margin-bottom: 15px" v-for="item in recommendList" :key="item.id">
                <a :href="'/front/blogDetail?blogId=' + item.id" target="_blank"><div class="recommend-title line2">{{ item.title }}</div></a>
                <div style="color: #888">
                  <span>阅读</span> <span>{{ item.readCount }}</span>
                  <span style="margin-left: 10px">点赞</span> <span>{{ item.likesCount }}</span>
                </div>
              </div>
            </div>
          </div>
  
          <div class="card">
            <div style="display: flex; grid-gap: 10px; ">
              <div style="flex: 1; line-height: 25px">
                找对属于你的学习圈子
                扫码学习精品项目
              </div>
              <!-- <img src="@/assets/imgs/广告.png" alt="" style="width: 50px; height: 50px; border-radius: 5px"> -->
            </div>
          </div>
  
        </div>
  
  
  
      </div>
  
      <!-- <Footer /> -->
    </div>
  </template>




<script>
import request from '@/utils/request.js'
import 'highlight.js/styles/monokai-sublime.css'
import E from "wangeditor"
import Comment from "@/components/CommentComponent.vue"
export default {
    name: 'toolDetail',
    components:{
      Comment
    },
    data(){
        return {
            toolId: this.$route.query.toolId,
            tool: {},
            tagsArr: [],
            recommendList: [],
            editor: null,
            statistics:{},
            ifUserLike: 0,
            ifUserCollect: 0,
            myRate: 0,
            colors: ['#99A9BF', '#F7BA2A', '#FF9900']  // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
        }
    },
created() {
    this.load();
    this.editor = new E(_this.$refs.editorElem);//获取组件并构造编辑器
    this.editor.create(); // 创建富文本实例
},
methods: {
   
    load() {
        request.get('/tool/' + this.toolId).then(res => {
          if (res.code === 20000) {
            this.tool = res.data.tool || {};
            this.tagsArr = this.tool.label.split("/");

            request.get('/user/statistics/' + this.tool.userId).then(res =>{
              if (res.code === 20000) {
                this.statistics = res.data.statistics || {};
                this.statistics.avatar = "http://localhost:8081/avatar/" + this.statistics.avatar;
              }else{
                this.$message({message: res.message,type: 'error'});
              }
            })
            request.get('/tool/rate/' + this.toolId).then(res => {
                this.myRate = res.data.myRate || []
            })
          }else{
            this.$message({message: res.message,type: 'error'});
          }

          request.post('/collect/get' , {"targetId": this.passageId, "choice": "文章"}).then(res =>{
              if (res.code === 20000) {
                  this.ifUserCollect = res.data.ifUserCollect;
              }else{
                this.$message({message: res.message,type: 'error'});
              }
          })



        })
        // request.get('/blog/selectRecommend/' + this.blogId).then(res => {
        //     this.recommendList = res.data || []
        // })
    },
    submitRate(){
        const params = new URLSearchParams();
        params.append("rate",this.myRate)
        params.append('toolId',this.toolId)
        request.get('/tool/rate' , {params: params}).then(res =>{
              if (res.code === 20000) {
                this.load();
              }else{
                this.$message({message: res.message,type: 'error'});
              }
          })

    }
  }
}
</script>

<style>
.el-rate__icon{
  font-size: 30px;
}
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 20px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
code {
  display: inline-block;
  display: inline;
  zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
pre code {
  display: block;
}
p {
  line-height: 30px
}

.activeLike {
  color: red !important;
}
.activeCollect{
  color: yellow !important;
}
.recommend-title {
  margin-bottom: 5px;
}
.recommend-title:hover {
  color: #2a60c9;
}

</style>

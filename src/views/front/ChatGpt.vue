
<template>
    <div class="card" style="padding: 30px; margin-bottom: 10px ;width: 700px;">
      <div class="title">问问AI</div>
      <div class="talkContent">
      <div class="talkShow">
        <div :class="[(item.person=='mechanical')?'mechanicalTalk':'mineTalk']" v-for="(item,index) in talkList" :key="index">
            <span>{{item.say}}</span>
        </div>
        
      </div>
      
      <div class="talkInput">
        <form @submit.prevent="getQuestion" class="userSearch">
          
          <el-input
            placeholder="请输入内容"
            v-model="contentVal"
            style="width: 500px;">
            <i slot="suffix" class="el-input__icon el-icon-position" style="cursor: pointer;" @click="getQuestion"></i>
          </el-input>
       </form>
      </div>
    </div>
    </div>
    
  </template>
  
  <script>
  import request from '@/utils/request.js'
  export default {
    name: 'ChatGpt',
    data() {
      return {
        talkList: [
          { id:"1", person: 'mechanical', say: '你好，有什么可以帮到你呢？' },
        ],
        isMine: 1,
        contentVal: '',
        data:''
      };
    },
    methods: {
      getQuestion() {
        if (this.contentVal == '') {
          this.$message.error('请输入内容');
          return;
        }
        // admin提问数据push()
        this.talkList.push({ id: Date.now(), person:'admin', say: this.contentVal });
        // 清空输入栏数据
        this.getAnswer();
        this.contentVal = '';
      },
      async getAnswer() {
        // 调用API获取回答， 模拟后端返回的数据流式输出
        request.post('/aigc/chat', {
            content: this.contentVal
            }).then(res =>{
                this.data = res[0];
                console.log(res[0])
                this.displayText();
            })
            this.talkList.push({ id: Date.now(), person:'mechanical', say: "......" });

        
      },
      async displayText(){
      // mechanical 模拟回答
        // 流式输出文字逐个展示
        let text = "";
        const length = this.talkList.length;
        for (let i = 0; i < this.data.length; i++) {
          text += this.data.charAt(i);
          await new Promise((resolve) => {
            setTimeout(resolve, 50)
          });
          this.talkList[length - 1].say= text;
        }
    }
    },
    
  };
  </script>
  
  <style scoped>
  .talkContent {
    margin: 50px auto 0;
    font-size: 14px;
  }
  
  .talkShow {
    height: 400px;
    margin: 10px auto 0;
    overflow: auto;
  }
  .title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
  
  .talkInput {
    margin: 10px auto 0;
    display: flex;
  }
  
  .mechanicalTalk {
    margin: 10px;
  }
  
  .mechanicalTalk span {
    display: inline-block;
    background: white;
    border-radius: 10px;
    padding: 5px 10px;
    border: 1px solid rgb(214, 216, 219);
    border-top-left-radius: 0px;
    word-break: break-all;
    text-align: left;
  }
  
  .mineTalk {
    margin: 10px;
    text-align: right;
  }
  
  .mineTalk span {
    display: inline-block;
    border-radius: 10px;
    border-top-right-radius: 0px;
    background: #409eff;
    color: #fff;
    padding: 5px 10px;
    word-break: break-all;
    text-align: left;
  }
  
  </style>
  
  
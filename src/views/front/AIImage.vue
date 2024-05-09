<template>
    <div class="ai-image-display">
    <div class="title">AI图片生成</div>
      <input type="text" v-model="imageDescription" placeholder="输入图片关键词...">
      <div class="image-preview">
        <img v-if="imageUrl" :src="imageUrl" alt="AI Generated Image" style="max-width: 100%;">
        <p v-else class="no-image-text">暂无图片</p>
      </div>
      <button @click="displayImage">获取图片</button>
    </div>
  </template>
  
  <script>
import request from '@/utils/request.js'
  export default {
    name: 'AIImage',
    data() {
      return {
        imageDescription: '',
        imageUrl: ''
      };
    },
    methods: {
      displayImage() {
        const params = new URLSearchParams();
        request.post('/aigc/limewire/image' , {content: this.imageDescription}).then(res =>{
              if (res.code === 20000) {
                this.imageUrl = res.data.imageUrl;
              }else{
                this.$message({message: res.message,type: 'error'});
              }
          })
      },
      
    }
  };
  </script>
  
  <style scoped>
  .ai-image-display {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
  }
  .title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
  
  input {
    width: calc(100% - 22px);
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  
  .image-preview {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  img {
    display: block; /* Remove extra space below the image */
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
  
  .no-image-text {
    color: #666;
  }
  .ai-image-display {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 20px; /* 添加内边距 */
  background-color: #fff; /* 设置白色背景 */
  border: 1px solid #ddd; /* 添加边框 */
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影，使组件看起来更有层次感 */
}

/* 其他样式保持不变 */

.image-preview {
  margin-top: 20px;
  padding: 10px; /* 添加内边距 */
  background-color: #fff; /* 设置白色背景 */
  border: 1px solid #ddd; /* 添加边框，如果需要的话 */
  border-radius: 4px;
}
  </style>
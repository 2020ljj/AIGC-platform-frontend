<template>
    <div class="m-tooltip" @mouseenter="onShow" @mouseleave="onHide">
      <div
        ref="titleRef"
        class="m-title"
        :class="{'show-tip': visible}"
        @mouseenter="onShow"
        @mouseleave="onHide"
        :style="`max-width: ${maxWidth}px; top: ${top}px; left: ${left}px;`">
        <div class="u-title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="m-arrow">
          <span class="u-arrow"></span>
        </div>
      </div>
      <div ref="contentRef" class="u-content">
        <slot>{{ content }}</slot>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'Tooltip',
    props: {
      maxWidth: { // 提示框内容最大宽度
        type: Number,
        default: 120
      },
      content: { // 展示的文本
        type: String,
        default: '暂无内容' // string | slot
      },
      title: { // 提示的文本
        type: String,
        default: '暂无提示' // string | slot
      }
    },
    data () {
      return {
        hideTimer: null,
        top: 0, // 提示框top定位
        left: 0, // 提示框left定位
        visible: false
      }
    },
    mounted () {
      this.getPosition()
    },
    methods: {
      getPosition () {
        const rect = this.$refs.contentRef.getBoundingClientRect()
        const targetTop = rect.top
        const targetLeft = rect.left
        const targetWidth = rect.width
        const titleWidth = this.$refs.titleRef.offsetWidth // 提示文本宽度
        const titleHeight = this.$refs.titleRef.offsetHeight // 提示文本高度
        this.top = targetTop - titleHeight
        this.left = targetLeft - (titleWidth - targetWidth) / 2
      },
      onShow () {
        this.getPosition()
        clearTimeout(this.hideTimer)
        this.visible = true
      },
      onHide () {
        this.hideTimer = setTimeout(() => {
          this.visible = false
        }, 100)
      }
    }
  }
  </script>
  <style lang="less" scoped>
  .m-tooltip {
    display: inline-block;
  }
  .m-title {
    position: fixed;
    z-index: 999;
    padding-bottom: 12px;
    pointer-events: none;
    opacity: 0;
    transform-origin: 50% 75%;
    transform: scale(0.8);
    transition: transform .25s, opacity .25s;
    .u-title {
      padding: 10px;
      margin: 0 auto;
      word-break: break-all;
      word-wrap: break-word;
      background: #FFFFFF;
      //box-shadow: 0px 0px 7px 1px fade(@themeColor, 36%);
      border-radius: 5px;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #333;
    }
    .m-arrow {
      position: absolute;
      z-index: 9;
      bottom: 12px;
      left: 50%;
      transform: translate(-50%, 100%);
      width: 15.55px;
      height: 10px;
      border-radius: 0 0 5px 5px;
      overflow: hidden;
      .u-arrow {
        position: absolute;
        left: 50%;
        top: 0px;
        transform: translate(-50%, -50%) rotate(45deg);
        margin: 0 auto;
        width: 11px;
        height: 11px;
        background: #FFF;
        border-radius: 0 0 3px 0;
        z-index: 8;
        //box-shadow: 1px 1px 3px 1px fade(@themeColor, 10%);
      }
    }
  }
  .show-tip {
    pointer-events: auto;
    opacity: 1;
    transform: scale(1);
  }
  .u-content {
    cursor: pointer;
    font-size: 14px;
    line-height: 1.5;
    color: #000000;
  }
  </style>
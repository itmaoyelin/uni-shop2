<template>
	<view class="my-search-container" :style="{'background-color':bgcolor}">
    <!-- 使用view组件模拟input输入框的样式 -->
    <view class="my-search-box" :style="{'border-radius':radius+'px'}"
    @click="searchBoxHandler">
      <uni-icons type="search" size="26"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
      
  </view>
</template>

<script>
	export default {
    //提高组件通用性.接收自定义属性
    props:{
      bgcolor:{
        type:String,
        default:'#C00000' //默认值
      },
      radius:{
        type:Number,
        default:15
      }
    },
		data() {
			return {
				
			};
		},
    methods:{
      searchBoxHandler(){
        // console.log('dddd')
        this.$emit('click') //触发外界的click事件
      }
    }
	}
</script>

<style lang="scss">
    .my-search-container{
     
      background-color: #c00000;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px ;
      .my-search-box{
          width: 100%;
          height: 30px;
          background-color: #fff;
          border-radius: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          .placeholder{
            font-size: 14px;
            margin-left: 5px;
          }
      }
      
    }
    
</style>

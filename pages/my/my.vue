<template>
	<view class="my-container">
      <!-- 用户未登录时,显示登录组件 -->
     <my-login v-if="!token"></my-login>
     <!-- 用户登录后.显示用户信息组件 -->
     <my-userinfo v-else></my-userinfo>
     <view class="footer">
       © Copyright 2022 maoyelin
     </view>
	</view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from'@/mixins/tabbar-badge.js'
  //导入mapState辅助函数
  import {mapState} from 'vuex'
	export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    computed:{
      // 从 m_user 模块中导入需要的 token 字符串
      ...mapState('m_user',['token']),
    },
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
  page,.my-container{
    height: 100%;
    .footer{
      width: 100%;
      position: absolute;
      bottom: 10px;
      left: 0;
      text-align: center;
      color: #aaa;
      font-size: 12px;
    }
  }

</style>

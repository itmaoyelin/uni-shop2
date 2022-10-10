<template>
	<view>
		<!-- 选择收获地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address)==='{}'">
      <button type="primary" size="mini" @click="btnChooseAddress">请选择收货地址+</button>
    </view>
    
    <!-- 渲染收货地址信息盒子 -->
    <view class="address-info-box" v-else @click="btnChooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人: <text>{{address.userName}}</text></view>  
        </view>
        <view class="row1-right">
          <view class="phone">电话：<text>{{address.telNumber}}</text></view>
           <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addstr}}</view>
      </view>
    </view>
    <!-- 底部边框线 -->
       <image src="/static/cart_border@2x.png" style="display: block;width: 100%;height: 5px;"></image>
	</view>
</template>

<script>
  import  {mapState,mapMutations,mapGetters} from 'vuex'
	export default {
    computed:{
      //映射出address数据
      ...mapState('m_user',['address']),
      //收货详细地址的计算属性
      ...mapGetters('m_user',['addstr'])
    },
		data() {
			return {
				//收货地址
        // address:{}
			};
		},
    methods:{
      ...mapMutations('m_user',['updateAddress']),
       //选择收货地址
       async btnChooseAddress(){
        // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
       //返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        //如果用户成功选择了收货地址
        if (err === null && succ.errMsg === 'chooseAddress:ok') {
              // 为 data 里面的收货地址对象赋值
              // this.address = succ
              //调用 Store 中提供的 updateAddress 方法，将 address 保存到 Store 里面
              this.updateAddress(succ)
              // console.log(succ)
            }
       // 3. 用户没有授权
        if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
           this.reAuth()
         }
      },
      // 调用此方法，重新发起收货地址的授权
      async reAuth() {
        // 3.1 提示用户对地址进行授权
        const [err2, confirmResult] = await uni.showModal({
          content: '检测到您没打开地址权限，是否去设置打开？',
          confirmText: "确认",
          cancelText: "取消",
        })
      
        // 3.2 如果弹框异常，则直接退出
        if (err2) return
      
        // 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
        if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
      
        // 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
        if (confirmResult.confirm) return uni.openSetting({
          // 3.4.1 授权结束，需要对授权的结果做进一步判断
          success: (settingResult) => {
            // 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
            // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
          }
        })
      }
    }
	}
</script>

<style lang="scss">
.address-choose-box{
   height: 90px;
   display: flex;
   align-items: center;
   justify-content: center;
}
.address-info-box{
  font-size: 12px;
  height: 90px;
  flex-direction: column;
  .row1{
    padding: 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #efefef;
    .row1-right{
      display: flex;
      justify-content: space-between;
      .phone{
        margin-right: 5px;
      }
    }
  }
  .row2{
    padding: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .row2-left{
      white-space:nowrap;
    }
  }
}
</style>

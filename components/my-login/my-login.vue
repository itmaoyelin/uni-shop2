<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#aaa"></uni-icons>
   <!-- <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> -->
   <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <!-- 登录提示 -->
    <view class="login-tip">登录后尽享更多权益</view>
  </view>
</template>

<script>
  //导入辅助函数
  import {mapMutations,mapState} from 'vuex'
  export default {
    computed:{
      //重定向对象
      ...mapState('m_user',['redirectInfo'])
    },
    data() {
      return {

      };
    },
    methods:{
      //导入方法
      ...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
      //用户授权后获取用户基本信息 废弃
     getUserInfo(e){
        //判断用户是否允许授权
        if(e.detail.errMsg==='getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权!')
        // console.log(e)
        //调用方法存储用户基本信息 将用户的基本信息存储到 vuex 中
        this.updateUserInfo(e.detail.userInfo)
        //获取登录成功之后的token字符串
        this.getToken(e.detail)
      },
      //获取用户基本信息
      getUserProfile() {
       // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
       // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      uni.getUserProfile({
         desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
         success: (res) => {
           // console.log(res)
           //调用方法存储用户基本信息 将用户的基本信息存储到 vuex 中
           this.updateUserInfo(res.userInfo)
           //获取登录成功之后的token字符串
           this.getToken(res) 
         },
         fail:(res)=>{
          //用户授权失败
          if(res.errMsg==='getUserProfile:fail auth deny') return uni.$showMsg('您取消了登录授权!')
         }
       })
     },
      //获取token字符串方法
      async getToken(info){
        // 调用微信登录接口
        const [err,res]=await uni.login().catch(err=>err)
       
        //判断是否uni.login()调用失败
        if(err|| res.errMsg!=='login:ok') return uni.$showMsg('登录失败!')
        //准备参数对象
        const query={
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // console.log(res)
        // 换取token
        // const {data:loginResult}=await uni.$http.post('/api/public/v1/users/wxlogin',query)
        // console.log(loginResult)
        //后台处理token有问题返回400
        // if(loginResult.meta.status!==200) return uni.$showMsg('登录失败!')
        // 更新 vuex 中的 token
       // this.updateToken(loginResult.message.token)
       //先模拟一个假token
       // const token='Bearer'+' '+ 'maoyelin'+res.code
       const token='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
       // 更新 vuex 中的 token
       this.updateToken(token)
       //如果 redirectInfo重定向对象不为 null，则登录成功之后，需要重新导航到对应的页面
       this.back()
      },
      //导航回登录之前的页面方法
      back(){
        // console.log(this.redirectInfo)
        //如果重定向对象不为空，且打开方式为switchTab则开始跳转
        if(this.redirectInfo&&this.redirectInfo.openType==='switchTab'){
         
          uni.switchTab({
            url:this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete:()=>{
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      margin: 20px 0;
      width: 90%;
      border-radius: 100px;
      background-color: #C00000;
    }

    .login-tip {
      font-size: 12px;
      color: #aaa;
    }

  }
</style>

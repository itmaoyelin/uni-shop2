<template>
  <view class="my-userinfo-container">
    <!-- 顶部头像区域 -->
    <view class="top-box" @click="getUserProfile">
      <image :src="userinfo.avatarUrl" class="avator"></image>
      <view class="nickname">{{userinfo.nickName}}</view>
    </view>
    <!-- 内容面板区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <view class="panel-first">
        <view class="panel-first-item">
          <text>8</text>
          <text>收藏的店铺</text>
        </view>
        <view class="panel-first-item">
          <text>14</text>
          <text>收藏的商品</text>
        </view>
        <view class="panel-first-item">
          <text>18</text>
          <text>关注的店铺</text>
        </view>
        <view class="panel-first-item">
          <text>84</text>
          <text>足迹</text>
        </view>
      </view>
      <!-- 第二个面板 -->
      <view class="pancel-second">
        <!-- 面板的标题 -->
        <view class="pancel-second-title">我的订单</view>
        <!-- 面板的主体 -->
        <view class="pancel-second-body">
          <view class="pancel-second-item">
            <image src="/static/my-icons/icon1.png" class="pancel-second-pic"></image>
            <text>待付款</text>
          </view>
          <view class="pancel-second-item">
            <image src="/static/my-icons/icon2.png" class="pancel-second-pic"></image>
            <text>待收货</text>
          </view>
          <view class="pancel-second-item">
            <image src="/static/my-icons/icon3.png" class="pancel-second-pic"></image>
            <text>退款/退货</text>
          </view>
          <view class="pancel-second-item">
            <image src="/static/my-icons/icon4.png" class="pancel-second-pic"></image>
            <text>全部订单</text>
          </view>
        </view>
      </view>
      <!-- 第三个面板 -->
      <view class="pancel-third">
        <view class="pancel-third-item" @click="btnChooseAddress">
          <text>收货地址</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="pancel-third-item">
          <text>联系客服</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
        <view class="pancel-third-item" @click="logout">
          <text>退出登录</text>
          <uni-icons type="arrowright" size="15"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    computed: {
      ...mapState('m_user', ['userinfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress', 'updateUserInfo', 'updateToken']),
      //更新用户基本信息
      getUserProfile() {
        uni.getUserProfile({
          desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            //调用方法存储用户基本信息 将用户的基本信息存储到 vuex 中
            this.updateUserInfo(res.userInfo)
          },
        })
      },
      //选择收货地址
      async btnChooseAddress() {
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
      },
      //退出登录的方法
      async logout() {
        const [err, success] = await uni.showModal({
          title: '提示',
          content: '确认退出登录吗?'
        }).catch(err => err)
        // console.log(err)
        // console.log(success)
        //用户确定退出操作
        if (success && success.confirm) {
          // 需要清空 vuex 中的 userinfo、token 和 address
          this.updateToken('')
          this.updateUserInfo({})
          this.updateAddress({})
        }

      }
    },
    data() {
      return {

      };
    },
  }
</script>

<style lang="scss">
  .my-userinfo-container {
    height: 100%;
    background-color: #f4f4f4;

    .top-box {
      width: 100%;
      height: 400rpx;
      background-color: #C00000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .avator {
        display: block;
        width: 100px;
        height: 100px;
        border-radius: 100%;
        border: 3px solid #fff;
        box-shadow: 0 1px 5px black;
      }

      .nickname {
        padding: 10px 0;
        font-size: 16px;
        font-weight: 700;
        color: #fff;
      }
    }

    .panel-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: cneter;
      margin: 10px;
      transform: translateY(-25px);

      .panel-first {
        width: 90%;
        padding: 5px;
        display: flex;
        height: 50px;
        justify-content: space-around;
        align-items: center;
        background-color: #FFFFFF;
        border-radius: 5px;
        border: 1px solid #efefef;

        .panel-first-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 14px;
        }
      }

      .pancel-second {
        width: 90%;
        display: flex;
        flex-direction: column;
        margin: 10px 0;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #efefef;
        background-color: #fff;

        .pancel-second-title {
          padding: 10px 5px;
          font-size: 16px;
          border-bottom: 1px solid #f4f4f4;
        }

        .pancel-second-body {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-top: 10px;

          .pancel-second-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 14px;
          }

          .pancel-second-pic {
            display: block;
            width: 40px;
            height: 40px;
          }
        }
      }

      .pancel-third {
        width: 90%;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #efefef;
        background-color: #fff;

        .pancel-third-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 5px;
          font-size: 16px;
        }
      }
    }
  }
</style>

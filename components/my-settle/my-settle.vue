<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio">
      <radio :checked="isFullCheck" color="#C00000" @click="changeAllSate"></radio>
      <tetx>全选</tetx>
    </label>
    <!-- 合算区域 -->
    <view class="amount-box"> 合计:<text class="amount">￥{{checkedGoodsAmount}}</text> </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>

  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        //倒计时的秒数
        seconds: 3,
        //定时器的id
        timer: null,
      };
    },
    methods: {
      //使用 mapMutations 辅助函数，把 m_cart 模块提供的 updateAllGoodsState 方法映射到当前组件中使用
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      //全选按钮的点击事件处理函数
      changeAllSate() {
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
      //点击结算后事件处理函数
      settlement() {
        //未选中商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品!')
        //没有填写地址
        if (!this.addstr) return uni.$showMsg('请填写收货地址!')
        //用户没有登录
        if (!this.token) return this.delayNavigate()
        //实现微信支付功能
        this.payOrder()
      },
      //微信支付方法
      async payOrder() {
        //创建订单，组织订单的信息对象
        const orderInfo = {
          //开发期间，注释掉真实的订单价格，
          // order_price: this.checkedGoodsAmount,
          // 写死订单总价为 1 分钱
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }
        //发起请求创建订单
        const {data:res}=await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
        // console.log(res)
        if(res.meta.status!==200) return uni.$showMsg('创建订单失败!')
        //得到服务器响应的订单编号
        const orderNumber=res.message.order_number
        //订单预支付
        //发起请求获取订单的支付信息
        const {data:res2}=await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder',{order_number:orderNumber})
        // console.log(res2)
        //预付订单失败
        if(res2.meta.status!=200) return uni.$showMsg('预付订单失败!')
        //得到订单支付相关的参数
        const payInfo=res2.message.pay
        // console.log(payInfo)
        //发起微信支付
        // 调用 uni.requestPayment() 发起微信支付
        const [err,succ]= await uni.requestPayment(payInfo)
        // console.log(err)
        //未完成支付
        if(err) return uni.$showMsg('订单支付失败!')
        // console.log(succ)
        //完成了支付，进一步查询支付的结果
        const {data:res3}=await uni.$http.post('/api/public/v1/my/orders/chkOrder',{order_number:orderNumber})
        //检测订单未支付
        if(res3.meta.status!==200) return uni.$showMsg('订单未支付!')
        //检测到订单支付完成
        uni.showToast({
          title:'支付完成!',
          icon:'success'
        })
        
      },
      //展示倒计时的提示消息
      showTips(n) {
        //调用showToast方法展示提示消息
        uni.showToast({
          //提示消息
          title: '请登录后再结算!' + '' + '[' + n + ']' + '秒后自动跳转到登录页',
          icon: 'none',
          //延迟1.5秒后关闭
          duration: 1500,
          // 显示透明蒙层，防止触摸穿透
          mask: true
        })
      },
      //延迟到my页面的方法
      delayNavigate() {
        // 把 data 中的秒数重置成 3 秒
        this.seconds = 3
        //展示提示框
        this.showTips(this.seconds)
        //将定时器的id存储到timer中 ,开启定时器，每隔一秒执行一次
        this.timer = setInterval(() => {
          this.seconds--
          //判断秒数是否小于等于0
          if (this.seconds <= 0) {
            //清除定时器
            clearInterval(this.timer)
            //跳转到my页面
            uni.switchTab({
              url: '/pages/my/my',
              //页面跳转成功之后更新redirectinfo重定向对象
              success: () => {
                this.updateRedirectInfo({
                  //跳转的方式
                  openType: 'switchTab',
                  //从哪个页面跳过去的
                  from: '/pages/cart/cart'
                })
              }
            })
            //终止代码向下执行
            return
          }
          //调用倒计时提示框
          this.showTips(this.seconds)
        }, 1000)
      }

    },
    computed: {
      //商品的选中的数量 ,商品的总数量
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']), //地址
      // token 是用户登录成功之后的 token 字符串
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),

      //商品全选中状态
      isFullCheck() {
        return this.checkedCount === this.total
      }

    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    width: 100%;
    height: 50px;
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        font-size: 18px;
        color: #C00000;
      }
    }

    .btn-settle {
      min-width: 100px;
      background-color: #C00000;
      text-align: center;
      line-height: 50px;
      color: #fff;
    }


  }
</style>

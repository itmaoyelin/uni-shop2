<template>
  <view>
    <view class="goods-item">
      <!-- 左侧商品图片区域-->
      <view class="goods-item-left">
        <radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioChangeHandler"></radio>
        <image class="goods_pic" :src=" goods.goods_small_logo|| defaultPic" @click="gotoDetail(goods)"></image>
      </view>
      <!-- 右侧商品信息区域 -->
      <view class="goods-item-right">
        <!-- 商品名字 -->
        <view class="goods-name" @click="gotoDetail(goods)">{{ goods.goods_name}} </view>
        <!-- 商品价格 -->
        <view class="goods-info-box">
          <view class="goods-price">￥{{ goods.goods_price|toFixed}} </view>
          <!-- 商品数量 -->
          <uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler" v-if="showNumber"></uni-number-box>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    //接收属性参数
    props: {
      //商品对象
      goods: {
        type: Object,
        defuault: {},
      },
      //是否展示商品信息左侧复选按钮
      showRadio: {
        type: Boolean,
        default: false
      },
      //是否展示右侧的number组件
      showNumber: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      radioChangeHandler() {
        // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
        // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          //商品最新勾选状态
          goods_state: !this.goods.goods_state
        })
      },
      numChangeHandler(val) {
        // console.log(val)
        //通过this.$emit()触发外界通过@绑定的num-change事件
        //同时把商品id和最新商品数量作为参数，传递给num-change事件处理函数
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          //商品最新数量
          goods_count: +val
        })
      },
      //跳转到商品详情页
      gotoDetail(goods){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+goods.goods_id
        })
      }
    },
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-defaul        t-medium.png'
      };
    },
    //过滤器节点
    filters: {
      toFixed(num) {
        return Number(num).toFixed(2) //保留两位小数
      }
    }


  }
</script>

<style lang="scss">
  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 750rpx;
    // 设置盒模型为 border-box
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #efefef;

    .goods-item-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 5px;

      .goods_pic {
        width: 100px;
        height: 100px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 14px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .goods-price {
          font-size: 16px;
          color: #c00000;
        }
      }
    }
  }
</style>

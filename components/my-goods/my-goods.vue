<template>
  <view>
    <view class="goods-item">
      <!-- 左侧商品图片区域-->
      <view class="goods-item-left">
        <image class="goods_pic" :src=" goods.goods_small_logo|| defaultPic"></image>
      </view>
      <!-- 右侧商品信息区域 -->
      <view class="goods-item-right">
        <!-- 商品名字 -->
        <view class="goods-name">{{ goods.goods_name}} </view>
        <!-- 商品价格 -->
        <view class="goods-info-box">
          <view class="goods-price">￥{{ goods.goods_price|toFixed}} </view>
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
    },
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-defaul        t-medium.png'
      };
    },
    //过滤器节点
    filters:{
      toFixed(num){
       return Number(num).toFixed(2) //保留两位小数
      }
    }


  }
</script>

<style lang="scss">
  .goods-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #efefef;

    .goods-item-left {
      margin-right: 5px;

      .goods_pic {
        width: 100px;
        height: 100px;
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
        .goods-price {
          font-size: 16px;
          color: #c00000;
        }
      }
    }
  }
</style>

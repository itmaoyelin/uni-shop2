<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
      <swiper-item v-for="(item,index) in goods_info.pics" :key="index">
        <image class="swiper-pic" :src="item.pics_big_url" @click="preview(index)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box" v-if="goods_info.goods_name">
      <!-- 商品价格区域 -->
      <view class="goods-info-price">￥{{goods_info.goods_price}}</view>
      <!-- 商品主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 商品收藏 -->
        <view class="goods-collect">
          <uni-icons type="star" size="20"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费区域 -->
      <view class="goods-fare">快递: 免运费</view>
    </view>
    <!-- 商品详情区域 -->
       <view class="goods-detail-bar">--------宝贝详情--------</view>
       <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <!-- 商品导航组件区域 -->
    <view class="goods-nav">
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  // 从 vuex 中按需导出 mapState 辅助方法
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'

  export default {
    computed: {
      // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
      // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapState('m_cart', []),
      // 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
      ...mapGetters('m_cart', ['total'])
    },
    //监听器
    watch: {
      //监听total值的变化
      total: {
        handler(newValue) {
          //通过find方法找到购物车对象
          const findResult = this.options.find((x) => x.text === '购物车')
          // console.log(findResult)
          if (findResult) {
            // 动态为购物车按钮赋值
            findResult.info = newValue
          }
        },
        // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
        immediate: true
      }
    },
    data() {
      return {
        //商品详情对象
        goods_info: {},
        //底部导航组件数据
        options: [{
            icon: 'shop',
            text: '店铺',
            infoBackgroundColor: '#007aff',
            infoColor: "red"
          },
          {
            icon: 'headphones',
            text: '客服'
          }, {
            icon: 'cart',
            text: '购物车',
            info: 0
          }
        ],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      };
    },
    methods: {
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart', ['addToCart']),
      //获取商品详情信息方法
      async getGoodsInfo(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id: goods_id
        })
        //请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        //请求成功
        // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题 
        //将 webp 的后缀名替换为 jpg 的后缀名 解决 .webp 格式图片在 ios 设备上无法正常显示的问题
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block"').replace(
          /webp/g, 'jpg')
        //把数据对象赋值给goods_info
        this.goods_info = res.message
        // console.log(res)
      },
      //预览图片事件处理函数
      preview(index) {
        uni.previewImage({
          //预览时默认图片索引
          current: index,
          //map()循环处理后得到一个新数组包含图片地址
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      //底部导航左侧事件处理函数
      onClick(e) {
        // console.log(e)
        //跳转购物车页面
        if (e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      //底部导航左侧按钮事件处理函数
      buttonClick(e) {
        // console.log(e)
        if (e.content.text === '加入购物车') {
          // this.options[2].info++
          // 组织商品信息对象
          // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
          const goods = {
            goods_id: this.goods_info.goods_id,
            goods_name: this.goods_info.goods_name,
            goods_price: this.goods_info.goods_price,
            goods_count: 1, //商品数量
            goods_small_logo: this.goods_info.goods_small_logo,
            goods_state: true, //商品勾选状态
          }
          //通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
          this.addToCart(goods)
        }
      }
    },

    onLoad(options) {
      // console.log(options)
      //调用方法获取商品详情对象
      this.getGoodsInfo(options.goods_id)
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 600rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info-box {
    padding: 10px 5px;

    .goods-info-price {
      font-size: 18px;
      color: #c00000;
      padding: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;
      padding: 0 0 10px 0;

      .goods-name {
        font-size: 14px;
        // border-right: 1px solid #ddd;
        padding-right: 10px;
        font-weight: 700px;
      }

      .goods-collect {
        display: flex;
        flex-direction: column;
        padding: 0 15px;
        border-left: 1px solid #ddd;
        align-items: center;
        justify-content: center;

        text {
          //不允许换行
          white-space: nowrap;
          color: #bbb;
          font-size: 12px;
        }
      }
    }

    .goods-fare {
      font-size: 14px;
      color: #aaa;
      padding: 5px 0;
    }
  }
.goods-detail-bar{
  padding: 10px;
  text-align: center;
  color: #ddd;
}
  .goods-nav {
    // 粘性定位
    position: sticky;
    bottom: 0;
    z-index: 999;
  }
</style>

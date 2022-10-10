<template>
  
	<view class="cart-container" v-if="cart.length!==0">
    <!-- 收货地址区域 -->
    <my-address></my-address>
		<!-- 购物车标题区域 -->
    <view class="cart-title">
      <uni-icons type="shop" size="18"></uni-icons>
      <text class="cart-title-text">购物车</text> 
    </view>
    <!-- 商品列表区域 -->
    <uni-swipe-action>
    <view class="goods-list" v-for="(item,index) in carts" :key="index">
      <uni-swipe-action-item :options="options" @click="swipeActionClickHandler(item)">
      <my-goods :goods="item" :showRadio="true"  :showNumber="true"
       @radio-change="radioChangeHandler"@num-change="numChangeHadler"></my-goods>
       </uni-swipe-action-item>
    </view>
    </uni-swipe-action>
    <!-- 结算区域 -->
    <my-settle></my-settle>
	</view>
  <!-- 购物车空白区域 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="empty-text">空空如也~~</text>
  </view>
</template>

<script>
 import badgeMix from'@/mixins/tabbar-badge.js'
 import {mapState ,mapMutations} from 'vuex'
	export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins:[badgeMix],
    computed:{
       // 将 m_cart 模块中的 cart 数组映射到当前页面中使用
      ...mapState('m_cart',['cart']),
      carts(){
        return [...this.cart].reverse()
      }
    },
    methods:{
      ...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
       //商品勾选发生了变化
       radioChangeHandler(e){
        // console.log(e)
        this.updateGoodsState(e)
      },
      //商品数量发生变化
      numChangeHadler(e){
        // console.log(e)
       //更新商品数量方法
       this.updateGoodsCount(e)
       //重新设置数字徽标
       // this.setBadge()
      },
      // 商品删除事件处理函数
      swipeActionClickHandler(goods){
        // console.log(goods)
        //调用方法删除商品
        this.removeGoodsById(goods.goods_id)
        // this.setBadge()
      }
    },
		data() {
			return {
				options:[{
          text:'删除',// 显示的文本内容
          style:{
            backgroundColor:'#C00000' //按钮的背景颜色
          }
        }],
			};
		},
  
	}
</script>

<style lang="scss">
  .cart-container{
    padding-bottom: 50px;
    .cart-title{
      padding: 10px 5px;
      border-bottom: 1px solid #efefef;
      .cart-title-text{
        margin-left: 10px;
      }
    }
  }
  .empty-cart{
    margin-top: 150rpx;
    height: 750rpx;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .empty-img{
      width: 100px;
      height: 100px;
    }
    .empty-text{
      margin-top: 15px;
      font-size: 14px;
      color: gray;
    }
  }

</style>

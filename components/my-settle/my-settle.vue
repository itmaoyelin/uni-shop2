<template>
	<view class="my-settle-container">
    <!-- 全选区域 -->
	<label class="radio">
    <radio :checked="isFullCheck" color="#C00000" @click="changeAllSate"></radio><tetx>全选</tetx>
  </label>
  <!-- 合算区域 -->
  <view class="amount-box"> 合计:<text class="amount">￥{{checkedGoodsAmount}}</text> </view>
  <!-- 结算按钮 -->
  <view class="btn-settle">结算({{checkedCount}})</view>
  
	</view>
</template>

<script>
  import  {mapGetters,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
    methods:{
      //使用 mapMutations 辅助函数，把 m_cart 模块提供的 updateAllGoodsState 方法映射到当前组件中使用
      ...mapMutations('m_cart',['updateAllGoodsState']),
      //全选按钮的点击事件处理函数
      changeAllSate(){
         // 修改购物车中所有商品的选中状态
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      }
      
    },
    computed:{
      //商品的选中的数量 ,商品的总数量
      ...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
      //商品全选中状态
      isFullCheck(){
        return this.checkedCount===this.total
      }
      
    }
	}
</script>

<style lang="scss">
.my-settle-container{
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
  .radio{
    display: flex;
    align-items: center;
  }
  .amount-box{
    .amount{
      font-size: 18px;
      color: #C00000;
    }
  }
  .btn-settle{
    min-width: 100px;
    background-color: #C00000;
    text-align: center;
    line-height: 50px;
    color: #fff;
  }
  
 
}
</style>

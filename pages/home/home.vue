<template>
  <view>
    <!-- 搜索框区域 -->
    <view class="search-box">
       <my-search @click="gotoSearch"></my-search>
    </view>
   
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域 -->
    <view class="nav-list">
       <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
         <image :src="item.image_src" class="nav-img"></image>
       </view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层item项 -->
      <view class="floor-item" v-for="(item,index) in floorList" :key="index">
        <!-- 标题区域 -->
        <image :src="item.floor_title.image_src" class="floor_title"></image>
        <!-- 图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧图片区域 -->
          <navigator :url="item.product_list[0].url" class="left-img-box">
            <image :src="item.product_list[0].image_src" mode="widthFix" 
            :style="{width:item.product_list[0].image_width+'rpx'}"></image>
          </navigator>
          <!-- 右侧图片区域 -->
          <view class="right-img-box">
            <navigator  class="right-img-item" v-for="(item2,index2) in item.product_list"
            :key="index2" v-if="index2!==0" :url="item2.url">
            <image  :src="item2.image_src"  class="img-item"></image>
            </navigator> 
          </view> 
        </view>
      </view>
    </view>
  </view>
  
</template>

<script>
  export default {
    data() {
      return {
        //轮播图数据列表
        swiperList:[],
        //分类导航列表数据
        navList:[],
        //楼层列表数据
        floorList:[]
      };
    },
    onLoad(){
      //获取轮播图数据
    this.getSwiperList();
      //调用方法获取分类导航数据
     this.getNavList();
     //调用方法获取楼层列表数据
     this.getFloorList()
    },
    methods:{
       //获取轮播图数据的方法
     async getSwiperList(){
       //发送网络数据请求
      const {data:res}=await uni.$http.get('/api/public/v1/home/swiperdata')
      // console.log(res)
      //请求失败
      if(res.meta.status!==200){
        //调用弹框方法
        return uni.$showMsg()
      }
      //请求成功
        this.swiperList=res.message
        // uni.$showMsg('数据请求成功!')
      },
      //获取分类导航数据的方法
      async  getNavList(){
         const{data:res}=await uni.$http.get('/api/public/v1/home/catitems')
         // console.log(res)
         //请求失败
         if(res.meta.status!==200){
           //调用弹框方法
           return uni.$showMsg()
         }
         //请求成功
           this.navList=res.message
       },
       //获取楼层数据列表的方法
      async  getFloorList(){
         const {data:res } =await uni.$http.get('/api/public/v1/home/floordata')
         // console.log(res)
         //请求失败
         if(res.meta.status!==200) return uni.$showMsg()
         //请求成功
         // this.floorList=res.message
         //使用双层forEach循环处理url地址
         res.message.forEach(floor=>{
           floor.product_list.forEach(product=>{
             product.url='/subpkg/goods_list/goods_list?'+product.navigator_url.split('?')[1]
           })
         })
         // console.log(res.message)
         //给楼层列表数据重新赋值
         this.floorList=res.message
       },
       //导航栏事件处理函数
       navClickHandler(item){
         if(item.name==='分类'){
           uni.switchTab({
             'url':'/pages/cate/cate'
           })
         }
       },
       //搜索栏处理函数
       gotoSearch(){
         //跳转到搜索页面
         uni.navigateTo({
           url:'/subpkg/search/search'
         })
       }
    }
    
  }
</script>

<style lang="scss">
  .search-box{
    // 设置定位效果为“吸顶”
    position: sticky;
    top:0;
    z-index: 999;
  }
  swiper{
    height: 330rpx;
    .swiper-item,
    image{
      width: 100%;
      height: 100%;
    }
  }
 .nav-list{
   display: flex;
   justify-content: space-around;
   margin: 15px 0;
   .nav-item,.nav-img{
    width: 128rpx;
    height: 140rpx;
   }
 }
 .floor_title{
   width: 100%;
   height: 60rpx;
   display: flex;
 }
 .floor-img-box{
   display: flex;
   padding-left: 10rpx;
   .right-img-box{
     display: flex;
     flex-wrap:wrap;
     justify-content: space-around;
   }
   .img-item{
     width: 230rpx;
     height: 190rpx;
   }
 }
 
</style>

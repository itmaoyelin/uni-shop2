<template>
  <view>
    <!-- 商品列表区域 -->
    <view class="goods-list">
      <!-- 循环渲染自定义商品组件 -->
      <view v-for="(item,index) in goodsList" :key="index" @click="gotoDetail(item)">
         <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
       <my-goods :goods="item"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: { //参数对象
          query: '', //查询关键字
          cid: '', //商品Id
          pagenum: 1, //页码
          pagesize: 10, //每页多少条数据
        },
        //商品列表数据
        goodsList: [],
        //商品总数量
        total: 0,
        //是否开启节流阀
        isLoading:false
      };
    },
    methods: {
      //获取商品列表数据的方法
      async getGoodsList(cb) {
        // console.log('OK')
        //开启节流阀
        this.isLoading=true
        const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        //停止下拉刷新
        cb&&cb()
        //关闭节流阀
        this.isLoading=false
        //请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        //请求成功 把数据存入商品列表
        this.total = res.message.total
        //如果是下拉刷新操作
        if(cb) return this.goodsList = [...res.message.goods,...this.goodsList]
        //如果是上拉加载操作
        this.goodsList = [...this.goodsList,...res.message.goods]
        // console.log(res.message)
      },
      //跳转商品详情事件处理函数
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id
        })
      }
    },
    //监听上拉触底事件处理函数
    onReachBottom(){
      //判断当前页面数据是否请求完毕
      if(this.queryObj.pagenum*this.queryObj.pagesize>=this.total) return uni.$showMsg('数据加载完毕!')
      //判断是否开启了节流阀
      if(this.isLoading) return 
      // console.log('触底')
      //让页码值加一
      this.queryObj.pagenum+=1
      //重新获取商品列表数据
      this.getGoodsList()
    },
    //监听下拉刷新事件处理函数
    onPullDownRefresh(){
      // console.log('aaa')
      //判断当前页面数据是否请求完毕
      if(this.queryObj.pagenum*this.queryObj.pagesize>=this.total){
            uni.$showMsg('没有更多数据了!')
            uni.stopPullDownRefresh()
            return
      } 
      //重置关键数据
      this.queryObj.pagenum+=1
      // this.total=0
      this.isLoading=false
      // this.goodsList=[]
      //重新获取数据
      this.getGoodsList(()=>uni.stopPullDownRefresh())
      
    },
    onLoad(options) {
      // console.log(options)
      // 接收参数把参数存入参数对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // console.log(this.queryObj)
      //调用商品列表数据的方法获取数据
      this.getGoodsList()

    }
  }
</script>

<style lang="scss">
  
 
</style>

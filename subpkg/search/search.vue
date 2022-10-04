<template>
  <view class="search-container">
    <!-- 搜索框区域 -->
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
    <!-- 搜索建议列表区域 -->
    <view class="sugg-list" v-if="searchResults.length!==0">
      <view class="sugg-item" v-for="(item,index) in searchResults" :key="index" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="12"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史区域 按需 展示-->
    <view class="history-box" v-else>
      <!-- 历史标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="18" @click="clean"></uni-icons>
      </view>
      <!-- 历史列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,index) in historys" :key="index" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>

</template>

<script>
  export default {
    data() {
      return {
        //延时器timerId
        timer: null,
        //搜索关键字
        kw: '',
        //搜索结果列表
        searchResults: [],
        //搜索历史列表
        historyList: []
      };
    },
    computed: {
      historys() {
        //反转数组
        return [...this.historyList].reverse()
      }
    },
    methods: {
      //input事件处理函数
      input(e) {
        // console.log(e.value)
        //清除timer对应的延时器
        clearTimeout(this.timer)
        //重新启动一个延时器，并把timerId的值赋值给timer
        this.timer = setTimeout(() => {
          //trim()去除前后空格
          this.kw = e.value.trim()
          //根据关键字查询搜索列表
          this.getSearchList()
          //调用方法保存关键字
          this.saveSearchHistory()
          // console.log(this.kw)
        }, 500)
      },
      //保存搜索关键字到历史记录方法
      saveSearchHistory() {
        // this.historyList.push(this.kw)
        //set对象 解决关键字重复问题(将数组装换成set对象)
        const set = new Set(this.historyList)
        //先移除村存在的关键字
        set.delete(this.kw)
        //在添加新的关键字
        set.add(this.kw)
        //将set对象装换成数组重新赋值
        this.historyList = Array.from(set)
        // console.log(set)
        //对搜索历史记录进行持久化存储
        uni.setStorageSync('kw', JSON.stringify(this.historyList))

      },
      //获取搜索结果列表方法
      async getSearchList() {
        if (this.kw === '') return this.searchResults = []
        // console.log('ok')
        // 发起请求获取搜索列表数据
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        // console.log(res)
        //请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        //请求成功
        this.searchResults = res.message
      },
      //商品详情处理函数
      gotoDetail(gid) {
        //跳转到商品详情页
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + gid
        })
      },
      //跳转商品列表处理函数
      gotoGoodsList(kw){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query='+kw
        })
      },
      //清除历史记录事件处理函数
      clean(){
        //清除历史列表数据
        this.historyList=[]
        //清除本地数据存储
        uni.setStorageSync('kw','[]')
      }
    },
    onLoad(){
      //加载本地存储的历史记录
      this.historyList=JSON.parse(uni.getStorageSync('kw')||'[]')  
    }
  }
</script>

<style lang="scss">
  .search-box {
    //设置吸顶效果
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;

      .goods-name {
        font-size: 12px;
        white-space: nowrap; //文字不允许换行
        overflow: hidden;
        margin-right: 5px;
        //超出部分使用...代替
        text-overflow: ellipsis;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 5px;
      border-bottom: 2px solid #efefef;
      margin-bottom: 5px;
      font-size: 16px;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin: 5px 5px 0 0;

      }

    }
  }
</style>

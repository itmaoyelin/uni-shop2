<template>
  <view>
    <!-- 滚动视图区域 -->
    <view class="scroll-view-container">
      <!-- 左侧滚动视图区域 -->
      <view class="left-scroll-view">
        <scroll-view scroll-y :style="{height:wh+'px'}">
          <view v-for="(item,index) in cateList" :key="index">
            <view :class="['left-scroll-view-item ',active===index?'active':'']" @click="activeChange(index)">{{item.cat_name}}</view>
          </view>

        </scroll-view>
      </view>
      <!-- 右侧滚动视图区域 -->
      <view class="right-scroll-view">
        <scroll-view scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
          <view class="cate-lev2" v-for="(item,index) in cateLevel2" :key="index" v-if="item.children">
            <view class="cate-lev2-title">/{{item.cat_name==='其他'?'更多':item.cat_name}}/</view>
            <!-- 动态渲染三级分类列表数据 -->
            <view class="cate-lev3-list">
              <view class="cate-lev3-item" v-for="(item2,i2) in item.children" :key="i2" @click="gotoGoodsList(item2)">
              <image :src="item2.cat_icon"></image>
              <text>{{item2.cat_name}}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //分类列表数据
        cateList: [],
        //二级分类列表数据
        cateLevel2: [],

        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0, //窗口的可用高度 
        //当前选中项的索引，默认让第一项被选中
        active: 0,
        //滚动条距离顶部位置
        scrollTop: 0
      };
    },
    methods: {
      //获取分类列表数据的方法
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        // console.log(res)
        //请求失败
        if (res.meta.status !== 200) return uni.$showMsg()
        //请求成功
        this.cateList = res.message
        //把第一项赋值给二级列表
        this.cateLevel2 = res.message[0].children
      },
      //选中项改变事件处理函数
      activeChange(index) {
        //给索引重新赋值
        this.active = index
        //为二级分类列表重新赋值
        this.cateLevel2 = this.cateList[index].children
        //给右侧滚动条位置重新赋值
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 选中商品事件处理函数
      gotoGoodsList(item2){
        //跳转到商品列表页面
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid='+item2.cat_id
        })
      }
    },
    onLoad() {
      //调用方法获取分类列表数据
      this.getCateList()
      //获取当前系统信息
      const sysInfo = uni.getSystemInfoSync()
      // console.log(sysInfo)
      //把当前窗口可用高度赋值
      this.wh = sysInfo.windowHeight
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 100px;

      .left-scroll-view-item {
        background-color: #F7F7F7;
        text-align: center;
        line-height: 50px;
        font-size: 12px;

        // 激活项的样式
        &.active {
          background-color: #fff;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }

    .right-scroll-view {
      width: 100%;

      .cate-lev2-title {
        background-color: #F7F7F7;
        text-align: center;
        font-size: 12px;
        font-weight: bold;
        line-height: 50px;
      }

      .cate-lev3-list {
        display: flex;
        flex-wrap: wrap;

        .cate-lev3-item {
          display: flex;
          flex-direction: column;
          width: 33.3%;
          margin-bottom: 10px;
          align-items: center;

          image {
            width: 60px;
            height: 60px;
          }

          text {
            font-size: 12px;
          }
        }
      }
    }


  }
</style>

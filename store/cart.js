export default {
  // 为当前模块开启命名空间
  namespaced: true,
  // 模块的 state 数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart')||'[]') //解析出本地存储的购物车数据
  }), 
  // 模块的 mutations 方法
  mutations: {
    addToCart(state,goods){
      //查找商品信息对象
      const findResult=state.cart.find(x=>x.goods_id===goods.goods_id)
      // console.log(findResult)
      // console.log(state.cart)
      //如果商品不存在
      if(!findResult){
        //把商品信息加入购物车
        state.cart.push(goods)
      }else{
        //商品数量加一
        findResult.goods_count++
      }
       // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
        this.commit('m_cart/saveToStorage')
    },
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state){
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    },
    //更新购物车中商品的勾选状态
    updateGoodsState(state,goods){
       // 根据 goods_id 查询购物车中对应商品的信息对象
       const findResult=state.cart.find(x=>x.goods_id===goods.goods_id)
       //有对应商品信息对象
       if(findResult){
         //更新对应商品的勾选状态
         findResult.goods_state=goods.goods_state
         //调用方法将数据存到本地
         this.commit('m_cart/saveToStorage')
       }
    },
    //更新购物车中商品的数量
    updateGoodsCount(state,goods){
      //根据goods_id查询购物车中对应商品的信息对象
      const findResult=state.cart.find(x=>x.goods_id===goods.goods_id)
      if(findResult){
        // 更新对应商品的数量
        findResult.goods_count=goods.goods_count
        //调用方法将数据缓存到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    //更新所有商品的选中状态
    updateAllGoodsState(state,newState){
      //循环更新购物车商品的勾选状态
      state.cart.forEach(x=>x.goods_state=newState)
      //持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    //根据商品id删除对应的商品
    removeGoodsById(state,goods_id){
      //调用数组的filter方法进行过滤
      state.cart=state.cart.filter(x=>x.goods_id!==goods_id)
      //持久化保存到本地
      this.commit('m_cart/saveToStorage')
    }
    
    
  },

  // 模块的 getters 属性
  getters: {
    //计算购物车中商品总数量
    total(state){
      let c=0
      // 循环统计商品的数量，累加到变量 c 中
      state.cart.forEach(goods=>c+=goods.goods_count)
      return c
    },
    //计算购物车中选中商品的总数量
    checkedCount(state){
        // 先使用 filter 方法，从购物车中过滤器已勾选的商品
        // 再使用 reduce 方法，将已勾选的商品总数量进行累加
        // reduce() 的返回值就是已勾选的商品的总数量
        return  state.cart.filter(x=>x.goods_state).reduce((total,item)=>total+=item.goods_count,0)
    },
    //计算购物车中选中商品的总价
    checkedGoodsAmount(state){
      return state.cart.filter(x=>x.goods_state)
                       .reduce((total,goods)=>total+=goods.goods_count*goods.goods_price,0)
                       .toFixed(2)
    }
  },
}

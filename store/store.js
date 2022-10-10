import Vue from 'vue'
import Vuex from 'vuex'
//导入购物车的vuex模块
import moduleCart from '@/store/cart.js'
//导入用户的vuex模块
import moduleUser from '@/store/user.js'

//使用vuex插件
Vue.use(Vuex)
//创建store实例对象
const store= new Vuex.Store({
  //挂载 store模块
  modules:{
      // 2. 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
     //购物车模块中 cart 数组的访问路径是 m_cart/cart
        m_cart: moduleCart,
       // 挂载用户的 vuex 模块，访问路径为 m_user
        m_user: moduleUser
  }
})
//向外导出store实例
export default  store
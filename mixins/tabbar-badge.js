 import {mapGetters} from 'vuex'
	export default {
    computed:{
        // 将 m_cart 模块中的 total 映射为当前页面的计算属性
         ...mapGetters('m_cart', ['total']),
    },
    methods:{
      //设置徽标方法
      setBadge(){
        //移除徽标
        if(this.total===0) return uni.removeTabBarBadge({index:2})
        //调用方法设置tabBar数字徽标
        uni.setTabBarBadge({
          index:2,
          text:this.total+'' // 注意：text 的值必须是字符串，不能是数字
        })
      }
    },
    watch:{
      //监听total的变化
      total(){
       //调用方法设置购物车数字徽标
       this.setBadge()
      }
    },
    onShow(){
      //调用方法设置购物车数字徽标
      this.setBadge()
    }
	}
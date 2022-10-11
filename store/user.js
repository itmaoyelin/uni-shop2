export default{
  namespaced:true ,//允许开启命名空间
  //数据
  state:()=>({
    //收货地址
    address:JSON.parse(uni.getStorageSync('address')||'{}'),
    //登录成功之后的token字符串
    token:uni.getStorageSync('token')||'',
    //用户的基本信息
    userinfo:JSON.parse(uni.getStorageSync('userinfo')||'{}'),
    // 重定向的 object 对象 { openType, from }
    redirectInfo:null
  }),
  //方法
  mutations:{
    //更新收货地址
    updateAddress(state,address){
    state.address=address
      //调用方法持久化存储
    this.commit('m_user/saveAddressToStorage')
    },
    //更新用户基本信息
    updateUserInfo(state,userinfo){
      state.userinfo=userinfo
      // 调用commit方法把信息持久化存储
      this.commit('m_user/saveUserInfoToStorage')
    },
    //更新token
    updateToken(state,token){
      state.token=token
      // 将token持久化存储到本地
      this.commit('m_user/saveTokenToStorage')
    },
     // 更新重定向的信息对象
     updateRedirectInfo(state,info){
       state.redirectInfo=info
     },
    //将地址持久化保存到本地的方法
    saveAddressToStorage(state){
      uni.setStorageSync('address',JSON.stringify(state.address))
    },
    //将用户的基本信息持久化保存到本地的方法
    saveUserInfoToStorage(state){
      uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
    },
    //将token持久化存储到本地
    saveTokenToStorage(state){
      uni.setStorageSync('token',state.token)
    }
  },
  //数据包装器
  getters:{
    addstr(state){
      if(!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}



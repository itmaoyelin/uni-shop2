export default{
  namespaced:true ,//允许开启命名空间
  //数据
  state:()=>({
    address:JSON.parse(uni.getStorageSync('address')||'{}')
  }),
  //方法
  mutations:{
    //更新收货地址
    updateAddress(state,address){
    state.address=address
      //调用方法持久化存储
    this.commit('m_user/saveAddressToStorage')
    },
    //持久化保存到本地的方法
    saveAddressToStorage(state){
      uni.setStorageSync('address',JSON.stringify(state.address))
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



<template>
	<view>
		{{querys.query}}---商品列表
	</view>
</template>

<script>
	export default {
		data() {
			return {
				querys:{}, //参数
			};
		},
    onLoad(options){
      // console.log(options)
      // 接收参数
      this.querys=options
      
    }
	}
</script>

<style lang="scss">

</style>

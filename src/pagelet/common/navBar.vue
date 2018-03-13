<template>
		
	<el-menu
		:default-active="activeIndex"
		class="el-menu-demo"
		mode="horizontal"
		background-color="#545c64"
		text-color="#fff"
		active-text-color="#ffd04b">
		<el-menu-item index="1"><router-link to="/track" >基因组浏览器</router-link></el-menu-item>
		<el-menu-item index="2"><router-link to="/track" >基因关联</router-link></el-menu-item>
		<el-menu-item index="3"><router-link to="/setting" >设置</router-link></el-menu-item>
	</el-menu>
	
</template>

<script>
  	export default {
	    data() {
		    return {
		        activeIndex: '1'
		    };
	    },
		methods: {

		}
	}
</script>

<style lang="less" scoped>
	

</style>

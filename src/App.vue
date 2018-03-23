<template>
		
	<div class="app">
		
		<navBar></navBar>

		<router-view></router-view>
	</div>
	
</template>

<script>
import navBar from './pagelet/common/navBar.vue'

  	export default {
	    data () {
	      	return {
	      	}
	    },
		components: {
	        navBar
		}
	}
</script>

<style lang="less" scoped>
	
	.app{
		padding-bottom:30px; 
		h1{
			padding: 30px 40px;

			span{
				color: gray;
				font-family: "Open Sans", sans-serif;
			}
		}
	}
	

</style>

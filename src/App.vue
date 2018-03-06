<template>

	<div>
		
		<div>
			<h1><span>基因组浏览器</span></h1>

			<router-view></router-view>
		</div>



	</div>
	
</template>

<script>

  export default {
    data () {
      return {
      }
    }
  }
</script>

<style lang="less" scoped>
	h1{
		padding: 30px 40px;

		span{
			color: gray;
			font-family: "Open Sans", sans-serif;
		}
	}

</style>

<template>

	<div>
		
		<div>
			<h1><span>基因组浏览器</span></h1>

			<div>
				<el-button>默认按钮</el-button>
				<el-button type="primary">主要按钮</el-button>
				<el-button type="success">成功按钮</el-button>
				<el-button type="info">信息按钮</el-button>
				<el-button type="warning">警告按钮</el-button>
				<el-button type="danger">危险按钮</el-button>
			</div>
		</div>


		<router-view></router-view>
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

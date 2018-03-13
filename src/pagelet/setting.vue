<template>
		
	<div id="setting">
		<el-form ref="form" :model="form" label-width="300px" :rules="rules">
			<el-form-item label="缩小区域高度(单位 px)" prop="denseAreaHeight">
				<el-input v-model.number="form.denseAreaHeight"></el-input>
			</el-form-item>
			<el-form-item label="缩小区域渲染像素(单位 px/碱基)" prop="denseAreaZoom">
				<el-input v-model.number="form.denseAreaZoom"></el-input>
			</el-form-item>
			<el-form-item label="放大区域高度(单位 px)" prop="zoomAreaHeight">
				<el-input v-model.number="form.zoomAreaHeight"></el-input>
			</el-form-item>

			<template v-for="(zoomArea, index) in form.zoomAreaConfig">
				<el-form-item :label="'放大区' + (index+1) + '高度'" >
			    	<el-input v-model.number="zoomArea.height"></el-input>
			 	</el-form-item>
				<el-form-item :label="'放大区' + (index+1) + '倍率'" >
					<el-input v-model.number="zoomArea.zoom"></el-input>
			 	</el-form-item>
			 	<el-form-item>
			 		<el-button @click.prevent="removeZoomArea(zoomArea)">删除</el-button>
			 	</el-form-item>
			</template>

			<el-form-item>
			    <el-button @click="addZoomArea">增加放大区</el-button>
			</el-form-item>

			<el-form-item label="单次移动区域长度(单位 px)" prop="step">
				<el-input v-model.number="form.step"></el-input>
			</el-form-item>

		  <!-- <el-form-item label="活动区域">
		    <el-select v-model="form.region" placeholder="请选择活动区域">
		      <el-option label="区域一" value="shanghai"></el-option>
		      <el-option label="区域二" value="beijing"></el-option>
		    </el-select>
		  </el-form-item>
		  
		  <el-form-item label="即时配送">
		    <el-switch v-model="form.delivery"></el-switch>
		  </el-form-item>
		  
		  <el-form-item label="活动性质">
		    <el-checkbox-group v-model="form.type">
		      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
		      <el-checkbox label="地推活动" name="type"></el-checkbox>
		      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
		      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
		    </el-checkbox-group>
		  </el-form-item> -->
			<el-form-item>
				<el-button type="primary" @click="onSubmit">提交</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>
	</div>
	
</template>

<script>

import axios from 'axios'

  	export default {
	    data () {
	      	return {
	      		form:{
	      			denseAreaHeight:100,
	      			denseAreaZoom:1,
	      			zoomAreaHeight:600,
	      			step:400,
					zoomAreaConfig:[{
		      			height:100,
		      			zoom:4
		      		}]
	      		},
	      		rules:{
	      			denseAreaHeight: [
		            	{ type: 'number', message: '缩小区域高度为数字', trigger: 'blur' },
		            	{ validator:function(rule,value,callback){
				            if(value > 1000 || value < 100){
				                callback(new Error("缩小区域高度在 100 到 1000 之间"));
				            }else{
				                callback();
				            }
				        }, trigger: 'blur'}
		          	],
		          	denseAreaZoom: [
		            	{ type: 'number', message: '缩小区域渲染像素为数字', trigger: 'blur' },
		          	],
					zoomAreaHeight: [
		            	{ type: 'number', message: '放大区域高度为数字', trigger: 'blur' },
		            	{ validator:function(rule,value,callback){
				            if(value > 3000 || value < 100){
				                callback(new Error("放大区域高度在 100 到 3000 之间"));
				            }else{
				                callback();
				            }
				        }, trigger: 'blur'}
		          	],
		          	step: [
		            	{ type: 'number', message: '单次移动区域长度为数字', trigger: 'blur' },
		          	],
	      		}
	      	}
	    },
	    mounted(){
			let _this = this;
			axios.get('/api/setting/get',)
			.then(function (response) {
				//console.log(response);
				_this.form = response.data
			})
			.catch(function (error) {
				console.log(error);
			});
	    },
	    methods:{
		    removeZoomArea(item) {
		        let index = this.form.zoomAreaConfig.indexOf(item)
		        if (index !== -1) {
		            this.form.zoomAreaConfig.splice(index, 1)
		        }
		    },
		    addZoomArea() {
		        this.form.zoomAreaConfig.push({
		    	    height: '',
		            zoom: ''
		        });
		    },
		    validateZoomAreaConfig(data){
                if(Object.prototype.toString.call(data) !== '[object Array]'){
                    console.error('setZoomAreaConfig:参数必须为数组')
                    return false;
                }
                data.forEach(function(zoomArea){
                    if(!zoomArea.hasOwnProperty('height') || !zoomArea.hasOwnProperty('zoom') || !zoomArea.height || !zoomArea.zoom || isNaN(zoomArea.height) || isNaN(zoomArea.zoom)){
                    	alert('需要为每一个放大区域指定高度和倍率，二者为数字且不能为0');
                        console.error('setZoomAreaConfig:需要为每一个放大区域指定height和zoom');
                        return false;
                    }
                    if(zoomArea.height % zoomArea.zoom ){
                    	alert('放大区高度必须是倍率的倍数');
                        console.error('setZoomAreaConfig:同一放大区域的height必须是zoom的倍数');
                        return false;
                    }
                    if(zoomArea.height <= zoomArea.zoom ){
                    	alert('放大区高度必须大于倍率');
                        console.error('setZoomAreaConfig:同一放大区域的height必须大于等于zoom');
                        return false;
                    }
                })
                return true;
            },
		    onSubmit(){
		    	if(this.validateZoomAreaConfig(this.form.zoomAreaConfig)){
		    		//console.log(JSON.stringify(this.form));

					axios.post('/api/setting/set', {
					    data: JSON.stringify(this.form, Symbol(""), 4)
					})
					.then(function (response) {
					    console.log(response);
					})
					.catch(function (error) {
					    console.log(error);
					});
		    	}
		    }
	    },
		components: {
		}
	}
</script>

<style lang="less" scoped>
	
	#setting{
		padding: 20px 100px;
	}
	

</style>

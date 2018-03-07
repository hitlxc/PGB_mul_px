<template>

    <div class="track-wrap">
        <div class="tool-bar">
            <div class="zoom-in">
                <i class="el-icon-circle-plus-outline">放大</i>
                <el-button-group>
                    <el-button type="primary" @click="zoom('in',2)">x2</el-button>
                    <el-button type="primary" @click="zoom('in',4)">x4</el-button>
                    <el-button type="primary" @click="zoom('in',8)">x8</el-button>
                    <el-button type="primary" @click="zoom('in',16)">x16</el-button>
                </el-button-group>
            </div>
            
            <div class="zoom-out">
                <i class="el-icon-remove-outline">缩小</i>
                <el-button-group>
                    <el-button type="primary" @click="zoom('out',2)">x2</el-button>
                    <el-button type="primary" @click="zoom('out',4)">x4</el-button>
                    <el-button type="primary" @click="zoom('out',8)">x8</el-button>
                    <el-button type="primary" @click="zoom('out',16)">x16</el-button>
                </el-button-group>
            </div>
        </div>
        
        
        <div class="canvas-wrap">
            <div class="canvas-outer">
                <canvas id="base" width="20" height="500" ></canvas>
                <canvas id="sequnce" width="200" height="500" :style="{ transform: 'scaleY(' +scaleTimes+ ') translateY(' +translatePercent+ '%)'  }"></canvas>
            </div>
        </div>

    </div>
</template>

<script>

    import track from '../../mock/track.json'

    export default {
        data() {
            return {
                width:10,
                sequnce:track.sequnce,
                sequnceColor:{
                    A:"#FF0066",
                    T:"#857AB9",
                    G:"#F9C238",
                    C:"#7AC583"
                },
                scaleTimes:1.0,
                translatePercent:0,
            }
        },
        mounted(){
            this.drawSequnce();
            this.drawBase();
        },
        methods: {
            drawSequnce(){
                let _this = this;
                let sequnce = document.getElementById("sequnce");
                let sequnceContext = sequnce.getContext("2d");
                for (let i = 0;i<_this.sequnce.length;i++){
                    let base = _this.sequnce[i];
                    if(base == 'A') {
                        sequnceContext.fillStyle = _this.sequnceColor.A;
                    }
                    if(base == 'T') {
                        sequnceContext.fillStyle = _this.sequnceColor.T;
                    }
                    if(base == 'G') {
                        sequnceContext.fillStyle = _this.sequnceColor.G;
                    }
                    if(base == 'C') {
                        sequnceContext.fillStyle = _this.sequnceColor.C;
                    }
                    sequnceContext.fillRect(50, i*_this.width, 100, _this.width);
                }

            },
            drawBase(){
                let _this = this;
                let base = document.getElementById("base");
                let baseContext = base.getContext("2d");
                baseContext.clearRect(0, 0, base.width, base.height);
                if(_this.scaleTimes<1) return;
                for (let i = 0;i<_this.sequnce.length;i++){
                    let base = _this.sequnce[i];
                    if(base == 'A') {
                        baseContext.fillStyle = _this.sequnceColor.A;
                        baseContext.fillText('A', 0, (i+1)*_this.width*_this.scaleTimes);
                    }
                    if(base == 'T') {
                        baseContext.fillStyle = _this.sequnceColor.T;
                        baseContext.fillText('T', 0, (i+1)*_this.width*_this.scaleTimes);
                    }
                    if(base == 'G') {
                        baseContext.fillStyle = _this.sequnceColor.G;
                        baseContext.fillText('G', 0, (i+1)*_this.width*_this.scaleTimes);
                    }
                    if(base == 'C') {
                        baseContext.fillStyle = _this.sequnceColor.C;
                        baseContext.fillText('C', 0, (i+1)*_this.width*_this.scaleTimes);
                    }
                }
            },
            zoom(type, num){
                console.log(type,num)
                if(type == 'in'){
                    this.scaleTimes *= num; 
                }
                if(type == 'out'){
                    this.scaleTimes /= num; 
                }
                this.translatePercent = -(1-this.scaleTimes)/this.scaleTimes*50;
                this.drawBase();
            }
        }
    }


</script>

<style lang="less" scoped>
    .track-wrap{
        width:1000px;
        max-width:100%;
        margin:auto;
        

        .tool-bar{
            display: flex;
            justify-content: space-around;
            padding: 20px;
            height: 80px;
        }


        .canvas-wrap{
            width:100%;
            height:1000px;
            overflow: hidden;
            box-sizing: border-box;
            border:1px solid #000;
            /*margin-top:-100%;*/

            .canvas-outer{
                width:100%;
                height: 300%;
            }
            #sequnce{
            }
        }
    }
</style>
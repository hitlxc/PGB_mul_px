<template>

    <div class="track-wrap">
        <div class="tool-bar">
            <!-- <div class="zoom-in">
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
            </div> -->

            <div class="move">
                <i class="el-icon-remove-outline">移动</i>
                <el-button-group>
                    <el-button type="primary" @click="move('up',400)" icon="el-icon-arrow-up">向上</el-button>
                    <el-button type="primary" @click="move('down',400)" icon="el-icon-arrow-down">向下</el-button>
                </el-button-group>
            </div>
        </div>
        
        
        <div class="canvas-wrap">
            <div class="canvas-outer">
                <div class="canvas-top">
                    <canvas id="base-top" width="50" height="300" ></canvas>
                    <canvas id="sequnce-top" width="200" height="300" ></canvas>
                </div>
                <div class="canvas-mid">
                    <canvas id="base-mid" width="50" height="300" ></canvas>
                    <canvas id="sequnce-mid" width="200" height="300" ></canvas>
                </div>
                <div class="canvas-bottom">
                    <canvas id="base-bottom" width="50" height="300" ></canvas>
                    <canvas id="sequnce-bottom" width="200" height="300" ></canvas>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

    import track from '../../mock/track.json'

    export default {
        data() {
            return {
                width:1,
                sequnce:track.sequnce.slice(0,650),
                start:0,
                end:650,
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
            console.time('渲染')
            this.drawSequnce();
            this.drawBase();
            var end = new Date().getTime(); // 结束时间
            console.timeEnd('渲染')
        },
        methods: {
            drawSequnce(){
                let _this = this;
                let sequnceTop = document.getElementById("sequnce-top");
                let sequnceTopContext = sequnceTop.getContext("2d");
                sequnceTopContext.clearRect(0, 0, sequnceTop.width, sequnceTop.height);

                let sequnceTopData = this.sequnce.slice(0,sequnceTop.height/this.width);
                let sequnceMidData = this.sequnce.slice(sequnceTop.height/this.width,sequnceTop.height/this.width+50*this.width);
                let sequnceBottomData = this.sequnce.slice(sequnceTop.height/this.width+50*this.width,sequnceTop.height/this.width*2+50*this.width);

                for (let i = 0; i<sequnceTopData.length; i++){
                    let base = sequnceTopData[i];
                    sequnceTopContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    sequnceTopContext.fillRect(50, i*_this.width, 100, _this.width);
                }

                let sequnceMid = document.getElementById("sequnce-mid");
                let sequnceMidContext = sequnceMid.getContext("2d");
                sequnceMidContext.clearRect(0, 0, sequnceMid.width, sequnceMid.height);

                for (let i = 0;i<sequnceMidData.length*0.4;i++){
                    let base = sequnceMidData[i];
                    sequnceMidContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    sequnceMidContext.fillRect(50, i*_this.width*5, 100, _this.width*5);
                }
                for (let i = sequnceMidData.length*0.4;i<sequnceMidData.length*0.6;i++){
                    let base = sequnceMidData[i];
                    sequnceMidContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    sequnceMidContext.fillRect(50, (i-sequnceMidData.length*0.4)*_this.width*10 + sequnceMid.height/3, 100, _this.width*10);
                }
                for (let i = sequnceMidData.length*0.6;i<sequnceMidData.length;i++){
                    let base = sequnceMidData[i];
                    sequnceMidContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    sequnceMidContext.fillRect(50, (i-sequnceMidData.length*0.6)*_this.width*5+ sequnceMid.height/3*2, 100, _this.width*5);
                }

                let sequnceBottom = document.getElementById("sequnce-bottom");
                let sequnceBottomContext = sequnceBottom.getContext("2d");
                sequnceBottomContext.clearRect(0, 0, sequnceBottom.width, sequnceBottom.height);

                for (let i = 0; i<sequnceBottomData.length; i++){
                    let base = sequnceBottomData[i];
                    sequnceBottomContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    sequnceBottomContext.fillRect(50, i*_this.width, 100, _this.width);
                }

            },
            drawBase(){
                let _this = this;
                let baseTop = document.getElementById("base-top");
                let baseTopContext = baseTop.getContext("2d");
                baseTopContext.clearRect(0, 0, baseTop.width, baseTop.height);
                //if(_this.scaleTimes<1) return;

                let sequnceTopData = this.sequnce.slice(0,baseTop.height/this.width);
                let sequnceMidData = this.sequnce.slice(baseTop.height/this.width,baseTop.height/this.width+50*this.width);
                let sequnceBottomData = this.sequnce.slice(baseTop.height/this.width+50*this.width,baseTop.height/this.width*2+50*this.width);

                for (let i = 0;i<sequnceTopData.length;i++){
                    if(i%10) continue;
                    let base = sequnceTopData[i];
                    baseTopContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    baseTopContext.fillText(base+(i+_this.start), 0, (i+10)*_this.width);
                }

                let baseMid = document.getElementById("base-mid");
                let baseMidContext = baseMid.getContext("2d");
                baseMidContext.clearRect(0, 0, baseMid.width, baseMid.height);
                //if(_this.scaleTimes<1) return;
                for (let i = 0;i<sequnceMidData.length;i++){
                    if(i%10) continue;
                    let base = sequnceMidData[i];
                    baseMidContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    baseMidContext.fillText(base+(i+_this.start+300), 0, (i+10)*_this.width*5);
                }

                let baseBottom = document.getElementById("base-bottom");
                let baseBottomContext = baseBottom.getContext("2d");
                baseBottomContext.clearRect(0, 0, baseBottom.width, baseBottom.height);
                //if(_this.scaleTimes<1) return;
                for (let i = 0;i<sequnceBottomData.length;i++){
                    if(i%10) continue;
                    let base = sequnceBottomData[i];
                    baseBottomContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    baseBottomContext.fillText(base+(i+_this.start+350), 0, (i+10)*_this.width);
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
            },
            move(type, num){
                if(type == 'up'){
                    if(num > this.start){
                        this.start = 0;
                        this.end = this.start + 650;
                    }else{
                        this.start -= num
                        this.end -= num
                    }
                }
                if(type == 'down'){
                    if (this.end+num > track.sequnce.length) {
                        this.end = track.sequnce.length;
                        this.start = this.end - 650;
                    }else{
                        this.start += num
                        this.end += num
                    }
                }
                this.sequnce = track.sequnce.slice(this.start,this.end);
                this.drawBase();
                this.drawSequnce();
            }
        }
    }


</script>

<style lang="less" scoped>
    .track-wrap{
        width:800px;
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
            box-sizing: border-box;
            border:1px solid #000;

            .canvas-outer{
                width:100%;

                .canvas-mid{
                    border: 4px solid;    
                    width: 100%;
                    box-sizing: content-box;
                    margin-left: -4px;
                }
            }
            #sequnce{

            }
        }
    }
</style>
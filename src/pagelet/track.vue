<template>

    <div class="track-wrap">
        <div class="tool-bar">

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
                <div class="canvas-top" :style="{ height: denseAreaHeight + 'px' }">
                    <canvas id="base-top" width="50" :height="denseAreaHeight" ></canvas>
                    <canvas id="sequnce-top" width="200" :height="denseAreaHeight" ></canvas>
                </div>
                <div class="canvas-mid" :style="{ height: zoomAreaHeight + 'px' }">
                    <canvas id="base-mid" width="50" :height="zoomAreaHeight" ></canvas>
                    <canvas id="sequnce-mid" width="200" :height="zoomAreaHeight" ></canvas>
                </div>
                <div class="canvas-bottom" :style="{ height: denseAreaHeight + 'px' }">
                    <canvas id="base-bottom" width="50" :height="denseAreaHeight" ></canvas>
                    <canvas id="sequnce-bottom" width="200" :height="denseAreaHeight" ></canvas>
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
                zoomAreaHeight:600,
                denseAreaHeight:100,
                zoomAreaConfig:[
                    {height:120,zoom:12},
                    {height:120,zoom:8},
                    {height:120,zoom:30},
                    {height:120,zoom:8},
                    {height:120,zoom:12}
                ]
            }
        },
        mounted(){
            console.time('渲染')
            this.drawSequnce();
            this.drawBase();
            var end = new Date().getTime(); // 结束时间
            console.timeEnd('渲染');
        },
        methods: {
            drawSequnce(){
                let _this = this;
                let sequnceTop = document.getElementById("sequnce-top");
                let sequnceTopContext = sequnceTop.getContext("2d");
                sequnceTopContext.clearRect(0, 0, sequnceTop.width, sequnceTop.height);
                
                let sequnceMid = document.getElementById("sequnce-mid");
                let sequnceMidContext = sequnceMid.getContext("2d");

                let sequnceBottom = document.getElementById("sequnce-bottom");
                let sequnceBottomContext = sequnceBottom.getContext("2d");

                

                //放大区碱基数
                let sequnceMidLenght = 0;
                for(let i = 0; i < this.zoomAreaConfig.length;i++){
                    sequnceMidLenght += this.zoomAreaConfig[i].height/this.zoomAreaConfig[i].zoom/this.width;
                }

                let sequnceTopData = this.sequnce.slice(0, sequnceTop.height/this.width);
                let sequnceMidData = this.sequnce.slice(sequnceTop.height/this.width, sequnceTop.height/this.width+sequnceMidLenght);
                let sequnceBottomData = this.sequnce.slice(sequnceTop.height/this.width+sequnceMidLenght, sequnceTop.height/this.width+sequnceMidLenght+sequnceBottom.height/this.width);

                for (let i = 0; i<sequnceTopData.length; i++){
                    let base = sequnceTopData[i];
                    sequnceTopContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    sequnceTopContext.fillRect(50, i*_this.width, 100, _this.width);
                }
                
                sequnceMidContext.clearRect(0, 0, sequnceMid.width, sequnceMid.height);

                let paintedBase = 0;
                let paintedHeight = 0;
                let baseMidIndex = 0;

                for(let i = 0; i < this.zoomAreaConfig.length; i++){
                    let height = this.zoomAreaConfig[i].height;
                    let zoom = this.zoomAreaConfig[i].zoom;

                    for (let i = 0; i < height/zoom/this.width; i++){
                        let base = sequnceMidData[baseMidIndex++];
                        sequnceMidContext.fillStyle = _this.sequnceColor[base] || '#fff';
                        sequnceMidContext.fillRect(50, i*_this.width*zoom + paintedHeight, 100, _this.width*zoom);
                    }
                    paintedBase += height/zoom/this.width;
                    paintedHeight += height;
                }

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

                let baseMid = document.getElementById("base-mid");
                let baseMidContext = baseMid.getContext("2d");

                let baseBottom = document.getElementById("base-bottom");
                let baseBottomContext = baseBottom.getContext("2d");

                baseTopContext.clearRect(0, 0, baseTop.width, baseTop.height);

                //放大区碱基数
                let sequnceMidLenght = 0;
                for(let i = 0; i < this.zoomAreaConfig.length;i++){
                    sequnceMidLenght += this.zoomAreaConfig[i].height/this.zoomAreaConfig[i].zoom/this.width;
                }

                let sequnceTopData = this.sequnce.slice(0, baseTop.height/this.width);
                let sequnceMidData = this.sequnce.slice(baseTop.height/this.width, baseTop.height/this.width+sequnceMidLenght);
                let sequnceBottomData = this.sequnce.slice(baseTop.height/this.width+sequnceMidLenght, baseTop.height/this.width+sequnceMidLenght+baseBottom.height/this.width);


                for (let i = 0;i<sequnceTopData.length;i++){
                    if(i%10) continue;
                    let base = sequnceTopData[i];
                    baseTopContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    baseTopContext.fillText(base+(i+_this.start), 0, (i+10)*_this.width);
                }
                
                baseMidContext.clearRect(0, 0, baseMid.width, baseMid.height);

                let paintedBase = baseTop.height/this.width;
                let paintedHeight = 0;
                let baseMidIndex = 0;

                for(let i = 0; i < this.zoomAreaConfig.length; i++){
                    let height = this.zoomAreaConfig[i].height;
                    let zoom = this.zoomAreaConfig[i].zoom;

                    for (let i = 0; i < height/zoom/this.width; i++){
                        let base = sequnceMidData[baseMidIndex++];
                        if((i+_this.start+paintedBase)%~~(20/zoom) ){continue}
                        baseMidContext.fillStyle = _this.sequnceColor[base] || '#fff';
                        baseMidContext.fillText(base+(i+_this.start+paintedBase), 0, i*_this.width*zoom+10+paintedHeight);
                    }
                    paintedBase += ~~(height/zoom)/this.width;
                    paintedHeight += height;
                }
                
                baseBottomContext.clearRect(0, 0, baseBottom.width, baseBottom.height);

                for (let i = 0;i<sequnceBottomData.length;i++){
                    if((i+_this.start+paintedBase)%10) continue;
                    let base = sequnceBottomData[i];
                    baseBottomContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    baseBottomContext.fillText(base+(i+_this.start+paintedBase), 0, (i+10)*_this.width);
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
            },
            setZoomAreaConfig(data){
                if(Object.prototype.toString.call(data) !== '[object Array]'){
                    console.error('setZoomAreaConfig:参数必须为数组')
                    return;
                }
                data.forEach(function(zoomArea){
                    if(!zoomArea.hasOwnProperty('height') || !zoomArea.hasOwnProperty('zoom')){
                        console.error('setZoomAreaConfig:需要为每一个放大区域指定height和zoom');
                        return;
                    }
                    if(zoomArea.height % zoomArea.zoom ){
                        console.error('setZoomAreaConfig:同一放大区域的height必须是zoom的倍数');
                        return;
                    }
                    if(zoomArea.height <= zoomArea.zoom ){
                        console.error('setZoomAreaConfig:同一放大区域的height必须大于等于zoom');
                        return;
                    }
                })
                
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
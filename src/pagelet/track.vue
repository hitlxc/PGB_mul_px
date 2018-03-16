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
                    <canvas id="variants-top" width="200" :height="denseAreaHeight" ></canvas>
                </div>
                <div class="canvas-mid" :style="{ height: zoomAreaHeight + 'px' }">
                    <canvas id="base-mid" width="50" :height="zoomAreaHeight" ></canvas>
                    <canvas id="sequnce-mid" width="200" :height="zoomAreaHeight" ></canvas>
                    <canvas id="variants-mid" width="200" :height="zoomAreaHeight" ></canvas>
                </div>
                <div class="canvas-bottom" :style="{ height: denseAreaHeight + 'px' }">
                    <canvas id="base-bottom" width="50" :height="denseAreaHeight" ></canvas>
                    <canvas id="sequnce-bottom" width="200" :height="denseAreaHeight" ></canvas>
                    <canvas id="variants-bottom" width="200" :height="denseAreaHeight" ></canvas>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

    import axios from 'axios';
    import track from '../../mock/track.json'

    export default {
        data() {
            return {
                denseAreaZoom:1,
                sequnce:track.sequnce.slice(0,650),
                variants:track.variants,
                start:0,
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
        async mounted(){
            console.time('渲染');

            let _this = this;
            await axios.get('/api/setting/get',)
            .then(function (response) {
                _this.zoomAreaHeight = response.data.zoomAreaHeight || 600;
                _this.denseAreaHeight = response.data.denseAreaHeight || 100;
                _this.denseAreaZoom = response.data.denseAreaZoom || 1;
                _this.zoomAreaConfig = response.data.zoomAreaConfig || [
                    {height:120,zoom:12},
                    {height:120,zoom:8},
                    {height:120,zoom:30},
                    {height:120,zoom:8},
                    {height:120,zoom:12}
                ];
            })
            .catch(function (error) {
                console.log(error);
            });

            this.drawAll();
            let end = new Date().getTime(); // 结束时间
            console.timeEnd('渲染');
        },
        methods: {
            drawAll(){
                this.drawBase();
                this.drawSequnce();
                this.drawVariants();
            },
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
                    sequnceMidLenght += this.zoomAreaConfig[i].height/this.zoomAreaConfig[i].zoom/this.denseAreaZoom;
                }

                let sequnceTopData = this.sequnce.slice(0, sequnceTop.height/this.denseAreaZoom);
                let sequnceMidData = this.sequnce.slice(sequnceTop.height/this.denseAreaZoom, sequnceTop.height/this.denseAreaZoom+sequnceMidLenght);
                let sequnceBottomData = this.sequnce.slice(sequnceTop.height/this.denseAreaZoom+sequnceMidLenght, sequnceTop.height/this.denseAreaZoom+sequnceMidLenght+sequnceBottom.height/this.denseAreaZoom);

                for (let i = 0; i<sequnceTopData.length; i++){
                    let base = sequnceTopData[i];
                    sequnceTopContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    sequnceTopContext.fillRect(50, i*_this.denseAreaZoom, 100, _this.denseAreaZoom);
                }
                
                sequnceMidContext.clearRect(0, 0, sequnceMid.width, sequnceMid.height);

                let paintedBase = 0;
                let paintedHeight = 0;
                let baseMidIndex = 0;

                for(let i = 0; i < this.zoomAreaConfig.length; i++){
                    let height = this.zoomAreaConfig[i].height;
                    let zoom = this.zoomAreaConfig[i].zoom;

                    for (let i = 0; i < height/zoom/this.denseAreaZoom; i++){
                        let base = sequnceMidData[baseMidIndex++];
                        sequnceMidContext.fillStyle = _this.sequnceColor[base] || '#fff';
                        sequnceMidContext.fillRect(50, i*_this.denseAreaZoom*zoom + paintedHeight, 100, _this.denseAreaZoom*zoom);
                    }
                    paintedBase += height/zoom/this.denseAreaZoom;
                    paintedHeight += height;
                }

                sequnceBottomContext.clearRect(0, 0, sequnceBottom.width, sequnceBottom.height);

                for (let i = 0; i<sequnceBottomData.length; i++){
                    let base = sequnceBottomData[i];
                    sequnceBottomContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    sequnceBottomContext.fillRect(50, i*_this.denseAreaZoom, 100, _this.denseAreaZoom);
                }

            },
            drawVariants(){
                let _this = this;
                let variantsTop = document.getElementById("variants-top");
                let variantsTopContext = variantsTop.getContext("2d");
                variantsTopContext.clearRect(0, 0, variantsTop.width, variantsTop.height);

                let variantsMid = document.getElementById("variants-mid");
                let variantsMidContext = variantsMid.getContext("2d");
                variantsMidContext.clearRect(0, 0, variantsMid.width, variantsMid.height);

                let variantsBottom = document.getElementById("variants-bottom");
                let variantsBottomContext = variantsBottom.getContext("2d");
                variantsBottomContext.clearRect(0, 0, variantsBottom.width, variantsBottom.height);

                for(let i = 0;i<this.variants.length;i++){
                    let variant = this.variants[i];
                    let id = variant.id, site = variant.site, base = variant.base;
                    if(site < this.midAreaStar && site > this.start){
                        variantsTopContext.fillText(base+(site), 0, (site-this.start)*_this.denseAreaZoom+10);
                    }
                    if(site >= this.midAreaStar && site < this.midAreaEnd){
                        let paintedBase = 0, paintedHeight = 0;
                        let siteInZoomCanvas = site - this.midAreaStar;
                        for(let i = 0; i < this.zoomAreaConfig.length; i++){
                            let height = this.zoomAreaConfig[i].height;
                            let zoom = this.zoomAreaConfig[i].zoom;
                            console.log(siteInZoomCanvas,paintedBase,paintedBase + height/zoom/this.denseAreaZoom)

                            if(siteInZoomCanvas >= paintedBase && siteInZoomCanvas <= paintedBase + height/zoom/this.denseAreaZoom){
                                
                                variantsMidContext.fillText(base+(site), 0, (siteInZoomCanvas-paintedBase)*_this.denseAreaZoom*zoom+paintedHeight+10);
                                break;
                            }
                            paintedBase += height/zoom/this.denseAreaZoom;
                            paintedHeight += height;

                        }

                        variantsTopContext.fillText(base+(site), 0, (site-this.start)*_this.denseAreaZoom+10);
                    }
                    if(site < this.end && site >= this.midAreaEnd){
                        console.log('bottom');
                        console.log(site)
                        console.log((site-this.midAreaEnd)*_this.denseAreaZoom+10)
                        variantsBottomContext.fillText(base+(site), 0, (site-this.midAreaEnd)*_this.denseAreaZoom+10);
                    }
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
                    sequnceMidLenght += this.zoomAreaConfig[i].height/this.zoomAreaConfig[i].zoom/this.denseAreaZoom;
                }

                let sequnceTopData = this.sequnce.slice(0, baseTop.height/this.denseAreaZoom);
                let sequnceMidData = this.sequnce.slice(baseTop.height/this.denseAreaZoom, baseTop.height/this.denseAreaZoom+sequnceMidLenght);
                let sequnceBottomData = this.sequnce.slice(baseTop.height/this.denseAreaZoom+sequnceMidLenght, baseTop.height/this.denseAreaZoom+sequnceMidLenght+baseBottom.height/this.denseAreaZoom);


                for (let i = 0;i<sequnceTopData.length;i++){
                    if(i%10) continue;
                    let base = sequnceTopData[i];
                    baseTopContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    baseTopContext.fillText(base+(i+_this.start), 0, i*_this.denseAreaZoom+10);
                }
                
                baseMidContext.clearRect(0, 0, baseMid.width, baseMid.height);

                let paintedBase = baseTop.height/this.denseAreaZoom;
                let paintedHeight = 0;
                let baseMidIndex = 0;

                for(let i = 0; i < this.zoomAreaConfig.length; i++){
                    let height = this.zoomAreaConfig[i].height;
                    let zoom = this.zoomAreaConfig[i].zoom;

                    for (let i = 0; i < height/zoom/this.denseAreaZoom; i++){
                        let base = sequnceMidData[baseMidIndex++];
                        if((i+_this.start+paintedBase)%~~(20/zoom) ){continue}
                        baseMidContext.fillStyle = _this.sequnceColor[base] || '#fff';
                        baseMidContext.fillText(base+(i+_this.start+paintedBase), 0, i*_this.denseAreaZoom*zoom+10+paintedHeight);
                    }
                    paintedBase += ~~(height/zoom)/this.denseAreaZoom;
                    paintedHeight += height;
                }
                
                baseBottomContext.clearRect(0, 0, baseBottom.width, baseBottom.height);

                for (let i = 0;i<sequnceBottomData.length;i++){
                    if((i+_this.start+paintedBase)%10) continue;
                    let base = sequnceBottomData[i];
                    baseBottomContext.fillStyle = _this.sequnceColor[base] || '#fff';
                    baseBottomContext.fillText(base+(i+_this.start+paintedBase), 0, i*_this.denseAreaZoom+10);
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
                        this.end += this.start ;
                    }else{
                        this.start -= num
                        this.end -= num
                    }
                }
                if(type == 'down'){
                    if (this.end+num > track.sequnce.length) {
                        this.end = track.sequnce.length;
                        this.start -= this.end ;
                    }else{
                        this.start += num
                        this.end += num
                    }
                }
                this.sequnce = track.sequnce.slice(this.start,this.end);
                this.drawAll();
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
        },
        computed: {
            // 上缩小区长度
            topBaseLen: function () {
                return ~~(this.denseAreaHeight/this.denseAreaZoom);
            },
            // 放大区长度
            midBaseLen: function () {
                let sequnceMidLenght = 0;
                for(let i = 0; i < this.zoomAreaConfig.length;i++){
                    sequnceMidLenght += this.zoomAreaConfig[i].height/this.zoomAreaConfig[i].zoom/this.denseAreaZoom;
                }
                return sequnceMidLenght;
            },
            // 下缩小区长度
            bottomBaseLen: function () {
                return ~~(this.denseAreaHeight/this.denseAreaZoom);
            },
            // 放大区与上缩小区交界点
            midAreaStar: function () {
                return this.start+this.topBaseLen;
            },
            // 放大区与下缩小区交界点
            midAreaEnd: function () {
                return this.start+this.topBaseLen+this.midBaseLen;
            },
            end: {
                get: function () {
                    return this.start+this.topBaseLen+this.midBaseLen+this.bottomBaseLen;
                },
                set: function (){}
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
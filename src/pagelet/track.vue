<template>

    <div class="track-wrap">
        <div class="tool-bar">
            <div class="param-form">
                <el-form :inline="true" :model="param" class="demo-form-inline">
                    <el-form-item label="起始位点">
                        <el-input v-model.number="param.start" placeholder="起始位点"></el-input>
                    </el-form-item>
                    <el-form-item label="终止位点">
                        <el-input v-model.number="param.end" placeholder="终止位点"></el-input>
                    </el-form-item>
                    <el-form-item label="染色体">
                        <el-select v-model="param.chr" placeholder="染色体">
                            <el-option label="chr1" value="chr1"></el-option>
                            <el-option label="chr2" value="chr2"></el-option>
                            <el-option label="chr3" value="chr3"></el-option>
                            <el-option label="chr4" value="chr4"></el-option>
                            <el-option label="chr5" value="chr5"></el-option>
                            <el-option label="chr6" value="chr6"></el-option>
                            <el-option label="chr7" value="chr7"></el-option>
                            <el-option label="chr8" value="chr8"></el-option>
                            <el-option label="chr9" value="chr9"></el-option>
                            <el-option label="chr10" value="chr10"></el-option>
                            <el-option label="chr11" value="chr11"></el-option>
                            <el-option label="chr12" value="chr12"></el-option>
                            <el-option label="chr13" value="chr13"></el-option>
                            <el-option label="chr14" value="chr14"></el-option>
                            <el-option label="chr15" value="chr15"></el-option>
                            <el-option label="chr16" value="chr16"></el-option>
                            <el-option label="chr17" value="chr17"></el-option>
                            <el-option label="chr18" value="chr18"></el-option>
                            <el-option label="chr19" value="chr19"></el-option>
                            <el-option label="chr20" value="chr20"></el-option>
                            <el-option label="chr21" value="chr21"></el-option>
                            <el-option label="chr22" value="chr22"></el-option>
                            <el-option label="chrX" value="chrX"></el-option>
                            <el-option label="chrY" value="chrY"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onParamSubmit">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="move('up',step)">向上</el-button>
                        <el-button type="primary" @click="move('down',step)">向下</el-button>
                    </el-form-item>
                </el-form>
            </div>
            
        </div>
        
        <div class="canvas-wrap">
            <div class="canvas-label">
                <div class="canvas-label-site">位点</div>
                <div class="canvas-label-sequnce">序列</div>
                <div class="canvas-label-variant">变异</div>
            </div>
            <div class="canvas-outer">
                <div class="canvas-top" :style="{ height: denseAreaHeight + 'px' }">
                    <canvas id="base-top" width="100" :height="denseAreaHeight" ></canvas>
                    <canvas id="sequnce-top" width="200" :height="denseAreaHeight" ></canvas>
                    <canvas id="variants-top" width="150" :height="denseAreaHeight" ></canvas>
                </div>
                <div class="canvas-mid" :style="{ height: zoomAreaHeight + 'px' }">
                    <canvas id="base-mid" width="100" :height="zoomAreaHeight" ></canvas>
                    <canvas id="sequnce-mid" width="200" :height="zoomAreaHeight" ></canvas>
                    <canvas id="variants-mid" width="150" :height="zoomAreaHeight" ></canvas>
                </div>
                <div class="canvas-bottom" :style="{ height: denseAreaHeight + 'px' }">
                    <canvas id="base-bottom" width="100" :height="denseAreaHeight" ></canvas>
                    <canvas id="sequnce-bottom" width="200" :height="denseAreaHeight" ></canvas>
                    <canvas id="variants-bottom" width="150" :height="denseAreaHeight" ></canvas>
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
                    C:"#7AC583",
                    a:"#FF0066",
                    t:"#857AB9",
                    g:"#F9C238",
                    c:"#7AC583",
                    N:"#333",
                    n:"#333",
                },
                zoomAreaHeight:600,
                denseAreaHeight:100,
                step:400,
                zoomAreaConfig:[
                    {height:120,zoom:12},
                    {height:120,zoom:8},
                    {height:120,zoom:30},
                    {height:120,zoom:8},
                    {height:120,zoom:12}
                ],
                param:{
                    start: Number(localStorage.start) || 1,
                    end: Number(localStorage.end) || 1000,
                    chr: localStorage.chr || ''
                },
                originData:{
                    sequnce:'',
                    start:0,
                    end:0
                }
            }
        },
        async mounted(){
            console.time('渲染');

            let _this = this;
            let settings = await axios.get('/api/setting/get')
            if(settings.data){
                this.zoomAreaHeight = settings.data.zoomAreaHeight || 600;
                this.denseAreaHeight = settings.data.denseAreaHeight || 100;
                this.denseAreaZoom = settings.data.denseAreaZoom || 1;
                this.step = settings.data.step || 400;
                this.zoomAreaConfig = settings.data.zoomAreaConfig || [
                    {height:120,zoom:12},
                    {height:120,zoom:8},
                    {height:120,zoom:30},
                    {height:120,zoom:8},
                    {height:120,zoom:12}
                ];
            }else{
                console.error('获取配置信息出错');
            }

            let track = await axios.get('/api/track/get',{
                params: {
                    chr: this.param.chr,
                    start: this.param.start,
                    end: this.param.end
                }
            })
            this.originData.sequnce = track.data.sequnce;
            this.originData.start = Number(this.param.start);
            this.originData.end = Number(this.param.end);

            this.sequnce = this.originData.sequnce.slice(0, this.renderLen*2);
            this.start = Number(this.param.start);

            if(settings.data){
                this.zoomAreaHeight = settings.data.zoomAreaHeight || 600;
                this.denseAreaHeight = settings.data.denseAreaHeight || 100;
                this.denseAreaZoom = settings.data.denseAreaZoom || 1;
                this.zoomAreaConfig = settings.data.zoomAreaConfig || [
                    {height:120,zoom:12},
                    {height:120,zoom:8},
                    {height:120,zoom:30},
                    {height:120,zoom:8},
                    {height:120,zoom:12}
                ];
            }else{
                console.log('获取配置信息出错');
            }
            

            this.drawAll();
            let end = new Date().getTime(); // 结束时间
            console.timeEnd('渲染');
        }, 
        methods: {
            async onParamSubmit(){

                localStorage.chr = this.param.chr;
                localStorage.start = this.param.start;
                localStorage.end = this.param.end;

                await this.getSequnce(this.param.chr, this.param.start, this.param.end);
                this.start = Number(this.param.start);
                this.drawAll();

            },
            async getSequnce(chr, start, end){
                let track = await axios.get('/api/track/get',{
                    params: {
                        chr: chr,
                        start: start,
                        end: end
                    }
                })

                if(track.data.sequnce)
                this.originData.sequnce = track.data.sequnce;
                this.originData.start = Number(start);
                this.originData.end = Number(end);

                this.sequnce = this.originData.sequnce.slice(0, this.renderLen*2);
                
            },
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
                        if(base){
                            variantsTopContext.fillText(`${id}-${site}-${base.toUpperCase()}`, 0, (site-this.start)*_this.denseAreaZoom+10);
                        }
                    }
                    if(site >= this.midAreaStar && site < this.midAreaEnd){
                        let paintedBase = 0, paintedHeight = 0;
                        let siteInZoomCanvas = site - this.midAreaStar;
                        for(let i = 0; i < this.zoomAreaConfig.length; i++){
                            let height = this.zoomAreaConfig[i].height;
                            let zoom = this.zoomAreaConfig[i].zoom;
                            //console.log(siteInZoomCanvas,paintedBase,paintedBase + height/zoom/this.denseAreaZoom)

                            if(siteInZoomCanvas >= paintedBase && siteInZoomCanvas <= paintedBase + height/zoom/this.denseAreaZoom){
                                if(base){
                                    variantsMidContext.fillText(`${id}-${site}-${base.toUpperCase()}`, 0, (siteInZoomCanvas-paintedBase)*_this.denseAreaZoom*zoom+paintedHeight+10);
                                    break;
                                }
                            }
                            paintedBase += height/zoom/this.denseAreaZoom;
                            paintedHeight += height;

                        }

                        variantsTopContext.fillText(base+(site), 0, (site-this.start)*_this.denseAreaZoom+10);
                    }
                    if(site < this.end && site >= this.midAreaEnd){
                        //console.log((site-this.midAreaEnd)*_this.denseAreaZoom+10)
                        if(base){
                            variantsBottomContext.fillText(`${id}-${site}-${base.toUpperCase()}`, 0, (site-this.midAreaEnd)*_this.denseAreaZoom+10);
                        }
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
                    let base = sequnceTopData[i]
                    if(base){
                        base = base.toUpperCase();
                        baseTopContext.fillStyle = _this.sequnceColor[base] || '#fff';
                        baseTopContext.fillText(base+(i+_this.start), 0, i*_this.denseAreaZoom+10);
                    }
                }
                 
                baseMidContext.clearRect(0, 0, baseMid.width, baseMid.height);

                let paintedBase = baseTop.height/this.denseAreaZoom;
                let paintedHeight = 0;
                let baseMidIndex = 0;

                for(let i = 0; i < this.zoomAreaConfig.length; i++){
                    let height = this.zoomAreaConfig[i].height;
                    let zoom = this.zoomAreaConfig[i].zoom;

                    for (let i = 0; i < height/zoom/this.denseAreaZoom; i++){
                        let base = sequnceMidData[baseMidIndex++]
                        if(base){
                            base = base.toUpperCase();
                            if((i+_this.start+paintedBase)%~~(20/zoom) ){continue}
                            baseMidContext.fillStyle = _this.sequnceColor[base] || '#fff';
                            baseMidContext.fillText(base+(i+_this.start+paintedBase), 0, i*_this.denseAreaZoom*zoom+10+paintedHeight);
                        }
                    }
                    paintedBase += ~~(height/zoom)/this.denseAreaZoom;
                    paintedHeight += height;
                }
                
                baseBottomContext.clearRect(0, 0, baseBottom.width, baseBottom.height);

                for (let i = 0;i<sequnceBottomData.length;i++){
                    if((i+_this.start+paintedBase)%10) continue;
                    let base = sequnceBottomData[i]
                    if(base){
                        base = base.toUpperCase();
                        baseBottomContext.fillStyle = _this.sequnceColor[base] || '#fff';
                        baseBottomContext.fillText(base+(i+_this.start+paintedBase), 0, i*_this.denseAreaZoom+10);
                    }
                }
            },
            zoom(type, num){
                //console.log(type,num)
                if(type == 'in'){
                    this.scaleTimes *= num; 
                }
                if(type == 'out'){
                    this.scaleTimes /= num; 
                }
                this.translatePercent = -(1-this.scaleTimes)/this.scaleTimes*50;
                this.drawBase();
            },
            async move(type, num){
                if(type == 'up'){
                    if(this.start - num < 1){
                        this.param.start = 1;
                        this.start = 1;
                    }
                    if(this.start - num - this.renderLen*2 < this.originData.start){
                        this.param.start = Math.max(Number(this.param.start) - this.renderLen*10, 1);
                        await this.getSequnce(this.param.chr, this.param.start, this.param.end);
                        this.start = Math.max(this.start-num, 1);

                    }else{
                        this.start -= num;
                    }
                }
                if(type == 'down'){
                    //预加载
                    if (this.end + num + this.renderLen*2 > this.originData.end) {
                        this.param.end = Number(this.param.end) + this.renderLen*10;
                        this.getSequnce(this.param.chr, this.param.start, this.param.end);
                        this.start += num;
                    }else{
                        this.start += num
                    }
                }

                this.sequnce = this.originData.sequnce.slice(this.start - this.originData.start , this.end - this.originData.start );

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
            },
            renderLen: function(){
                return this.end - this.start;
            }
        }
    }


</script>

<style lang="less" scoped>
    .track-wrap{
        width:1100px;
        max-width:100%;
        margin:auto;
        

        .tool-bar{
            display: flex;
            justify-content: space-around;
            padding: 20px;

            .param-form{

            }
        }


        .canvas-wrap{
            width:100%;
            box-sizing: border-box;
            

            .canvas-label{
                display: flex;

                & > *{
                    width: 200px;
                    text-align: center;
                    font-weight: 700;
                    color: #666;
                }

                &-site{
                    width: 100px;
                    text-align: left;
                }
                &-sequnce{
                    width: 200px;
                }
                &-variant{
                    width: 150px;
                    text-align: left;
                }
            }   

            .canvas-outer{
                width:100%;
                border:1px solid #000;

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
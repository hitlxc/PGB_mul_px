<template>

    <div class="track-wrap">

        <div class="canvas-wrap">
            <canvas id="sequnce" width="200" height="3000"></canvas>
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
                }
            }
        },
        mounted(){
            this.drawSequnce();
        },
        methods: {
            drawSequnce(){
                let _this = this;
                let canvas = document.getElementById("sequnce");
                let context = canvas.getContext("2d");
                for (let i = 0;i<_this.sequnce.length;i++){
                    let base = _this.sequnce[i];
                    if(base == 'A') {
                        context.fillStyle = _this.sequnceColor.A;
                        context.fillText('A', 0, (i+1)*_this.width);
                    }
                    if(base == 'T') {
                        context.fillStyle = _this.sequnceColor.T;
                        context.fillText('T', 0, (i+1)*_this.width);
                    }
                    if(base == 'G') {
                        context.fillStyle = _this.sequnceColor.G;
                        context.fillText('G', 0, (i+1)*_this.width);
                    }
                    if(base == 'C') {
                        context.fillStyle = _this.sequnceColor.C;
                        context.fillText('C', 0, (i+1)*_this.width);
                    }
                    context.fillRect(50, i*_this.width, 100, _this.width);
                }

            },
        }
    }


</script>

<style lang="less" scoped>
    .track-wrap{
        width:1000px;
        max-width:100%;
        border:1px solid #000;
        margin:auto;
        height:1000px;
        overflow: hidden;

        .canvas-wrap{
            width:100%;
            height: 300%;
            /*margin-top:-100%;*/

            #sequnce{
                width:20%;
                height: 100%;
            }
        }
    }
</style>
<template>
  <div :class="className" :style="{height:height,width:width}" style="opacity: 0.8;" />
</template>

<script>


  import resize from './mixins/resize'
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  export default {
    name: 'RelationChart',
    mixins: [resize],
    props:{
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '500px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    computed: {},
    created() {
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'dark')
        this.chart.showLoading()
        this.setOptions(this.chartData)
        this.chart.hideLoading()
      },
      setOptions({ income, resource, strategy } = {}) {
        var datas = [];
        const allCount = this.chartData.neighbor.CNum + this.chartData.neighbor.DNum
        const cNum = this.chartData.neighbor.CNum
        const dNum = this.chartData.neighbor.DNum
        for (var i = 0; i < 1; i++) {
          datas.push({
            nodes: this.createNodes(allCount, cNum, dNum),
            edges: this.createEdges(allCount)
          });
        }

        var reVec = [];
        for(var n = 0; n < allCount+1; n++) {
          reVec[n] = 0;
        }
        reVec[0]=3;

        this.chart.setOption({
          grid: {
            left: 10,
            right: 10,
            bottom: 30,
            top: 40,
            containLabel: true
          },
          series: datas.map(function (item, idx) {
            return {
              type: 'graph',
              layout: 'force',
              animation: false,
              data: item.nodes,
              left: '0',
              top: '0',
              width: '100%',
              height: '100%',
              force: {
                // initLayout: 'circular'
                gravity: 0.1,
                repulsion: reVec,
                edgeLength: 0.1,
                layoutAnimation: false
              },
              edges: item.edges.map(function (e) {
                return {
                  source: e[0],
                  target: e[1]
                };
              })
            };
          })
        })
      },
      createNodes(allCount, cNum, dNum) {
        var nodes = [];
        nodes.push({
          id: 0,
          itemStyle:{
            color: '#0000ff'
          },
          value: 10
        })
        for (var i = 1; i < cNum+1; i++) {
          nodes.push({
            id: i,
            itemStyle: {
              color: '#00ff00'               // 关系图节点标记的颜色
            },
            value:0
          });
        }
        for (var i = cNum+1; i < cNum+dNum+1; i++) {
          nodes.push({
            id: i,
            itemStyle:{
              color: '#ff0000'
            },
            value:0
          });
        }
        return nodes;
      },
      createEdges(count) {
        var edges = [];
        if (count === 2) {
          return [[0, 1]];
        }
        for (var i = 0; i < count+1; i++) {
          edges.push([0, (i + 1) % (count+1)]);
        }
        return edges;
      }
    }
  }
</script>

<style scoped>

</style>

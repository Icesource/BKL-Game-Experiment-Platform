<template>
  <div :class="className" :style="{height:height,width:width}" style="opacity: 0.8;" />
</template>

<script>
  function createNodes(count) {
    var nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        id: i
      });
    }
    return nodes;
  }

  function createEdges(count) {
    var edges = [];
    if (count === 2) {
      return [[0, 1]];
    }
    for (var i = 0; i < count; i++) {
      edges.push([0, (i + 1) % count]);
    }
    return edges;
  }

  var datas = [];
  for (var i = 0; i < 1; i++) {
    datas.push({
      nodes: createNodes(10),
      edges: createEdges(10)
    });
  }

  import resize from './mixins/resize'
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  export default {
    name: 'PieChart',
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
        default: '200px'
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
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
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
        this.setOptions(this.chartData)
      },
      setOptions({ income, resource, strategy } = {}) {
        this.chart.setOption({
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },

          // visualMap: {
          //   show: false,
          //   min: 80,
          //   max: 600,
          //   inRange: {
          //     colorLightness: [0, 1]
          //   }
          // },
          series : [
            {
              symbolSize: 1,
              name:'',
              type:'pie',
              radius : '55%',
              center: ['50%', '50%'],
              itemStyle: {
                normal: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data:[
                {
                  value:this.chartData.neighbor.CNum,
                  name:this.$t('gameview.cooperatorRatio'),
                  itemStyle:{
                    color:'#8FBC8F'
                  }
                },
                {
                  value:this.chartData.neighbor.DNum,
                  name:this.$t('gameview.traitorRatio'),
                  itemStyle:{
                    color:'#A52A2A'
                  }
                }

              ].sort(function (a, b) { return a.value - b.value; }),
              roseType: 'radius',
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              },

              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
        })
      }
    }
  }
</script>

<style scoped>

</style>

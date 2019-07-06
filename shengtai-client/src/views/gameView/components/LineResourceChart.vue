<template>
  <div ref="lrChart1" :class="className" :style="{height:height,width:width}" style="opacity: 0.8;"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
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
      default: '0px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    resourceData: {
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
    resourceData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    },
    height: {
      deep: true,
      handler(val) {
        console.log('height改变')
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
  methods: {
    initChart() {
      // console.log(this.resourceData,"resource chart")
      this.chart = echarts.init(this.$el, 'dark')
      // console.log(this.height)
      this.chart.resize()
      this.setOptions(this.resourceData)
    },
    setOptions({ resource, strategy } = {}) {
      this.chart.setOption({
        xAxis: {
          data: strategy.map(()=>{return ''}),
          boundaryGap: false,
          axisTick: {
            show: false
          },
          splitLine:{
            show:false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'cross'
        //   },
        //   padding: [5, 10]
        // },
        yAxis: {
          axisTick: {
            show: false
          },
          splitLine:{
            show:false
          }
        },
        legend: {
          data: ['resource'],
          height: '250px'
        },
        series: [
        {
          name: 'resource',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 3
              }
            }
          },
          data: resource,
          animationDuration: 2000,
          animationEasing: 'quadraticOut',
          symbolSize: 10
        }
        ]
      })
    }
  }
}
</script>

<template>
  <div :class="className" :style="{height:height,width:width}" style="opacity: 0.8;"/>
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
      default: '250px'
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
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'dark')
      this.setOptions(this.chartData)
    },
    setOptions({ income, strategy } = {}) {
      this.chart.setOption({
        xAxis: {
          data: strategy.map(()=>{return ''}),
          boundaryGap: false,
          axisTick: {
            show: false
          },
          name: 'timeSteps',
          nameLocation: 'middle',
          nameGap: 15,
          nameTextStyle:{
            color: '#87CEFA'
          },
          splitLine:{
            show:false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 30,
          top: 40,
          containLabel: true
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'cross'
        //   },
        //   padding: [10, 20]
        // },
        yAxis: {
          axisTick: {
            show: false
          },
          name: 'payoff',
          nameLocation: 'end',
          nameGap:15,
          nameTextStyle:{
            color: '#87CEFA'
          },
          splitLine:{
            show:false
          }
        },
        legend: {
          data: ['payoff'],
          // padding: 100
        },
        series: [{
          name: 'payoff', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 3
              }
            }
          },
          smooth: true,
          type: 'line',
          data: income,
          animationDuration: 2000,
          animationEasing: 'cubicInOut',
          opacity: 0.8,
          symbolSize: 10,
        }
       ]
      })
    },
    num2e(num) {
      if (num == 0) {
        return 0
      }
      var p = Math.floor(Math.log(num) / Math.LN10)
      var n = num * Math.pow(10, -p)
      n = n.toString().substring(0, 6)
      return n + '*10^' + p
    }
  }
}
</script>

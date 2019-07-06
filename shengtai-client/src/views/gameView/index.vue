<template>
  <div class="app-container">
    <div v-if="device==='desktop'" class="game-area">
      <div style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;">
        <img alt="" src="../../assets/game-background.jpg" style="width: 100%;height: 100%;opacity: 0.6;">
        </div>

      <div class="left-top">
        <!--        <div class="all-resource">{{$t('gameview.allResource')}}: <span style="font-weight: bold;font-size: 22px">{{data.Resource}}</span></div>-->
        <!--        <div class="neibor-choose">{{$t('gameview.neiborChoose')}} <span class="betray-text" v-if="data.neiborChoose==='0'">{{$t('app.betray')}}</span>-->
        <!--          <span  class="betray-text" v-else>{{$t('app.cooperation')}}</span>,{{$t('gameview.neiborBenefit')}} <span-->
        <!--          style="font-weight: bold;font-size: 22px">{{data.neiborBenefit}}</span></div>-->
        <div class="student-id">{{$t('app.email')}}:{{email}}</div>
      </div>
      <router-link to="/tutorial" class="medium-top">
        {{$t('gameview.backToTutorial')}}
      </router-link>
      <div style="opacity: 0.7" class="right-top">
        <div class="benefit-text">{{$t('gameview.allBenefit')}}：<span
          v-if="data.income!==0">{{num2e(data.income)}}</span><span v-else>{{data.income}}</span></div>
        <!--        <div class="benefit-text">-->
        <!--          {{$t('gameview.resource')}}: {{chartData.resource}}-->
        <!--        </div>-->

      </div>

      <div class="info-area">
        <div style="text-align: center" v-if="this.type3Resource">
          {{$t('gameview.resource')}} : {{this.type3Resource}}
        </div>
        <div style="width: 100%">
<!--          <PieChart v-if="gameType!=1" :chart-data="chartData"></PieChart>-->
          <RelationChart v-if="gameType!=1" :chart-data="chartData"></RelationChart>

          <div style="display: flex;justify-content: space-between;background: #000;opacity: 0.6;width: 101%;padding: 0 5px"><span
            style="color:#fff;font-size: 14px" v-for="strategy in chartData.strategy ">{{strategy}}</span></div>
          <LineChart v-if="gameType!=4" :chart-data="chartData"></LineChart>
          <LineResourceChart v-if="gameType!=4" :resource-data="resourceData"></LineResourceChart>
          <LineChart v-if="gameType==4" :chart-data="chartData" :height="'150px'"></LineChart>
          <LineResourceChart v-if="gameType==4" :resource-data="resourceData" :height="'150px'"></LineResourceChart>
        </div>

        <el-row style="margin-top: 10px">
          <el-col :span="12">
            <div style="text-align: center;vertical-align: center">
              {{$t('gameview.nextStrategy')}}：
            </div>
          </el-col>
          <el-col :span="6">
            <el-button :disabled="buttonStatus" @click="cooperation" size="medium" class="cooperation-button"
            >{{$t('app.cooperation')}}
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button :disabled="buttonStatus" @click="betray" size="medium" class="betray-button">
              {{$t('app.betray')}}
            </el-button>
          </el-col>
        </el-row>
      </div>

    </div>
    <div v-else class="game-area">
      <div style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;z-index: -1">
        <img alt="" src="../../assets/game-background.jpg" style="width: 100%;height: 100%;opacity: 0.6;">
      </div>
      <router-link style="left: 25%" to="/tutorial" class="medium-top">
        {{$t('gameview.backToTutorial')}}
      </router-link>
      <div style="text-align: center;padding-top: 60px" v-if="this.type3Resource">
        {{$t('gameview.resource')}} : {{this.type3Resource}}
      </div>
     <div style="margin-top: 10px">
       <RelationChart v-if="gameType!=1" :chart-data="chartData"></RelationChart>

       <div style="padding-left: 40px;display: flex;justify-content: space-between;background: #000;opacity: 0.6;width: 101%;padding: 0 5px"><span
         style="color:#fff;font-size: 14px" v-for="strategy in chartData.strategy.map((item)=>{return item.slice(0,1).toUpperCase()}) ">{{strategy}}</span></div>
       <LineChart v-if="gameType!=4" :chart-data="chartData"></LineChart>
       <LineResourceChart v-if="gameType!=4" :resource-data="resourceData"></LineResourceChart>
       <LineChart v-if="gameType==4" :chart-data="chartData" :height="'150px'"></LineChart>
       <LineResourceChart v-if="gameType==4" :resource-data="resourceData" :height="'150px'"></LineResourceChart>
     </div>
      <div style="text-align: center">
        <el-button :disabled="buttonStatus" @click="cooperation" size="medium" class="cooperation-button-mobile"
                   type="primary">{{$t('app.cooperation')}}
        </el-button>
        <el-button :disabled="buttonStatus" @click="betray" size="medium" class="betray-button-mobile" type="danger">
          {{$t('app.betray')}}
        </el-button>
      </div>



    </div>
  </div>
</template>

<script>
  import { playGameInfo, playChoice, gameHistory } from '@/api/games'
  import LineChart from './components/LineChart'
  import LineResourceChart from './components/LineResourceChart'
  import PieChart from './components/PieChart'
  import { Message, MessageBox } from 'element-ui'
  import { mapGetters } from 'vuex'
  import { getLanguage } from '@/lang/index'
  import RelationChart from './components/RelationChart'

  export default {
    name: 'index',
    data() {
      return {
        gameId: null,
        gameType: null,
        data: null,
        buttonStatus: false,
        betrayBenefit: null,
        cooperationBenefit: null,
        recursiveFunction: null,
        chartData: null,
        resourceData: {},
        type3Resource: null
      }
    },
    components: {
      RelationChart,
      LineChart,
      PieChart,
      LineResourceChart
    },
    computed: {
      device() {
        return this.$store.state.app.device
      },
      ...mapGetters([
        'email'
      ])
    },
    created() {
      this.gameId = this.$route.params.id
      this.gameType = this.$route.params.type
      // this.lineChartReflesh = true
      // this.lineResourceChartReflesh = true
      // this.recursiveGetData()
      console.log(this.gameType)
      this.recursiveGetGameHistory()
      this.getData()
    },
    beforeDestroy() {
      window.clearInterval(this.recursiveFunction)
      window.clearInterval(this.recursiveFunction2)
    },
    filters: {
      chooseFilter(status) {
        const chooseStatusMap = {
          '0': 'app.betray',
          '1': 'app.cooperation'
        }
        return chooseStatusMap[status]
      }
    },
    methods: {
      getData() {
        playGameInfo({ 'gameId': this.gameId }).then(response => {
          if (response.code === 20000) {
            this.data = response.data
            this.cooperationBenefit = this.data.cooperationBenefit
            this.betrayBenefit = this.data.betrayBenefit
          }
        })
      },
      recursiveGetData() {
        playGameInfo({ 'gameId': this.gameId }).then(response => {
          if (response.code === 20000) {
            this.data = response.data
            this.cooperationBenefit = this.data.cooperationBenefit
            this.betrayBenefit = this.data.betrayBenefit
            this.recursiveFunction = setTimeout(() => {
              this.recursiveGetData()
            }, 15000)
          }
        })
      },
      cooperation() {
        this.buttonStatus = true
        setTimeout(() => {
          this.buttonStatus = false
        }, 5 * 1000)
        playChoice({ 'choice': 1, 'gameId': this.gameId }).then((response) => {
          if (response.code === 20000) {
            Message({
              message: this.$t('message.' + response.message) + ', actual benefit is ' + response.data.benefit,
              type: 'success',
              duration: 3000
            })
            this.getData()
            this.getGameHistory()
          }
        })
      },
      betray() {
        this.buttonStatus = true
        setTimeout(() => {
          this.buttonStatus = false
        }, 5 * 1000)
        playChoice({ 'choice': 0, 'gameId': this.gameId }).then((response) => {
          if (response.code === 20000) {
            Message({
              message: this.$t('message.' + response.message) + ', actual benefit is ' + response.data.benefit,
              type: 'success',
              duration: 3000
            })
            this.getData()
            this.getGameHistory()
          }
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
      },
      getGameHistory() {
        gameHistory({ 'gameId': this.gameId, 'gameType': this.gameType }).then(response => {
          this.chartData = response.data.history
          const language = getLanguage()
          this.chartData.strategy = this.chartData.strategy.map((item) => {
            if (item === 0) {
              if (language === 'en') {
                return 'betray'
              } else {
                return '背叛'
              }
            } else {
              if (language === 'en') {
                return 'cooperation'
              } else {
                return '合作'
              }
            }
          })
          this.chartData.neighbor = response.data.neighbor
          this.resourceData = response.data.history
          this.resourceData.strategy = this.chartData.strategy
          // this.chartData.resource = response.data.resource
          // console.log(this.chartData)
          this.type3Resource = response.data.resource
        })
      },
      recursiveGetGameHistory() {
        gameHistory({ 'gameId': this.gameId, 'gameType': this.gameType }).then(response => {
          this.chartData = response.data.history
          const language = getLanguage()
          this.chartData.strategy = this.chartData.strategy.map((item) => {
            if (item === 0) {
              if (language === 'en') {
                return 'defection'
              } else {
                return '背叛'
              }
            } else {
              if (language === 'en') {
                return 'cooperation'
              } else {
                return '合作'
              }
            }
          })
          this.chartData.neighbor = response.data.neighbor
          this.resourceData = response.data.history
          this.resourceData.strategy = this.chartData.strategy
          // this.chartData.resource = response.data.resource
          // console.log(this.chartData)
          this.type3Resource = response.data.resource

          this.recursiveFunction2 = setTimeout(() => {
            this.recursiveGetGameHistory()
          }, 15000)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .app-container {
  }

  .game-area {
    /*height: 90vh;*/
    /*position: absolute;*/



    .cooperation-button {
      /*width: 10%;*/
      font-size: 20px;
      width: 22vh;
    }

    .betray-button {
      /*width: 10%;*/
      font-size: 20px;
      width: 22vh;
    }

    .cooperation-button-mobile {
      /*position: absolute;*/
      margin-top: 15px;
      left: 25%;
      top: 80%;
      /*width: 10%;*/
      font-size: 20px;
      width: 30vh;
    }

    .betray-button-mobile {
      /*position: absolute;*/
      margin-top: 15px;
      left: 25%;
      top: 90%;
      /*width: 10%;*/
      margin-left: 0;
      font-size: 20px;
      width: 30vh;
    }

    .positive-income {
      /*color: #ffffff;*/
      font-weight: bold;
    }

    .negative-income {
      /*color: #FF0000;*/
      font-weight: bold;
    }

    .right-top {
      position: absolute;
      right: 3%;
      top: 4%;
      /*height: 17%;*/
      background: #660066;
      border: 1px solid #000000;
      border-radius: 5px;
      /*opacity: 0.9;*/
      font-size: 18px;
      color: #ffffff;
      box-shadow: 10px 10px 5px #888888;

      .benefit-text {
        font-size: 24px;
        /*color: #FF0000;*/
        margin: 20px 20px;
        font-weight: bold;
      }
    }

    .medium-top {
      position: absolute;
      left: 40%;
      top: 0;
    }

    .left-top {
      position: absolute;
      left: 2%;
      top: 4%;
      /*height: 17%;*/
      background: #660066;
      border: 1px solid #000000;
      border-radius: 5px;
      opacity: 0.7;
      font-size: 18px;
      color: #ffffff;
      box-shadow: 10px 10px 5px #888888;;

      .student-id {
        font-size: 24px;
        /*color: #FF0000;*/
        margin: 20px 20px;
        font-weight: bold;
      }

      /*.all-resource {*/
      /*  margin: 15px 2px 8px 5px;*/
      /*}*/

      /*.neibor-choose {*/
      /*  margin: 0 2px 10px 5px;*/

      /*  .betray-text {*/
      /*    font-weight: bold;*/
      /*    font-size: 22px;*/
      /*    color: #FF0000;*/
      /*  }*/
      /*}*/

      /*opacity: 0.9;*/
    }

    .info-area {
      /*position: absolute;*/
      top: 17%;
      width: 80%;
      left: 20vh;
      margin: 100px;
      font-size: 3vh;
      /*font-weight: bold;*/
      /*color: #263445;*/

      .el-row {
        margin-bottom: 4vh;
      }

      .grid-title-left {
        float: right;
      }

      .grid-content-right {
        color: #FF0000;
        font-weight: bold;
      }
    }

    .left-top-mobile {
      position: absolute;
      margin: 0 3vh;
      top: 4%;
      width: 80%;
      /*height: 17%;*/
      background: #660066;
      border: 1px solid #000000;
      border-radius: 5px;
      opacity: 0.9;
      font-size: 18px;
      color: #ffffff;
      box-shadow: 10px 10px 5px #888888;;

      .all-resource {
        margin: 15px 2px 8px 5px;
      }

      .neibor-choose {
        margin: 0 2px 10px 5px;

        .betray-text {
          font-weight: bold;
          font-size: 22px;
          color: #FF0000;
        }
      }

      /*opacity: 0.9;*/
    }

  }
</style>

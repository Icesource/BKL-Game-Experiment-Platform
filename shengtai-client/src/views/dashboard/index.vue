<template>
  <div class="dashboard-container">
    <div class="dashboard-text" style="margin-top: 60px">{{studentId}} {{ name }}, {{$t('app.welcome')}}</div>
    <div class="all-income" >{{$t('gameview.allBenefit')}}：{{income}}</div>
    <div> {{$t('app.instruction2')}}</div>

    <div class="start-title">{{$t('app.startGameInstruction')}}</div>
    <div class="game-list">
      <span v-for="item in list" v-if="item.status===1">
        <router-link :to="'game/'+item.id+'/'+item.gameType">{{item.gameName}}</router-link>
      </span>
    </div>
<!--    <div class="dashboard-text">school: {{ school }}</div>-->
<!--    <div class="dashboard-text">email: {{ email }}</div>-->
<!--    <div class="dashboard-text">phone: {{ phone }}</div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList } from '@/api/games'
import {getInfo} from '../../api/user'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'school',
      'email',
      'phone',
      'studentId'
    ])
  },
  created() {
    this.getList()
  },
  data(){
    return{
      listQuery: {
        currentPage: 0,
        pageSize: 20,
      },
      list:null,
      total:null,
      income:null
    }
  },
  methods:{
    getList() {
      getInfo().then(response=>{
        this.income = response.data.income
      })
      fetchList(this.listQuery).then(response => {
        if (response.code === 20000) {
          this.list = response.data.content
          this.total = response.data.totalElements
        } else {
          Message({
            message: response.message,
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .all-income{
    position: absolute;
    top: 3vh;
    right: 8vh;
    font-size: 3vh;
  }
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.start-title{
  margin-top: 40px;
    font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}
  .game-list{
    display: flex;
    flex-direction: row;

    a{
      color: blue;
      margin-right: 15px;
      font-size: 20px;
    }
  }
</style>

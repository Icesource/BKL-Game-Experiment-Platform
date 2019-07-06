<template>
    <div class="app-container">
      <lang-select style="font-size: 18px;margin: 10px"/>
      <div class="tutorial-text-1">
        {{$t('tutorial.t1')}}<br>
        {{$t('tutorial.t2')}} <br>
        {{$t('tutorial.t3')}}<br>
        {{$t('tutorial.t4')}}
      </div>
      <div>
        <img src="../../assets/tutorial2.png" style="width: 100%;height: 100%;" alt="">
      </div>
      <div class="tutorial-text-1">   {{$t('tutorial.t5')}}</div>
      <el-button type="primary" @click="goQuiz">{{$t('app.quiz')}}</el-button>
    </div>
</template>

<script>

  import LangSelect from '@/components/LangSelect'

  export default {
    name: 'index',
    data() {
      return {}
    },
    computed: {},
    created() {
    },
    methods: {
      goQuiz(){
        this.$router.push({ path: '/question' })
      }
    },
    components: {LangSelect}
  }
</script>

<style scoped>
 .tutorial-text-1{
   font-size: 18px;
   line-height: 26px;
 }
</style>

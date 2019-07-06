<template>
  <div class="app-container">
    <div class="question-item">
      <div class="question">Q1 {{$t('questions.Q1')}}</div>
      <div class="question-answer">

        <el-radio-group size="medium" v-model="question1">
          <el-radio style="margin-bottom: 5px" label="A"><span style="font-size: 18px">(A) {{$t('questions.yes')}};</span></el-radio>
          <el-radio style="margin-bottom: 5px" label="B"><span style="font-size: 18px">(B) {{$t('questions.no')}};</span></el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="question-item">
      <div class="question">Q2 {{$t('questions.Q2')}}</div>
      <div class="question-answer">
        <el-radio-group size="medium" v-model="question2">
          <el-radio style="margin-bottom: 5px" label="A"><span
            style="font-size: 18px">(A) {{$t('questions.Q3A')}}</span></el-radio>
          <el-radio style="margin-bottom: 5px" label="B"><span
            style="font-size: 18px">(B) {{$t('questions.Q3B')}}</span></el-radio>
          <el-radio style="margin-bottom: 5px" label="C"><span style="font-size: 18px">(C) {{$t('questions.Q3C')}}</span>
          </el-radio>
          <el-radio style="margin-bottom: 5px" label="D"><span style="font-size: 18px">(D) {{$t('questions.Q3D')}}</span>
          </el-radio>
        </el-radio-group>
      </div>
    </div>

    <div class="question-item">
      <div class="question">Q3 {{$t('questions.Q3')}}</div>
      <div class="question-answer">
        <el-radio-group size="medium" v-model="question3">
          <el-radio style="margin-bottom: 5px" label="A"><span style="font-size: 18px">(A) {{$t('questions.yes')}};</span></el-radio>
          <el-radio style="margin-bottom: 5px" label="B"><span style="font-size: 18px">(B) {{$t('questions.no')}};</span></el-radio>
        </el-radio-group>
      </div>
    </div>


    <div class="question-buttons">
      <el-button @click="submitQuestionAnswer" style="margin: 10px" type="primary">submit</el-button>
    </div>
  </div>
</template>

<script>
  import { answerQuestions } from '../../api/games'
  import { Message } from 'element-ui'
  import { getToken, setToken, removeToken } from '@/utils/auth'

  export default {
    name: 'index',
    data() {
      return {
        question1: null,
        question2: null,
        question3: null,
      }
    },
    computed: {
      device() {
      }
    },
    created() {

    },
    methods: {
      submitQuestionAnswer() {
        const questions = {
          'answer': this.question1 + this.question2 + this.question3
          // 'question2': this.question2,
          // 'question3': this.question3,
          // 'question4': this.question4
        }
        answerQuestions(questions).then((response) => {
          Message({
            message: this.$t('message.'+response.message),
            type: 'success',
            duration: 2000
          })
          setToken(response.token)
          this.$router.push({ path: '/' })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .question-item {
    margin: 10px 2px;

    .question {
      font-size: 20px;
    }

    .question-answer {
      font-size: 16px;
      margin-bottom: 2px;
      margin-top: 10px;

      span {
        white-space: normal;
      }
    }
  }
</style>

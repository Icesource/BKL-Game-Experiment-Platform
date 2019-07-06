<template>
  <div style="height: 100%">

    <div class="login-container">

    <div style="height: 100%" class="back-pic"><img style="width: 100%;height: 100%;opacity: 0.4" src="../../assets/1.jpg" alt=""></div>
      <lang-select style="margin: 20px" class="set-language" />
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title" style="margin-bottom: 10px">{{ $t('app.loginTitle') }}</h3>
        <div class="title" style="font-size: 16px;margin-bottom: 25px">{{$t('app.loginTip')}}</div>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Email"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
      <el-button type="primary" style="width:100%;margin-bottom:30px;margin-left: 0" @click.native.prevent="handleRegister">{{$t('login.register')}}</el-button>

      <!--      <div class="tips">-->
      <!--        <span style="margin-right:20px;">username: admin</span>-->
      <!--        <span> password: any</span>-->
      <!--      </div>-->

    </el-form>

    <!--    <el-dialog :title="'注册'" :visible.sync="dialogFormVisible">-->
    <!--      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">-->

    <!--        <el-form-item :label="'date'" prop="timestamp">-->
    <!--          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item :label="'title'" prop="title">-->
    <!--          <el-input v-model="temp.title" />-->
    <!--        </el-form-item>-->
    <!-- -->
    <!--        <el-form-item :label="'importance'">-->
    <!--          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item :label="'remarke'">-->
    <!--          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogFormVisible = false">-->
    <!--          cancel-->
    <!--        </el-button>-->
    <!--        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">-->
    <!--          confirm-->
    <!--        </el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->


  </div>
    <el-dialog :title="$t('login.register')" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item :xs="8" :sm="6" :md="4" :lg="3" :xl="1" :label="$t('app.name')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :xs="8" :sm="6" :md="4" :lg="3" :xl="1" :label="$t('app.email')" prop="email">
          <el-input v-model="temp.email"></el-input>
        </el-form-item>

        <el-form-item :label="$t('app.phone')" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item :label="$t('app.password')" prop="password">
          <el-input type="password" v-model="temp.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('app.school')" prop="school">
          <el-input v-model="temp.school"></el-input>
        </el-form-item>
<!--        <el-form-item :label="$t('app.studentId')" prop="studentId">-->
<!--          <el-input v-model="temp.studentId"></el-input>-->
<!--        </el-form-item>-->

        <div class="form-item-row">
          <el-form-item :label="$t('app.gender')" prop="gender">
            <el-radio v-model="temp.gender" label="0">{{$t('app.male')}}</el-radio>
            <el-radio v-model="temp.gender" label="1">{{$t('app.female')}}</el-radio>
          </el-form-item>
          <el-form-item :label="$t('app.age')" prop="age">
            <el-input size="small" v-model="temp.age"></el-input>
          </el-form-item>
        </div>
        <el-form-item :label-width="'170px'" :label="$t('app.QQ')" prop="socialAccount">
          <el-input v-model="temp.socialAccount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button @click="register" type="primary">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { validUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import {register} from '../../api/user'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'Login',
  data() {
    const calendarTypeOptions = [
      { key: 'CN', display_name: 'China' },
      { key: 'US', display_name: 'USA' },
      { key: 'JP', display_name: 'Japan' },
      { key: 'EU', display_name: 'Eurozone' }
    ]

    return {
      calendarTypeOptions,
      statusOptions: ['published', 'draft', 'deleted'],
      dialogFormVisible: false,
      temp: {
        email:'',
        phone:'',
        age:'',
        gender:'',
        school:'',
        password:'',
        socialAccount:'',
        name:'',
        studentId:''
      },
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur'}],
        password: [{ required: true, trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      rules: {
        email: [{ required: true, message: 'email is required', trigger: 'change' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'change' }],
        age: [{ required: true, message: 'age is required', trigger: 'change' }],
        gender: [{ required: true, message: 'gender is required', trigger: 'change' }],
        school: [{ required: true, message: 'school is required', trigger: 'change' }],
        password: [{ required: true, message: 'password is required', trigger: 'change' }],
        socialAccount: [{ required: true, message: 'socialAccount is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'change' }]
      },
    }

  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    resetTemp() {
      this.temp = {
        email:'',
        phone:'',
        age:'',
        gender:'',
        school:'',
        password:'',
        socialAccount:'',
        name:'',
        studentId:''
      }
    },
    createData(){
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRegister(){
      this.resetTemp()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    register(){
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          register(this.temp).then(response=>{
            if(response.code===20000){
              Message({
                message: this.$t('message.'+response.message),
                type: 'success',
                duration: 5 * 1000
              })
              this.loginForm.username = this.temp.email
              this.loginForm.password = this.temp.password
              this.$store.dispatch('user/login', this.loginForm)
                .then(() => {
                  this.$store.dispatch('user/getInfo').then(()=>{
                    this.$router.push({ path: this.redirect || '/' })
                    this.loading = false
                  })
                })
                .catch(() => {
                  this.loading = false
                })
            }else{
              Message({
                message: this.$t('message.'+response.message),
                type:'error',
                duration: 5*1000
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  components: { LangSelect }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.form-item-row{
  display: flex;
  flex-direction: row;
}

.set-language {
  color: #fff;
  position: absolute;
  top: 3px;
  font-size: 18px;
  right: 0px;
  cursor: pointer;
}
.back-pic{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  height: 0;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }


}
</style>

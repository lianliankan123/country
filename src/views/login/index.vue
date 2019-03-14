<template>
    <div class="login-container">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left"
                 label-width="0px"  class="card-box login-form">
            <h3 class="title">智能学习规划平台</h3>
            <el-form-item prop="userName">
                <span class="svg-container"><i class="fa fa-user-circle-o" aria-hidden="true"></i></span>
                <el-input name="userName" type="text" v-model="loginForm.userName" autoComplete="off" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container"><i class="fa fa-lock" aria-hidden="true"></i></span>
                <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password"  autoComplete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="vCode">
                <el-input name="vCode" style="width:66%" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.vCode" placeholder="验证码"></el-input>
                 <el-button type="primary" :loading="loading" @click="sendVerification">
                    发送验证码
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
                    登录
                </el-button>
            </el-form-item>
            
            <router-link to="/sendpwd" class="forget-pwd">
                忘记密码?
            </router-link>
        </el-form>
       
    </div>
</template>

<script>
  import {global} from 'src/global/global';
  import {api} from 'src/global/api';
    export default {
      name: 'login',
      data() {
        const validateUsername = (rule, value, callback) => {  
          if (value.trim().length<1) {  
              callback(new Error('用户名不能为空'))  
            } else {  
              callback()  
            }  
          };  
        const validatePass = (rule, value, callback) => {  
          if (value.trim().length < 1) {  
            callback(new Error('密码不能为空'))  
          } else {  
            callback()  }
          };
        const validateVer = (rule, value, callback) => {  
            if (value.trim().length < 1) {  
              callback(new Error('验证码不能为空'))  
            } else {  
              callback()  
            };
        };  
        return {
            loginForm: {
                userName: '',
                password: '',
                vCode:''
            },
            loginRules: {  
                userName: [{required: true, trigger: 'blur', validator: validateUsername}],  
                password: [{required: true, trigger: 'blur', validator: validatePass}],
                vCode:[{required: true, trigger: 'blur', validator: validateVer}]  
            },  
            loading: false,
            showDialog: false
        }
      },
      computed: {
      },
      methods: {
        handleLogin() {
            
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                  this.loading = true;
                  this.$store.dispatch('LoginByUserName', {login:this.loginForm}).then(() => {
                  this.loading = false;          
                  console.log('登陆成功即将跳转--------')
                  this.$router.push({ path: '/' });
                   
                  }).catch(err => {
                    this.$message.error(err);
                    this.loading = false;
                  });
                } else {
                  console.log('error submit!!');
                  return false;
                }
            });
      },
      sendVerification(){
        let em = this;
        if(em.loginForm.userName!=null){
          global.post(api.getVer,{},{params:{username: em.loginForm.userName}},function(res){ 

          },function(res){
            
          },false)
        }else{
        alert("用户名不能为空！");
        }
     }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "src/assets/css/mixin.scss";
    .tips{
      font-size: 14px;
      color: #fff;
      margin-bottom: 5px;
    }
    .login-container {
        @include relative;
        height: 100vh;
        background: url('../../assets/img/bg_sky.jpg');
        background-size: cover;
        
        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
            -webkit-text-fill-color: #fff !important;
        }
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: #eeeeee;
            height: 47px;
        }
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
        }
        .svg-container {
            padding: 6px 5px 6px 15px;
            width: 40px;
            float: left;
            text-align: center;
            color: #FFFFFF;
            font-size: 20px;
        }

        .title {
            font-size: 26px;
            font-weight: 400;
            color: #eeeeee;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }

        .login-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 400px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }

        .forget-pwd {
            color: #141414;
            font-weight: bold;
        }
    }

</style>

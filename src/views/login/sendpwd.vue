<template>
    <div class="sendpwd-container">
        <el-form autoComplete="on" :model="resetForm" :rules="resetRules" ref="resetForm" label-position="left"
                 label-width="0px"
                 class="card-box reset-form">
            <div>
                <router-link to="/login" class="back-icon">
                    <i class="el-icon-arrow-left"></i>
                </router-link>
                <h3 class="title">发送验证码至手机</h3>
            </div>
            <el-form-item prop="telephone">
                <el-input name="telephone" type="text" v-model="resetForm.telephone"
                          placeholder="手机号"></el-input>
            </el-form-item>

            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleSendPWD">
                    发送验证码至手机
                </el-button>
            </el-form-item>
            <router-link to="/reset">
                <el-button type="info" style="width:100%;">
                    已收到验证码,去重设密码
                </el-button>
            </router-link>
        </el-form>
    </div>
</template>

<script>
    
    export default {
      name: 'reset',
      data() {
        return {
          resetForm: {
            telephone: ''
          },
          resetRules: {
            telephone: [
                        { required: true, trigger: 'blur' }
            ]
          },
          loading: false
        }
      },
      methods: {
        handleSendPWD() {
          this.loading = true;
          this.$refs.resetForm.validate(valid => {
            if (valid) {
                
            } else {
              this.$message.error('错误提交!!');
            }
            this.loading = false;
          });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .sendpwd-container {
        height: 100vh;
        background-color: #2d3a4b;
        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
            -webkit-text-fill-color: #3E3E3E !important;
        }
        .back-icon{
            float: left;
            margin-top: 5px;
        }
        .reset-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 350px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .card-box {
            padding: 20px;
            box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
            -webkit-border-radius: 5px;
            border-radius: 5px;
            -moz-border-radius: 5px;
            background-clip: padding-box;
            margin-bottom: 20px;
            background-color: #F9FAFC;
            width: 400px;
            border: 2px solid #8492A6;
        }

        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
    }

</style>

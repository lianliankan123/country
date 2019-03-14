// import { loginByEmail, logout, getInfo } from 'api/login';
import Cookies from 'js-cookie';

import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { Message } from 'element-ui';

const user = {
  state: {
    uid: Cookies.get('userId'),
    token: Cookies.get('userToken'),
    userInfo:null,
  },
  mutations: {
    SET_UID: (state, uid) => {
      state.uid = uid;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },

  },

  actions: {
    //用户名登录
    LoginByUserName({ commit ,dispatch}, {login}) {  
     const name = login.userName;
     const pwd = login.password;
     const vCode = login.vCode;    
     return new Promise((resolve, reject) => {
      global.post( api.userlogin,{},{params:{username:name,password:pwd,vCode:vCode,rememberMe:true}},function(res){
                    if(res.body.code== 0){
                      let data = res.body;
                      Cookies.set('userToken', data.data.salt,{ expires: 1/3}); //设置token
                      Cookies.set('userId', data.data.id,{ expires: 1/3}); //设置用户id，

                      Cookies.set('username',name,{ expires: 1/3}); 
                      Cookies.set('password',pwd,{ expires: 1/3}); 
                      Cookies.set('vCode', vCode,{ expires: 1/3}); 

                      commit('SET_TOKEN', data.data.salt);
                      commit('SET_UID',data.data.id);
                      commit('SET_USERINFO', data.data); 
                      var permissions={
                          "/errorpage/401":true,
                          "/errorpage/404":true,
                          "/zhu/zhuye":true
                       };
                       if(data.data.position == 0){
                          permissions["/apply/applys"] = true;
                       }else if(data.data.position == 1){
                          if(data.data.type==0){
                              permissions["/article/tableList"] = true;
                              permissions["/article/connection"] = true;
                              permissions["/article/nodes"] = true;
                          }else {
                              permissions["/article/tableList"] = true;
                              permissions["/article/connection"] = true;
                          }
                       }
                      dispatch('GenerateRoutes', permissions);
                      resolve();
                    }else{
                          Message({
                            showClose: true,
                            message: res.body.msg,
                            type: 'error'
                         });
                    }
             
        },function(res){
            reject(res);
        })

        return false;

      });
    },
      // 获取用户信息
    GetInfo({ dispatch,commit}) {
        return new Promise((resolve, reject) => {
            global.post( api.userlogin,{},{params:{username:Cookies.get('username'),password:Cookies.get('password'),vCode:Cookies.get('vCode'),rememberMe:true}}, function(res){
                  if(res.body.code== 0){
                      let data = res.body;
                      commit('SET_UID', data.data.id); 
                      commit('SET_USERINFO', data.data); 
                       var permissions={
                          "/errorpage/401":true,
                          "/errorpage/404":true,
                          "/zhu/zhuye":true
                       };
                       let type = Cookies.get('type');
                       if(data.data.position == 0){
                          permissions["/apply/applys"] = true;     
                       }else if(data.data.position == 1){
                        if(data.data.type==0){
                          permissions["/article/tableList"] = true;
                          permissions["/article/connection"] = true;
                          permissions["/article/nodes"] = true;
                        }else {
                            permissions["/article/tableList"] = true;
                            permissions["/article/connection"] = true;
                        }
                       }
                      dispatch('GenerateRoutes', permissions);
                      resolve();
                    }else{
                          Message({
                            showClose: true,
                            message: res.body.msg,
                            type: 'error'
                         });
                    }
            },function(res){
                reject(res);
            })

            
        });
    },
     // 上传文章名称
    PostList({ commit, state}, {alm}) {
      const alist = alm.list;
      const alinks = alm.links;
      const alistcontent = alm.listcontent;
      return new Promise((resolve, reject) => {
          global.get( api.articleList,{params:{'list':alist,'links':alinks,'listcontent':alistcontent,'id':state.id}}, function(res){
                       commit('SET_CLIST', alist);
                       commit('SET_CLINKS', alinks);
                       commit('SET_LISTCONTENT',alistcontent);
            },function(res){
                reject(res);
            })
         });
     },

   // 上传图片
    PostPicture({ commit}, {img}) {
      const image = img.trim();
      return new Promise((resolve, reject) => {
          global.get(api.uploadpicture,{params:{'img':image}}, function(res){
              //res.body.data += image;
               resolve();
            },function(res){
                reject(res);
            })
         });
     },




    // 第三方验证登录
    LoginByThirdparty({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
          commit('SET_TOKEN', response.data.token);
          Cookies.set('userToken', response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },


    // 登出 （头部登出）
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        //换成请求登出接口

          commit('SET_TOKEN', '');
         
          Cookies.remove('userToken');
          Cookies.remove('userId');

          Cookies.remove('username'); 
          Cookies.remove('password'); 
          Cookies.remove('vCode'); 
          resolve();
      });
    },


    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        dispatch('GenerateRoutes', res.permissions);
        resolve();
      })
    }
  }
};

export default user;

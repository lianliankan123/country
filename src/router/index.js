import Vue from 'vue';
import Router from 'vue-router';

const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow
// 所以只在生产中使用延迟加载

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');
const authRedirect = _import('login/authredirect');
const sendPWD = _import('login/sendpwd');
const reset = _import('login/reset');

const Zhuye = _import('zhu/zhuye');
/* error page */
const Err404 = _import('error/404');
const Err401 = _import('error/401');

/*申请*/
const Applys = _import('apply/applys');

/*文章页面*/
const Connection = _import('article/connection');
const TableList = _import('article/tableList');
const Nodes = _import('article/nodes');

/* 系统管理*/
const PermissionsManage = _import('systemSet/permissionsManage');


Vue.use(Router);

 /**
  * icon : 菜单图标
  * hidden : true不显示在菜单栏
  * redirect : noredirect 为不重定向
  * noDropdown : true 不显示子菜单
  * meta : { role: ['admin'] }  will control the page role
  **/

const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/authredirect', component: authRedirect, hidden: true },
  { path: '/sendpwd', component: sendPWD, hidden: true },
  { path: '/reset', component: reset, hidden: true },
  { path: '/404', component: Err404, hidden: true },  //假地址时重定向
  { path: '/401', component: Err401, hidden: true },  //无权限时重定向

  {
    path: '/',
    redirect: '/zhu/zhuye',  //重定向到默认首页
    hidden: true,
    
  },
  {
    path:'/zhu',
    component: Layout,
    redirect:'noredirect',
    children: [
      { path: 'zhuye', component: Zhuye, name: '主页' },
    ]
  }, 
  {
    path: '/errorpage',
    component: Layout,
    redirect: 'noredirect',
    name: '错误页面',
    children: [
      { path: '401', component: Err401, name: '401' },
      { path: '404', component: Err404, name: '404' }
    ]
  },
  {
    path: '/systemSet',
    component: Layout,
    redirect: 'noredirect',
    name: '系统设置',
    children: [
      { path: 'permissionsManage', component: PermissionsManage, name: '权限管理' },
      
    ]
  },

  { path: '*', redirect: '/404', hidden: true },

  { 
    path: '/article',
    component: Layout,
    redirect: 'noredirect',
    name:'构架图管理',
    children:[
    { path: 'tableList',component: TableList, name:'构架图' },
    { path: 'connection',component: Connection, name:'单构架图' },
    { path:'nodes',component:Nodes,name:'节点操作'}
    ]
  },
  {
    path:'/apply',
    component:Layout,
    redirect: 'noredirect',
    name:'',
    children:[
    {path:'applys',component:Applys,name:'申请审批'}
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

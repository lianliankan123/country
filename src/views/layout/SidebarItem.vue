<template>
    <div>        
        <!-- 注意：路由表不能配置在后端，不然前端无法配置跳转到某些路由，例如提交成功后返回至某个固定路由 lss 2017-6-27 -->
        <!-- 菜单权限json（调试专用）：==={{ routes | json }} -->
        <template v-if="routes">

            <router-link  class="menu-indent" to="/zhu/zhuye" v-if="routes['/zhu/zhuye']">
                <el-menu-item index="/zhu/zhuye">
                    <i class="fa fa-home" aria-hidden="true"></i>主页
                </el-menu-item>
            </router-link>

            <router-link  class="menu-indent" to="/article/tableList" v-if="routes['/article/tableList']">
                <el-menu-item index="/article/tableList">
                    <i class="fa fa-list-alt" aria-hidden="true"></i>构架图管理
                </el-menu-item>
            </router-link>

            <router-link  class="menu-indent" to="/article/nodes" v-if="routes['/article/nodes']">
                <el-menu-item index="/article/nodes">
                    <i class="fa fa-inbox" aria-hidden="true"></i>节点操作
                </el-menu-item>
            </router-link>

            <router-link  class="menu-indent" to="/apply/applys" v-if="routes['/apply/applys']">
                <el-menu-item index="/apply/applys">
                    <i class="fa fa-inbox" aria-hidden="true"></i>申请审批
                </el-menu-item>
            </router-link>

            <el-submenu index="系统设置" v-if="routes['/systemSet/permissionsManage'] || routes['/systemSet/loginLog']"> 
                <template slot="title">
                    <i class="fa fa-cogs fa-fw" aria-hidden="true"></i> 系统设置
                </template>
              
                    <router-link  class="menu-indent" to="/systemSet/permissionsManage" v-if="routes['/systemSet/permissionsManage']">
                        <el-menu-item index="/systemSet/permissionsManage">
                            权限管理
                        </el-menu-item>
                    </router-link>
               
            </el-submenu>

        </template>    
        

    </div>
</template>

<script>
    //获取vuex中的菜单权限 进行菜单show展示。登陆成功时直接 返回菜单json 并包含帐户信息
    export default {
      name: 'SidebarItem',
      props: {
        routes: {
         
        }
      },

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .wscn-icon {
        margin-right: 10px;
    }
    .fa{
        margin-right: 10px;
    }
    .hideSidebar .menu-indent{
        display: block;
        text-indent: 10px;
    }
</style>


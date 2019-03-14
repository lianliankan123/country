<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <div class="filter-container">

        <el-button class="filter-item" type="primary" @click="handleCreate"  icon="edit">新增角色</el-button>
        <el-button class="filter-item" icon="edit" type="primary"  @click="setPermissions" >设置权限</el-button>
    </div>
   
    <!-- 表格 -->
    <el-table ref="multipleTable" @selection-change="handleSelectionChange" @cell-click="handleClick":data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >
         <el-table-column type="selection" width="65">
         </el-table-column>

           <el-table-column align="center" label='序号' width="100" type="index">
          </el-table-column>


          <el-table-column label="角色" width="" prop="position">
          </el-table-column>

          <el-table-column label="对应用户" width="" prop="userName">
          </el-table-column>

            <el-table-column align="center"  label="操作" >
                <template scope="scope">
                   <el-button icon="edit" size="small" @click="handleEdit">编辑</el-button>
                   <el-button icon="delete" size="small" type="danger" @click="handleDelete">删除</el-button>                   
                </template>

            </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currPage"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog title="表单新增" :visible.sync="dialogFormVisible">
        <el-form class="small-space" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>

            <el-form-item label="真名">
              <el-input v-model="roleTemp.userCode"></el-input>
            </el-form-item>

             <el-form-item label="用户名">
              <el-input v-model="roleTemp.userName"></el-input>
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="roleTemp.email"></el-input>
            </el-form-item>
      
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
           
            <el-button type="primary" @click="handleCreateSubmit">确 定</el-button>
        </div>
    </el-dialog>

   
    <el-dialog title="设置权限" :visible.sync="dialogPermissionsVisible">
          <el-form class="small-space" :model="remark" label-position="left" label-width="70px" style='width: 100%; '> 
           
              <el-checkbox v-for="item in smMenuBeanDtoList" label="item.url" name="type" style="margin:0 15px 15px 0;"  v-model="item.set">{{ item.menuName }}</el-checkbox>
     
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogPermissionsVisible = false">取 消</el-button>
           
            <el-button type="primary" @click="setPermissionsSubmit">确 定</el-button>
          </div>
    </el-dialog>

  </div>
</template>

<script>
import {global} from 'src/global/global';
import {api} from 'src/global/api';

import store from '../../store';

export default {
  data() {
    return {
        list: null,//表格list
        smMenuBeanDtoList:null,//菜单
        total: null,
        row:null,
        listLoading: true,
        listQuery: {
            currPage: 1,
            pageSize: 10          
        },
        remark:"",
        roleTemp:{
            "userCode": "",
            "userName": "",
            "email": ""
        },
        ruleForm:{
            permissions:[]
        },
        dialogFormVisible: false,
        dialogPermissionsVisible:false,
        multipleSelection: []

    }
  },
  mounted() {
    var vm = this;
    vm.getList();
  },
  methods: {
    //获取列表数据
    getList() {
        var vm = this;
        vm.listLoading = true;
        global.get( api.roleAndUser,{params: {currPage:vm.listQuery.currPage,pageSize:vm.listQuery.pageSize}},function(res){
                let all = res.body;
                vm.list = all.data.data.userbaseinfoList;
                vm.total = vm.list.length;
                vm.listLoading = false;       
        },function(res){
            
            vm.listLoading = false;
        },false)   

    },
    //点击
    handleClick(row,column){
      let vm = this;
      if(column.label=="操作"){
         vm.row = row.position;
      }
    },
    handleEdit(){

    },
    //单个删除
    handleDelete(){
       
    },
    //操作分页
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    //操作分页
    handleCurrentChange(val) {
      this.listQuery.currPage = val;
      this.getList();
    },
    //新增
    handleCreate() {
        this.dialogFormVisible = true;
    },
    //设置权限
    setPermissions() {
        var vm = this;
        let roleId = 0;
        if(vm.row=="管理员"){
            roleId = 1 ;
        }
        global.get( api.getMenuAndElement,{params: {roleId:roleId} },function(res){
            var data = res.body;
           if(data.resultCode == 0){ 
                vm.smMenuBeanDtoList = data.data.smMenuBeanDtoList;              
           }else{
                Message({
                    showClose: true,
                    message: res.body.resultMsg,
                    type: 'error'
                });
                
           }       
            vm.dialogPermissionsVisible = true; 
        },function(res){      
            vm.dialogPermissionsVisible = true;         
        },false)

        
    },
    //设置权限提交
    setPermissionsSubmit(){
        var vm = this;

        //周转成前端所需格式 提交到vuex中。实际开发去掉以下代码，把以上参数提交给接口即可。2017-7-9
        var permissions = {};

        for (var i = 0 , len = vm.smMenuBeanDtoList.length; i < len; i++) {
            permissions[vm.smMenuBeanDtoList[i].url] = vm.smMenuBeanDtoList[i].set;
        }

        vm.$message({
            showClose: true,
            message: "动态修改权限成功！实际开发请把参数提交给后端接口！",
            type: 'success'
        });
       // store.dispatch('GenerateRoutes', permissions);

    },
    //新增提交
    handleCreateSubmit(){
        var vm = this;
        console.log('新增入参：',vm.roleTemp);
        let position = "管理员";
        var item = { position :position,
                    userCode : vm.roleTemp.userCode,
                    userName : vm.roleTemp.userName,
                    email :vm.roleTemp.email}; 
        vm.list.push(item)
        console.log('新增后',vm.list)
        
        this.dialogFormVisible = false;
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    }
  }
};
</script>

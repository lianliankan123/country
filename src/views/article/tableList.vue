<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
      </el-input>
      <el-button class="filter-item" type="primary"  icon="search" @click="handleFilter">搜索</el-button>

      <el-button class="filter-item" type="primary" @click="dialogFormVisible = true;"  icon="edit">添加</el-button>

      <el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>
     
    </div>

    
   
    <!-- 表格 -->
    <el-table ref="multipleTable" @selection-change="handleSelectionChange" @cell-click="handleClick":data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >
         <el-table-column type="selection" width="65">
         </el-table-column>

          <el-table-column align="center" label='序号' width="100">
            <template scope="scope">
              {{scope.$index}}
            </template>
          </el-table-column>

          <el-table-column label="方向" width="">
            <template scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>

          <el-table-column label="描述" width="">
            <template scope="scope">
              {{scope.row.description}}
            </template>
          </el-table-column>
            <el-table-column align="center"  label="操作" >
                <template scope="scope">
                    
                   <el-button size="small" @click="dialogForm = true;">编辑</el-button>
                   <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                         
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
    <el-dialog title="新增方向" :visible.sync="dialogFormVisible">
          <el-form class="small-space" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>

            <el-form-item label="方向名称">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>

          <el-form-item label="描述">
            <el-input v-model="temp.description"></el-input>
          </el-form-item>

        </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
           
            <el-button type="primary" @click="handleCreateSubmit">确 定</el-button>
          </div>
    </el-dialog>

     <!-- 编辑弹窗 -->
    <el-dialog title="编辑方向" :visible.sync="dialogForm">
        <el-form class="small-space" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>

            <el-form-item label="方向名称">
              <el-input v-model="name"></el-input>
            </el-form-item>

           <el-form-item label="描述">
            <el-input v-model="description"></el-input>
           </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="quxiao">取 消</el-button>
          <el-button type="primary" @click="handleEdit">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { mapGetters } from 'vuex';
import { Message } from 'element-ui';

export default {
  data() {
    return {
        list: null,
        total: null,
        listLoading: true,
        type : '',
        preid:'',
        prename:'',
        predescription:'',
        name:'',
        description:'',
        mid:0,
        listQuery: {
            currPage: 1,
            pageSize: 10,
        },
        temp: {
          "name":"",
          "description":"",
           id:null
        },
        dialogFormVisible: false,
        dialogForm : false,
        multipleSelection: []

    }
  },
  computed: {
        ...mapGetters([
           'uid','userInfo'
        ])
  },
  mounted() {
    let vm = this;
    vm.getList();
  },
  methods: {
    //获取列表数据
    getList() {
        let vm = this;
        vm.listLoading = true;
        let UID = parseInt(vm.uid);
        let type = vm.userInfo.type;
        let open = 0 ;
        let fprivate = 0 ;
        if(type==0){
           open = 1 ;
           fprivate = 0;
        }else if(type==1){
          open = 0;
          fprivate = 1;
        }
        global.post( api.getAllDirections,{},{params: {adminId:UID,flagOpen:open,flagPrivate:fprivate}},function(res){
         if(res.body.code== 0){
              let data = res.body;
              vm.list = data.data;
              vm.total = vm.list.length;
              vm.listLoading = false;
          }else{
              Message({
                showClose: true,
                message: res.body.msg,
                type: 'error'
             });
             vm.listLoading = false;
          }
        },function(res){
            
            vm.listLoading = false;
        },false)

    },
    handleClick(row,column){
       let vm = this;
       if(column.label!="操作"){
          this.$router.push( { path: '/article/connection', query: { id:row.id } } );
       }else{
          vm.preid = row.id;
          vm.name = row.name;
          vm.description = row.description;
          vm.prename = row.name;
          vm.predescription = row.description;
       }
    },
    //编辑
    handleEdit(){
        let vm = this;
        let UID = parseInt(vm.uid);
        global.post( api.updateDirection,{},{params: {adminId:UID,id:vm.preid,name:vm.name,description:vm.description}},function(res){
         if(res.body.code== 0){
              console.log(res.body.msg);
              for(let m in vm.list){
                if(vm.list[m].id == vm.preid){
                  vm.list[m].name = vm.name;
                  vm.list[m].description = vm.description;
                }
              }
          }else{
              Message({
                showClose: true,
                message: res.body.msg,
                type: 'error'
             });
          }
        },function(res){
            
            vm.listLoading = false;
        },false)
        vm.dialogForm = false;
    },
    quxiao(){
      let vm = this;
       for(let m in vm.list){
          if(vm.list[m].id == vm.preid){
            vm.list[m].name = vm.prename;
            vm.list[m].description = vm.predescription;
          }
       }
      vm.dialogForm = false;
    },
    //单个删除
    handleDelete(index,row){
        let vm = this;
        //前端删除。
        vm.list.splice(index,1);
        let UID = parseInt(vm.uid);
        global.post( api.deleteDirection,{},{params: {adminId:UID,directionId:row.id}},function(res){
          if(res.body.code== 0){
             console.log(res.body.msg);
          }else{
              Message({
                showClose: true,
                message: res.body.msg,
                type: 'error'
             });
          }
        },function(res){
           
        },false)
    },
    //批量删除
    handleDelAll(){
        let vm = this;
    },
     //搜索
    handleFilter() {
      this.getListChoose();
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
    //新增提交
    handleCreateSubmit(){
        let vm = this;
        let UID = parseInt(vm.uid);
        vm.listLoading = true;
        global.post( api.addNewDirection,{}, {params: {adminId:UID,name:vm.temp.name,description:vm.temp.description}},function(res){
           if(res.body.code== 0){
              console.log(res.body.msg);
              vm.temp.id = res.body.data.Id;
              vm.listLoading = false;
          }else{
              Message({
                showClose: true,
                message: res.body.msg,
                type: 'error'
             });
             vm.listLoading = false;
          }
        },function(res){
             vm.listLoading = false;
        },false)
        if(vm.list==null){
            vm.list = [vm.temp];
        }else{
            vm.list.push(vm.temp);
        }
        console.log(vm.list);
        this.dialogFormVisible = false;
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    }
  }
};
</script>

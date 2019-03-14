<template>
  <div class="app-container">

    <div class="filter-container">

      <el-button class="filter-item" type="primary"  icon="circle-check" @click="BatchAllow">批量允许</el-button>
      <el-button class="filter-item" type="primary"  icon="circle-close" @click="BatchRefuse">批量拒绝</el-button>
     
    </div>

    <!-- 表格 -->
    <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row  >
         <el-table-column type="selection" width="65">
         </el-table-column>

          <el-table-column align="center" label='序号' width="100">
            <template scope="scope">
              {{scope.$index}}
            </template>
          </el-table-column>

          <el-table-column label="申请人" width="100">
            <template scope="scope">
              {{scope.row.adminid}}
            </template>
          </el-table-column>

          <el-table-column label="申请内容" width="">
            <template scope="scope">
              {{scope.row.content}}
            </template>
          </el-table-column>

            <el-table-column align="center"  label="操作" >
                <template scope="scope">
                    
                   <el-button size="small" @click="handleAllow(scope.$index, scope.row)">允许</el-button>
                   <el-button size="small" type="danger" @click="handleRefuse(scope.$index, scope.row)">拒绝</el-button>
                         
                </template>
            </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currPage"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {global} from 'src/global/global';
import {api} from 'src/global/api';

export default {
  data() {
    return {
        list: null,
        total: null,
        listLoading: false,
        type : '',
        mid:0,
        listQuery: {
            currPage: 1,
            pageSize: 10
        },
        dialogFormVisible: false,
        multipleSelection: []

    }
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
        global.get( api.appl,{params:{} },function(res){
                let data = res.body;
                vm.list = data.data.data;
                vm.total = vm.list.length;
                vm.listLoading = false;
        },function(res){
            
            vm.listLoading = false;
        },false)

    },
    //允许
    handleAllow(index,row){
        let vm = this;
        vm.list.splice(index,1);
        vm.total-=1;
    },
    //批量允许
    BatchAllow(){
        let vm = this; 
        let m = 0 ;
        let list1 =vm.list;
         do {
          if(vm.multipleSelection.indexOf(JSON.stringify(vm.list[m]))){
              list1.splice(m,1);
          }else{
            m++;
          }
        }while( m <vm.list.length );
        vm.list = list1;
        vm.total = 0;
    },
    //拒绝
    handleRefuse(index,row){
        let vm = this;
        vm.list.splice(index,1)
        vm.total -=1;
    },
    //批量拒绝
    BatchRefuse(){
       let vm = this; 
        let m = 0 ;
        let list1 =vm.list;
         do {
          if(vm.multipleSelection.indexOf(JSON.stringify(vm.list[m]))){
              list1.splice(m,1);
          }else{
            m++;
          }
        }while( m <vm.list.length );
        vm.list = list1;
        vm.total =0;
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
    handleSelectionChange(val) {
        this.multipleSelection = val;
    }
  }
};
</script>

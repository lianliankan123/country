<template>
  <div class="app-container">
      <div id="articles">            
      </div>
      <div class="filter-container">
        <el-button class="filter-item" type="primary"  @click="dialogFormVisible = true ">操作节点</el-button>
        <el-button  class="filter-item" type="primary"  @click="savechange">申请修改</el-button>
      </div>
    <el-dialog title="操作节点" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-row>
          <el-col class="zc"><el-button @click="dialogFormVisible=false;add=true;">添加节点</el-button></el-col>
          <el-col class="zc"><el-button @click="dialogFormVisible=false;nlink=true;">添加联系</el-button></el-col>
           <el-col class="zc"><el-button @click="dialogFormVisible = false">取消操作</el-button></el-col>
        </el-row>
        <el-row>
          <el-col class="zc"><el-button @click="dialogFormVisible=false;scjd=true;">删除节点</el-button></el-col>
          <el-col class="zc"><el-button @click="dialogFormVisible=false;dlink=true;">删除联系</el-button></el-col>
        </el-row>
      </el-dialog>
      <el-dialog title="操作节点" :visible.sync="dialogForm" :close-on-click-modal="false">
        <el-row>
          <el-col class="zc"><el-button @click="deleteNode">删除节点</el-button></el-col>
          <el-col class="zc"><el-button @click="dialogForm = false">取消操作</el-button></el-col>
        </el-row>
      </el-dialog>
      <el-dialog title="删除联系" :visible.sync="lianxi" :close-on-click-modal="false">
        <div slot="footer" class="dialog-footer">
              <el-button @click="lianxi = false">取消</el-button>
              <el-button type="primary" @click="dlianxi">确定</el-button>
            </div>
      </el-dialog>
      <el-dialog title="删除节点" :visible.sync="scjd" :close-on-click-modal="false">
        <el-form>
           <el-form-item name="节点">
             <el-select v-model="mynode" placeholder="请选择">
                <el-option
                  v-for="item in option.series[0].data"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
              <el-button @click="scjd = false">取消</el-button>
              <el-button type="primary" @click="deleteNode1">确定</el-button>
          </div>
      </el-dialog>
    <el-dialog title="新增节点" :visible.sync="add">
       <el-form>
           <el-form-item label="节点">
             <el-select v-model="form" placeholder="请选择">
                <el-option
                  v-for="item in nodelist"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
           </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="add = false">取 消</el-button>
              <el-button type="primary" @click="addNode">确 定</el-button>
          </div>
    </el-dialog>
    <el-dialog title="新增节点联系" :visible.sync="nlink">
      <el-form>
        <el-form-item name="节点前驱">
           <el-select v-model="precursor" placeholder="请选择">
            <el-option
              v-for="item in option.series[0].data"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
         </el-form-item>
         <el-form-item name="节点后继">
           <el-select v-model="subsequence" placeholder="请选择">
            <el-option
              v-for="item in option.series[0].data"
              :key="item.name"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nlink = false">取 消</el-button>
          <el-button type="primary" @click="addNlink">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="删除节点联系" :visible.sync="dlink">
      <el-form>
        <el-form-item name="节点联系">
           <el-select v-model="dp" placeholder="请选择">
            <el-option
              v-for="item in option.series[0].links"
              :key="item.id"
              :label="item.source+'->'+item.target"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dlink = false">取 消</el-button>
          <el-button type="primary" @click="deleNlinks">确 定</el-button>
        </div>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import {global} from 'src/global/global';
import {api} from 'src/global/api';
import { mapGetters } from 'vuex';
import { Message } from 'element-ui';

var echarts = require('echarts');
export default {
  data() {
    return {
       dialogFormVisible: false,
       dialogForm: false,
       scjd:false,
       revise:false,
       revise1:false,
       lianxi:false,
       add:false,
       flag:false,
       nlink:false,
       dlink:false,
       myChart:null,
       prevalue:"",
       prename:"",
       predetail:"",
       list:[{value:'',
              name: '',
              detail:''}
            ],
       links:[],
       img1:'',
       detail:[],
       form: '',
       formnameWidth:'120px',
       option:{
        series:[{
                data: [{
                    value:'',
                    name: '',
                    detail:''
                  }],
                links: [{  
                  id:'',
                  source: '',
                  target: ''
                }]
        }]
      },
      precursor:'',
      subsequence:'',
      dp:'',
      mynode:'',
      linksId:'',
      nodelist:[{
        "id": '',
        "name":''
      }]
    }
  },
  computed: {
     ...mapGetters([
           'uid','userInfo'
        ])
    },
  mounted() {
     this.drawLine();
     this.getNodeList();
   },
  methods: {

    drawLine(){
      this.myChart = echarts.init(document.getElementById('articles'));
      var vm = this;
      global.post(api.getNodesByDirection,{},{params:{directionId:vm.$route.query.id}},function(res){
          let data = res.body;
          vm.list = data.data.list;
          vm.links = data.data.links;
          console.log(vm.links);
          vm.option = {
              backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                  offset: 0,
                  color: '#f7f8fa'
                  }, {
                  offset: 1,
                  color: '#cdd0d5'
                  }
              ]),
              title:{},
              tooltip: {
                  formatter: function (params) {
                        if(params.dataType=="node"){
                            let node=params.data.name;
                            let detail = ''; 
                            for(let i in vm.list){
                              if(vm.list[i].name== node ){
                                  detail = vm.list[i].detail;
                                  break;
                              }
                            }
                            return detail ;
                         }else if(params.dataType=="edge"){
                             return params.data.source+'->'+params.data.target;
                         }         
                   }
              },
              animationDuration: 3000,
              animationEasingUpdate: 'quinticInOut',
              series: [{
                  name: '构架图',
                  type: 'graph',
                  layout: 'force',
                  force: {
                      repulsion: 100
                  },
                  draggable : true,
                  data: vm.list,
                  links: vm.links,
                  focusNodeAdjacency: true,
                  emphasis: {
                    label: {
                        show: false
                    }
                  },
                  roam: true,
                  label: {
                    normal: {
                      show: true,
                      position: 'top',
                    }
                  },
                  lineStyle: {
                      normal: {
                          color: 'source',
                          curveness: 0.3,
                          type: "solid"
                      }
                  }
              }] 
        };
        vm.myChart.setOption(vm.option);
      },function(res){
          
      },false)
      vm.myChart.on('click', (params) => {
              if(params.dataType=='node'){
                vm.prename = params.data.name;
                vm.predetail = params.data.detail;
                vm.prevalue = params.data.value;
                console.log(vm.prevalue);
                vm.dialogForm=true;
              }else if(params.dataType=='edge'){
                vm.linksId = params.data;
                vm.lianxi = true;
            }
      }); 
    },
    getNodeList(){
        let vm = this;
        global.post( api.getAllNodes,{},{params: {}},function(res){
         if(res.body.code== 0){
              let data = res.body;
              vm.nodelist = data.data;
             
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
    deleteNode(){
      let vm = this; 
      let UID = parseInt(vm.uid);
      console.log(UID,vm.prevalue,vm.$route.query.id);
      global.post( api.deleteNodeDirection,{},{params: {adminId:UID,nodeId:vm.prevalue,directionId:vm.$route.query.id}},function(res){
       if(res.body.code== 0){
          let m = 0 ;
          while(m <vm.links.length) {
              if ((vm.links[m].target == vm.prename) || (vm.links[m].source == vm.prename)) {
                vm.links.splice(m,1);  
              }else{
                m++;
              }
          }
          for(let j in vm.list){
            if(vm.prename==vm.list[j].name){
              vm.list.splice(j,1);
              break;
            }
          }
          vm.myChart.setOption(vm.option);
          vm.dialogForm=false;
        }else{
            Message({
              showClose: true,
              message: res.body.msg,
              type: 'error'
           });
            vm.dialogForm=false;
        }
      },function(res){
           vm.dialogForm=false;
      },false)
    },
    deleteNode1(){
      let vm = this;
      let UID = parseInt(vm.uid);
      for(let j in vm.list){
            if(vm.mynode==vm.list[j].value){
              vm.list.splice(j,1);
              break;
            }
          }
          for(let m in vm.list){
              if(vm.mynode == vm.list[m].value){
                  vm.mynode = vm.list[m].name;
                  break;
              }
          }
      global.post( api.deleteNodeDirection,{},{params: {adminId:UID,nodeId:vm.mynode,directionId:vm.$route.query.id}},function(res){
       if(res.body.code== 0){
          let m = 0;
          while(m <vm.links.length) {
              if ((vm.links[m].target == vm.mynode) || (vm.links[m].source == vm.mynode)) {
                vm.links.splice(m,1);  
              }else{
                m++;
              }
          }
          vm.myChart.setOption(vm.option);
          vm.scjd=false;
        }else{
            Message({
              showClose: true,
              message: res.body.msg,
              type: 'error'
           });
            vm.scjd=false;
        }
      },function(res){
           vm.scjd=false;
      },false)
  },
  addNode(){
       let vm =this;
       global.post( api.addNodeDirection,{},{params: {nodeId:vm.form,directionId:vm.$route.query.id}},function(res){
           if(res.body.code== 0){
              let newNode ={value:'',name:'',detail:''};
              for(let m in vm.nodelist){
                  if(vm.form == vm.nodelist[m].id){
                      newNode.value = vm.nodelist[m].id;
                      newNode.name = vm.nodelist[m].name;
                      newNode.detail = vm.nodelist[m].detail;
                      break;
                  }
              }
              vm.list.push(newNode);
              vm.myChart.setOption(vm.option);
              vm.add=false;
            }else{
                Message({
                  showClose: true,
                  message: res.body.msg,
                  type: 'error'
               });
               vm.add=false;
            }
      },function(res){
           vm.add=false;
      },false)
      vm.add=false;
  },
  addNlink(){
      let yanzheng = 1 ;
      let UID = parseInt(this.uid);
      let newLink = {
          source: this.precursor,
          target: this.subsequence,
          id:null
      };
      let vm = this; 
        global.post(api.addLinks,{},{params: {adminId:UID,parentId:vm.precursor,childId:vm.subsequence,degree:1,directionId:vm.$route.query.id}},function(res){
         if(res.body.code== 0){
            newLink.id = res.body.data;
            for(let m in vm.list){
              if(vm.precursor==vm.list[m].value){
                  newLink.source = vm.list[m].name;
              }else if(vm.subsequence==vm.list[m].value){
                 newLink.target = vm.list[m].name;
              }
            }
            console.log(newLink);
            vm.links.push(newLink);
            vm.myChart.setOption(vm.option);
            vm.nlink=false; 
          }else{
              Message({
                showClose: true,
                message: res.body.msg,
                type: 'error'
             });
          }
        },function(res){
            vm.nlink=false; 
        },false)
  },
  deleNlinks(){
      let vm = this;
      let UID = parseInt(this.uid);
      for (let m in vm.links){
          if(vm.links[m].id == vm.dp){
            vm.links.splice(m,1);
            break;
          }
     }
      vm.myChart.setOption(vm.option);
      vm.dlink=false;
      global.post(api.deleteLinks,{},{params: {adminId:UID,nodeNodeId:vm.dp}},function(res){
         if(res.body.code== 0){
             for (let m in vm.links){
                if(vm.links[m].id == vm.dp){
                  vm.links.splice(m,1);
                  break;
                }
            }
             vm.myChart.setOption(vm.option);
             vm.dlink=false;
          }else{
              Message({
                showClose: true,
                message: res.body.msg,
                type: 'error'
             });
             vm.dlink=false; 
          }
        },function(res){
            vm.dlink=false; 
        },false)
  },
  dlianxi(){
      let vm = this;
      let UID = parseInt(this.uid);
      global.post(api.deleteLinks,{},{params: {adminId:UID,nodeNodeId:vm.linksId.id}},function(res){
         if(res.body.code== 0){
          for(let m in vm.links){
            if(vm.linksId.id == vm.links[m].id){
              vm.links.splice(m,1);
              break;
            }
          }
          vm.myChart.setOption(vm.option);
          vm.lianxi=false;
          }else{
              Message({
                showClose: true,
                message: res.body.msg,
                type: 'error'
             });
          }
        },function(res){
            vm.lianxi=false; 
        },false)
  },
  savechange(){
   var img = new Image();
    img.src = this.myChart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
    });
    alert("已申请！");
  }
  }
};

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #articles{
      width: 60em;
      height: 30em;
      margin-top:-2em;
      margin-bottom:1em;
  }
  .xc{
      width:5em;
  }
  .yc{
    width:10em;
  }
  .el-col {
    border-radius: 4px;
  }
  .zc{
    width:10em;
  }
</style>
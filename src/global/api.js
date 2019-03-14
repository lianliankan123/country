//接口配置

//把全体接口封装在的前端配置文件（序号与接口文档一一对应），多个环境配置时可快速切换整站式的全部接口，不用逐个页面去改。
const config = require('../../config');

let url = {
    apiUrl: "/ccp-web/api", //接口路径
    //ctxPath: "/ccp-web/dist", //tomcat服务dist目录
    ctxPath: "/dist", //node服务dist目录

    //staticPath:config.dev.staticPath,       //开发环境静态资源路径
    // 条件 ? 结果1 : 结果2 //三元运算符，表示条件为true时，等式的结果就为结果1（'./'），否则为结果2('/static/')。
    // development为开发环境（npm run dev），另外一个production是生产环境（）
    // 生产环境时staticPath的值为'./'，开发环境时staticPath的值为'/static/'。
    staticPath: process.env.NODE_ENV !== 'development' ?  config.build.staticPath: config.dev.staticPath
};

//----------------请注意：如果正式环境，不需要本地json数据模拟，请删除以上代码和api中的模拟接口。----------------

let nodeApiBaseUrl = 'http://115.159.181.30/nai';

export const api = {
            
            "roleAndUser":url.staticPath+"/dataJson/roleAndUser.json",  //获取角色和对应用户  
            "getMenuAndElement":url.staticPath+"/dataJson/getMenuAndElement.json",  //获取用户的 菜单和元素权限 
            "uploadpicture":url.staticPath+"/dataJson/picture.json",//上传图片模拟接口
            "appl":url.staticPath + "/dataJson/app.json",

            "userlogin":nodeApiBaseUrl+"/admin/adminLogin", 
            "getVer":nodeApiBaseUrl+"/getVerificationCodeForLogin",
            "getDirectionPage":nodeApiBaseUrl + "/admin/getDirectionPage",
            "getAllDirections" :nodeApiBaseUrl + "/admin/getAllDirections",
            "addNewDirection":nodeApiBaseUrl + "/admin/addNewDirection",
            "deleteDirection":nodeApiBaseUrl + "/admin/deleteDirection",
            "updateDirection":nodeApiBaseUrl + "/admin/updateDirection",
            "getNodesByDirection":nodeApiBaseUrl + "/admin/getNodesByDirectionHou",
            "addNode":nodeApiBaseUrl + "/admin/addNode",
            "addNodeDirection":nodeApiBaseUrl + "/admin/addNodeDirection",
            "addLinks":nodeApiBaseUrl + "/admin/addNodeToNode",
            "deleteLinks":nodeApiBaseUrl + "/admin/deleteNodeToNoe",
            "getNodesPage":nodeApiBaseUrl + "/admin/getNodesPage",
            "getAllNodes":nodeApiBaseUrl +"/admin/getAllNodes",
            "updateNode":nodeApiBaseUrl + "/admin/updateNode",
            "deleteNode":nodeApiBaseUrl + "/admin/deleteNode",
            "deleteNodeDirection":nodeApiBaseUrl + "/admin/deleteNodeDirection",
            '1':url.apiUrl+'',//获取科室接口
            '0':url.apiUrl+'',
            '2':{
                '0':null,
                '2':null,
            }
    }
    
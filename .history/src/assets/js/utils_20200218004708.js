import axios from 'axios'
import qs from 'qs'
import router from '../../router'
import { Message } from 'element-ui'


//const host='http://39.107.86.181:8092/wms-rest/';
const host = 'http://localhost:8087/gy-rest/';
const httpBaseUrl = "http://localhost:8087/";
const PIC_URL_PRE = 'F:/usr/local/static/imgs';

export default {
  request: {


    //资源接口前端调用
  httpExecute(data, url, callback) {
    console.log("==========地址为url:" + url);
    let params = {};
    params = {
        'loginChannel': 'pc',
        'token': localStorage.getItem('token'),
        'sign': 'qazwsxedc'
    }
    if (data != null && data != '') {
        for (var key in data) {
            params[key] = data[key];
        }
    }
    url = httpBaseUrl + url;
    console.log("==========地址为url2:" + url);
    axios.post(url, JSON.stringify(params), { headers: { 'Content-Type': 'text/plain' } })
        .then(rsp => {

            if (rsp.data.code == "4000") {
                Message.error({ //弹窗使用方法
                    showClose: true,
                    duration: 2000, //警告的消息3秒钟后消失
                    message: "登录失效，请重新登录",
                });


                setTimeout(function() {
                    localStorage.removeItem('token');
                    router.push("/login");
                }, 3000);

            } else {
                callback(rsp.data);
                console.log("******"+rsp.data)
            }


        }).catch(error => {
            var data = {};
            data.code = '9999';
            data.msg = error.message;
            callback(data);
        });
},
//查询接口
httpUtils: function(data, callback) {
  this.httpExecute(data, data.url, callback);
},

    requestUrl(data, url, callback) {
      var params = {};
      params = {
        'loginChannel': 'pc',
        'token': localStorage.getItem('token'),
        'sign': 'qazwsxedc'
      }
      if (data != null && data != '') {
        for (var key in data) {
          if (data[key] == null || data[key] == undefined || (jQuery.type(data[key]) === "string" && data[key] == "")) {

          } else {
            params[key] = data[key];
          }

        }
      }

      url = host + url;
      axios.post(url, qs.stringify(params)).then(rsp => {


        if (rsp.data.code == "4000") {
          Message.error({//弹窗使用方法
            showClose: true,
            duration: 2000,  //警告的消息3秒钟后消失
            message: "登录失效，请重新登录",
          });


          setTimeout(function () {
            localStorage.removeItem('token');
            router.push("/login");
          }, 3000);

        } else {
          callback(rsp.data);
        }


      }).catch(error => {
        var data = {};
        data.code = '9999';
        data.msg = error.message;
        callback(data);
      });
    },

    getVtoken(data, callback) {
      this.requestUrl(data, 'suser/getVtoken', callback);
    },
    //登录信息
    login(data, callback) {
      this.requestUrl(data, 'suser/login', callback)
    },
    findDeptTree(data, callback) {
      this.requestUrl(data, 'menu/findDeptTree', callback)
    },
    selectDeptTree(data, callback) {
      this.requestUrl(data, 'menu/selectDeptTree', callback)
    },
    findNavTree(data, callback) {
      this.requestUrl(data, 'menu/findNavTree', callback)
    },
    findPermissions(data, callback) {
      this.requestUrl(data, 'menu/findPermissions', callback)
    },
    editUser(data, callback) {
      this.requestUrl(data, 'menu/editUser', callback)
    },
    queryUserList: function (data, callback) { // 通用 查询列表
      this.requestUrl(data, 'cmn/queryList', callback);
    },
    queryUserPage: function (data, callback) { // 通用 查询列表
      this.requestUrl(data, 'cmn/queryPages', callback);
    },
    queryForPage: function (data, callback) { // 通用 查询列表
      this.requestUrl(data, 'cmn/queryForPage', callback);
    },
    queryUserInfo: function (data, callback) { // 通用 获取单个对象信息
      this.requestUrl(data, 'cmn/queryInfoRole', callback);
    },
    queryUserInfos: function (data, callback) { // 通用 获取单个对象信息
      this.requestUrl(data, 'cmn/queryInfoRole', callback);
    },

    deleteUserInfo: function (data, callback) { // 通用 删除信息
      this.requestUrl(data, 'cmn/deleteInfo', callback);
    },

    deleteSysCache: function (data, callback) { // 通用 清除参数配置缓存
      this.requestUrl(data, 'cmn/deleteSysCache', callback);
    },

    batchDeleteInfo: function (data, callback) { // 通用 批量删除信息
      this.requestUrl(data, 'cmn/batchDeleteInfo', callback);
    },

    editUserInfo: function (data, callback) { // 通用  编辑信息
      this.requestUrl(data, 'cmn/editInfo', callback);
    },
    editInfo: function (data, callback) { // 通用  状态修改
      this.requestUrl(data, 'cmn/editInfo', callback);
    },
    editGoodsLocationInfo: function (data, callback) { // 货位 新增和修改
      this.requestUrl(data, 'goodsLocation/editInfo', callback);
    },
    saveBuyOrder: function (data, callback) {
      this.requestUrl(data, 'instock/saveBuyOrder', callback);
    },
    intoStoreBuySku: function (data, callback) {
      this.requestUrl(data, 'instock/intoStoreBuySku', callback);
    },
    saveStoreSku: function (data, callback) {
      this.requestUrl(data, 'instock/saveStoreSku', callback);
    },
    queryOrderBuySku: function (data, callback) {
      this.requestUrl(data, 'instock/queryOrderBuySku', callback);
    },
    batchIntoStoreBuySku: function (data, callback) {
      this.requestUrl(data, 'instock/batchIntoStoreBuySku', callback);
    },
    deleteOrderBuySkuDriver: function (data, callback) {
      this.requestUrl(data, 'instock/deleteOrderBuySkuDriver', callback);
    },
    printQualityCard: function (data, callback) {
      this.requestUrl(data, 'quality/printQualityCard', callback);
    },
    doQualityProduct: function (data, callback) {
      this.requestUrl(data, 'quality/doQualityProduct', callback);
    },
    saveSaleOrder: function (data, callback) {
      this.requestUrl(data, 'sale/saveSaleOrder', callback);
    },
    doOrderCheck: function (data, callback) {  //订单状态审核
      this.requestUrl(data, 'instock/doOrderCheck', callback);
    },
    findMenuTree: function (data, callback) {  //角色菜单查询
      this.requestUrl(data, 'menus/findMenuTree', callback);
    },

    deleteRoleByRoleId: function (data, callback) {  //删除角色
      this.requestUrl(data, 'role/deleteRoleByRoleId', callback);
    },
    saveRoleMenus: function (data, callback) {  //角色菜单新增
      this.requestUrl(data, 'role/saveRoleMenus', callback);
    },
    upSkuStatus: function (data, callback) {  //修改状态
      this.requestUrl(data, 'instock/upSkuStatus', callback);
    },
    saveSaleOutOrder: function (data, callback) {  //出库单新增
      this.requestUrl(data, 'sale/saveSaleOutOrder', callback);
    },
    saveSaleDistribution: function (data, callback) {  //出库单新增
      this.requestUrl(data, 'sale/saveSaleDistribution', callback);
    },
    saveRoleMenus: function (data, callback) {  //角色菜单保存
      this.requestUrl(data, 'role/saveRoleMenus', callback);
    },
    editUserReturnInfo: function (data, callback) {  //退货单保存
      this.requestUrl(data, 'return/editUserReturnInfo', callback);
    },
    queryReturnOrderBuySku: function (data, callback) {  //退货单产品查询
      this.requestUrl(data, 'buySale/queryReturnOrderBuySku', callback);
    },
    deleteOutOrderInfo: function (data, callback) {  //出库下单删除
      this.requestUrl(data, 'sale/deleteOutOrderInfo', callback);
    },
    sendMessage: function (data, callback) {  //发送邮件
      this.requestUrl(data, 'stockinfo/sendMessage', callback);
    },
    deleteSkuStore: function (data, callback) {  //删除过期库存
      this.requestUrl(data, 'stockinfo/deleteSkuStore', callback);
    },
    deleteReturnInfo: function (data, callback) {  //删除退货单和关联信息
      this.requestUrl(data, 'return/deleteReturnInfo', callback);
    },
    countStoreSku: function (data, callback) {  //统计产品库存
      this.requestUrl(data, 'echarts/countStoreSku', callback);
    },
    countOrderInStore: function (data, callback) {  //统计入库产品
      this.requestUrl(data, 'echarts/countOrderInStore', callback);
    },
    countOrderOutStore: function (data, callback) {  //统计出库产品
      this.requestUrl(data, 'echarts/countOrderOutStore', callback);
    },
    commonCount: function (data, callback) {  //统计
      this.requestUrl(data, 'echarts/commonCount', callback);
    },
    editRole: function (data, callback) {  //修改角色
      this.requestUrl(data, 'menu/editRole', callback);
    },
    doAudits: function (data, callback) {  //审核
      this.requestUrl(data, 'guest/doAudits', callback);
    },
    editCustomerInfo: function (data, callback) { // 顾客  编辑信息
      this.requestUrl(data, 'guest/editInfo', callback);
    },
    editLocationInfo: function (data, callback) { //   编辑信息
      this.requestUrl(data, 'return/saveLocationTransfer', callback);
    },
    editNotorderoutInfo: function (data, callback) { //   编辑信息
      this.requestUrl(data, 'return/saveNotorderout', callback);
    },
    updateUserInfo: function (data, callback) { //   编辑信息
      this.requestUrl(data, 'suser/updateUserInfo', callback);
    },
    getWordInfo: function (data, callback) { //获取敏感词信息
      this.requestUrl(data, 'word/getInfo', callback);
    },
    saveWordInfo:function (data,callback) {//保存或修改敏感词
      this.requestUrl(data,'word/saveInfo',callback);
    },
    saveAdvertInfo:function (data,callback) {//保存或修改广告位
      this.requestUrl(data,'advert/saveInfo',callback);
    },
    getAdvertInfo:function (data,callback) {//保存或修改广告位
      this.requestUrl(data,'advert/getInfo',callback);
    },
    getTypeList:function(data,callback){//咨询分类类型初始化 单独查询
      this.requestUrl(data,'news/getTypeList',callback);

    },
    saveCateGory:function(data,callback){//新增咨询分类
      this.requestUrl(data,'news/saveCateGory',callback);
    },
    queryCategoryList:function(data,callback){//分类列表初始化
      this.requestUrl(data,'news/queryCategoryList',callback);
    },
    delCategory:function(data,callback){//删除咨询分类
      this.requestUrl(data,'news/delCategory',callback);
    },
    changeCateGoryStatus:function(data,callback){//禁用启用分类
      this.requestUrl(data,'news/changeCateGoryStatus',callback);
    },
    saveChildrenCategory:function(data,callback){//新增子类
      this.requestUrl(data,'news/saveChildrenCategory',callback);
    },
    updateAdvertSourceSort:function (data,callback) {//广告素材排序
      this.requestUrl(data,'advertSource/updateSort',callback);
    },
    saveAdvertSourceInfo:function (data,callback) {//保存或修改广告素材
      this.requestUrl(data,'advertSource/saveInfo',callback);
    },
    getAdvertSourceInfo:function (data,callback) {//保存或修改广告位
      this.requestUrl(data,'advertSource/getInfo',callback);
    },

    getCategoryList:function(data,callback){//查询所以一级分类
      this.requestUrl(data,'queryArticle/queryCategoryList',callback);
    },
   


    checkPhoneSystem() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        //这个是安卓操作系统
        return 'android'
      } else if (isIOS) {
        //这个是ios操作系统
        return 'ios'
      }
    }
  },
  dateTransion(date, type = 0) {
    let addZero = (p) => {
      if (p < 10) {
        return "0" + p
      } else {
        return p
      }
    }
    let y = date.getFullYear()
    let m = addZero(date.getMonth() + 1)
    let d = addZero(date.getDate())
    let time;
    if (type == 0) {
      time = `${y}年${m}月${d}日`
    } else if (type == 1) {
      time = `${y}-${m}-${d}`
    } else if (type == 2) {
      time = `${y}年${m}月`
    }
    return time;
  },
  defaultHead(event) {
    event.target.src = '/static/images/defaultHead.jpg'
  },
  getRequestParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  getHost() {
    return host;
  },
  getUpLoadHost() {
    return host + "cmn/imgUpload";
  },

  isNull(data) {
    if (data == undefined || data == null) {
      return true;
    }
    if (jQuery.type(data) === "string" && data == "") {
      return true;
    }

    return false;
  },

  getPicture(data) {

    if (this.isNull(PIC_URL_PRE)) {
      return data;
    }

    return PIC_URL_PRE + "/" + data;

  },


  


}

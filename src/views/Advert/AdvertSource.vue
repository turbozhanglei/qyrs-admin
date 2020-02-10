<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-form-item prop="name" label="广告名称">
          <el-input v-model="filters.name" placeholder="广告位编号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="pageType" label="素材类型">
          <el-select v-model="filters.type" placeholder="素材类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="文字" value="0"></el-option>
            <el-option label="图片" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告有限期" prop="startDate">
          <el-date-picker
            v-model="filters.startDate"
            type="date"
            placeholder="开始时间" >
          </el-date-picker>
          至
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker
            v-model="filters.endDate"
            type="date"
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>

        <el-row>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              perms="sys:user:view"
              type="primary"
              @click="$refs.CyTable.findPageBeforeRestPages(filters)"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              :label="$t('action.add')"
              perms="sys:user:add"
              type="primary"
              @click="handleAdd"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="reset"
            />
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="生效中" name="0"></el-tab-pane>
          <el-tab-pane label="待生效" name="1"></el-tab-pane>
          <el-tab-pane label="已过期" name="2"></el-tab-pane>
        </el-tabs>
        <!--表格内容栏-->
        <el-table
          :data="pageResult"
          style="width: 100%"
          :stripe="stripe"
          :max-height="countHeight(maxHeight)"
          :size="size"
          align="left"
          :header-cell-style="{ 'color': '#FFF','background-color': 'rgb(20, 136, 154)'}">
          <el-table-column
            label="广告标识"
            width="100"
            align="center"
            prop="id">
          </el-table-column>
          <el-table-column
            label="广告名称"
            width="100"
            align="center"
            prop="name">
          </el-table-column>
          <el-table-column
            label="广告类型"
            width="100"
            align="center"
            prop="type"
            :formatter="typeFormat">
          </el-table-column>
          <el-table-column
            label="广告内容"
            width="100"
            align="center">
            <template slot-scope="scope" >
              <el-image v-if="scope.row.type==1" :src="scope.row.imageUrl"></el-image>
              <span v-if="scope.row.type==0">{{scope.row.content}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="广告有效期"
            width="280"
            align="center"
            prop="validDate">
          </el-table-column>
          <el-table-column
            label="显示顺序"
            width="160"
            align="center"
            prop="sort">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" v-if="scope.$index != 0">上移</el-button>
              <el-button size="mini" type="primary" v-if="pageResult && pageResult.length > 0 && scope.$index != pageResult.length -1">下移</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="info"
                @click="handleDetail(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleEdit(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!--分页栏-->
      <div class="toolbar" style="padding:10px;">
        <el-pagination
          layout="total, prev, pager, next, jumper,sizes"
          @current-change="refreshPageRequest"
          :current-page="pageRequest.pageNum"
          :page-size="pageRequest.pageSize"
          :total="totalSize"
          style="float:right;"
          :page-sizes="[5,10, 20, 30, 40]"
          @size-change="handleSizeChange"
        ></el-pagination>
    </div>



    </div>
  </div>
</template>

<script>
  import PopupTreeInput from "@/components/PopupTreeInput";
  import KtButton from "@/views/Core/KtButton";
  import ElRow from "element-ui/packages/row/src/row";
  export default {
    components: {
      ElRow,
      PopupTreeInput,
      KtButton,
    },
    data() {
      return {
        size: "small",
        labelPosition: 'left',
        stripe:true,
        maxHeight: 900,
        filters: {
          name:"",//广告名称
          type:"",//素材类型
          startDate:"",//有效期开始时间
          endDate:"",//有效期结束时间
        },
        columns: [],
        filterColumns: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: [],
        totalSize:0,
        options: [],
        activeName:"0",//tab默认选中生效中 0
      };
    },
    methods: {
      // 获取分页数据
      findPage: function(data) {
        this.pageResult=[
          {id:1,name:'乙二醇',type:1,content:'',imageUrl:"https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",validDate:"2016-06-30 00:00:00--2016-06-30 23:59:59",sort:0},
          {id:2,name:'PTA',type:0,content:'AD_TOP_INDEX',imageUrl:"",validDate:"2016-06-30 00:00:00--2016-06-30 23:59:59",sort:1},
          {id:3,name:'成品油',type:1,content:'',imageUrl:"https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",validDate:"2016-06-30 00:00:00--2016-06-30 23:59:59",sort:2},
          {id:4,name:'PVC',type:0,content:'AD_TOP_INDEX',imageUrl:"",validDate:"2016-06-30 00:00:00--2016-06-30 23:59:59",sort:3},
          {id:5,name:'甲醇',type:1,content:'',imageUrl:"https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",validDate:"2016-06-30 00:00:00--2016-06-30 23:59:59",sort:4},
          {id:6,name:'其他',type:0,content:'AD_TOP_INDEX',imageUrl:"",validDate:"2016-06-30 00:00:00--2016-06-30 23:59:59",sort:5},
        ];
        this.totalSize=6;
        //this.$refs.CyTable.findPage({ content: pageResult, total: 6 });
      },
      //新增
      handleAdd:function () {
        this.$router.push({path:"/advert/advertSourceAdd"});
      },
      // 显示编辑界面
      handleEdit: function(index,row) {
        this.$router.push({path:"/advert/advertSourceAdd",query:{adSourceId:row.id}});
      },
      //查看
      handleDetail:function (index,row) {
        this.$router.push({path:"/advert/advertSourceAdd",query:{adSourceId:row.id,isEdit:1}});
      },
      // 类型格式化
      typeFormat: function(row, column, cellValue, index) {
        if (Number(cellValue) == 0) {
          return "文本";
        }
        return "图片";
      },


      reset: function() {
        this.$refs["filters"].resetFields();
        this.$refs.CyTable.resetForm();
        this.findPage();
      },
      handleClick(tab, event) {
        console.log(tab.name, event);
      },
      countHeight(height) {
        var winHeight =
          document.body.clientHeight || document.documentElement.clientHeight;
        if (height > winHeight * 0.7) {
          height = winHeight * 0.7;
        }
        return height;
      },
      // 换页刷新
      refreshPageRequest: function(pageNum) {
        this.pageRequest.pageNum = pageNum;
        this.findPage();
      },
      // 换页刷新
      handleSizeChange: function(pageSize) {
        this.pageRequest.pageSize = pageSize;
        this.pageRequest.pageNum = 1;
        this.findPage();
      },
    },
    mounted() {
      this.findPage();
    }
  };
</script>

<style scoped>
</style>

<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" :label-position="labelPosition">
        <el-form-item prop="name" label="广告名称">
          <el-input v-model="filters.name" placeholder="广告名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="type" label="素材类型">
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
            placeholder="开始时间"
            value-format="yyyy-MM-dd"
            :picker-options="startDateDisabled"
            @change="changeStartDate">
          </el-date-picker>
          至
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker
            v-model="filters.endDate"
            type="date"
            placeholder="结束时间"
            value-format="yyyy-MM-dd"
            :picker-options="endDateDisabled"
            @change="changeendDate">
          </el-date-picker>
        </el-form-item>

        <el-row>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="findPage(filters)"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              :label="$t('action.add')"
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
              <el-image v-if="scope.row.type==1" :src="scope.row.image_url"></el-image>
              <span v-if="scope.row.type==0">{{scope.row.content}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="广告有效期"
            width="280"
            align="center"
            prop="validDate">
            <template slot-scope="scope">
              <span>{{scope.row.start_date}}--{{scope.row.end_date}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="显示顺序"
            width="160"
            align="center"
            prop="sort">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleUpdateSort(0,scope.row,scope.$index)" :disabled="(pageResult && pageResult.length > 0 && pageResult.length ==1) || scope.$index == 0">上移</el-button>
              <el-button size="mini" type="primary" @click="handleUpdateSort(1,scope.row,scope.$index)" :disabled="(pageResult && pageResult.length > 0 && pageResult.length ==1) || (scope.$index == pageResult.length -1)">下移</el-button>
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
                @click="handleDelete(scope.row)">删除</el-button>
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
          t:"adSource",
          name:"",//广告名称
          type:"",//素材类型
          startDate:"",//有效期开始时间
          endDate:"",//有效期结束时间
          status:"0",

        },
        columns: [],
        filterColumns: [],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: [],
        totalSize:0,
        options: [],
        activeName:"0",//tab默认选中生效中 0
        adId:this.$route.params.id,//广告codeid
        startDateDisabled:{},
        endDateDisabled:{},
      };
    },
    methods: {
      changeStartDate:function () {
        var this_= this;
        this_.endDateDisabled = {
          disabledDate: (time)=> {
            if (this_.filters.startDate){
              return time.getTime() < new Date(this_.filters.startDate).getTime();
            }
          },
        };
      },
      changeendDate:function () {
        var this_= this;
        this_.startDateDisabled = {
          disabledDate: (time)=> {
            if (this_.filters.endDate){
              return time.getTime() > new Date(this_.filters.endDate).getTime();
            }
          },
        };
      },
      // 获取分页数据
      findPage: function(filters) {
        var this_ = this;
        if (filters == undefined || filters == null) {
          filters = {};
        }
        if (this_.adId){
          filters.adCodeId = this_.adId;
        }
        filters.start = this.pageRequest.pageNum;
        filters.limit = this.pageRequest.pageSize;
        this.utils.request.queryUserPage(filters, function(res) {
          if (res && res.code == '0000' && res.rows) {
            this_.pageResult = res.rows;
            this_.totalSize = Number(res.total);
          }else {
            this_.pageResult = [];
            this_.totalSize = 0;
          }
        });
      },
      //新增
      handleAdd:function () {
        this.$router.push({path:"/advert/advertSourceAdd/" + this.adId + '/0/0'});
      },
      // 显示编辑界面
      handleEdit: function(index,row) {
        this.$router.push({path:"/advert/advertSourceAdd/" + this.adId + '/' + row.id + '/0'});
      },
      //查看
      handleDetail:function (index,row) {
        this.$router.push({path:"/advert/advertSourceAdd/" + this.adId + '/' + row.id + '/1'});
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
        this.findPage(this.filters);
      },
      //切换状态tab 0：生效中 1：待生效 2：已过期
      handleClick(tab) {
        this.filters.status = tab.name;
        this.findPage(this.filters)
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
        this.findPage(this.filters);
      },
      // 换页刷新
      handleSizeChange: function(pageSize) {
        this.pageRequest.pageSize = pageSize;
        this.pageRequest.pageNum = 1;
        this.findPage(this.filters);
      },
      //删除
      handleDelete:function (row) {
        this.$confirm("确认该条记录吗？", "提示", {
          type: "warning"
        }).then(()=>{
          let params = {
            id:row.id,
            deleteFlag:'1',
          };
          var this_ = this;
          this.utils.request.saveAdvertSourceInfo(params,function (res) {
            if (res && res.code == '0000'){
              this_.$message({ message: "删除成功!", type: "success" });
              this_.findPage(this_.filters)
            }else {
              this_.$message.error(res.msg || '删除失败!');
            }
          });
        })
      },
      //排序,type：0 上移 1 下移
      handleUpdateSort:function (type,row,index) {
        var oldSort = row.sort,oldId = row.id;
        var newSort = '',newId = '';
        if (type == 0){
          newId =  this.pageResult[index-1].id;
          newSort = this.pageResult[index-1].sort;
        }else {
          newId =  this.pageResult[index+1].id;
          newSort = this.pageResult[index+1].sort;
        }
        var this_ = this,
          params = {
            oldSort:oldSort,
            oldId:oldId,
            newSort:newSort,
            newId:newId
          };
        console.log(params);
        this.utils.request.updateAdvertSourceSort(params,function (res) {
          if (res && res.code == '0000'){
            //this_.$message({ message: "删除成功!", type: "success" });
            this_.findPage(this_.filters)
          }else {
            this_.$message.error(res.msg || '删除失败!');
          }
        });
      },
    },

    mounted() {
      this.findPage(this.filters);
    }
  };
</script>

<style scoped>
</style>

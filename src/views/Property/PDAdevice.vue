<style>
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
	font-size: 18px;
	align: "center";
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
		<el-form :inline="true" :model="filters" :size="size">
			<el-row style="text-align: left;">
				<el-form-item>
				<el-input v-model="filters.code" placeholder="PDA设备编码"></el-input>
				</el-form-item>
				<el-form-item>
				<el-input v-model="filters.name" placeholder="PDA设备名称"></el-input>
				</el-form-item>
				<el-form-item>
				<el-input v-model="filters.modal" placeholder="PDA设备型号"></el-input>
				</el-form-item>
				
				<el-form-item>
					<el-select v-model="filters.storage_warehouse" style="width: 192px;" placeholder="存放仓库">  
					<el-option label="顺义库" value="顺义库"></el-option>
					<el-option label="顺义八喜库" value="顺义八喜库"></el-option>
					<el-option label="通州库" value="通州库"></el-option>
					<el-option label="通州库" value="顺义库"></el-option>
					</el-select>
					<!-- <el-input v-model="filters.name" placeholder="仓库名称"></el-input> -->
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.storage_area" style="width: 192px;" placeholder="存放区域">  
					<el-option label="自有库" value="自有库"></el-option>
					<el-option label="委外库" value="委外库"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.manager" placeholder="直接管理人"></el-input>
				</el-form-item>
			</el-row>
			<el-row style="text-align: left;">
				<el-form-item>
				<!-- <el-input v-model="filters.dept" placeholder="部门"></el-input> -->
				<el-select v-model="filters.dept" style="width: 192px;" placeholder="主管部门">
					<el-option label="仓储管理部" value="仓储管理部"></el-option>
					<el-option label="运营一部" value="运营一部"></el-option>
					<el-option label="运营二部" value="运营二部"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item>
					<el-input v-model="filters.phone" placeholder="联系电话"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" style="width: 192px;" placeholder="状态">
					<el-option label="在用" value="在用"></el-option>
					<el-option label="闲置" value="闲置"></el-option>			     
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.equipment_nature" placeholder="设备性质"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.remark" placeholder="备注"></el-input>
				</el-form-item>
			</el-row>
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="$refs.CyTable.findPageBeforeRestPages(filters)"/>
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:user:add" type="primary" @click="handleAdd" />
			</el-form-item>
			<el-form-item>
					<kt-button icon="fa fa-plus" :label="$t('action.import')" perms="sys:user:add" type="primary" @click="handleAdd" />
			</el-form-item>
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.print')" perms="sys:user:print" type="primary" @click="print" />
			</el-form-item>
				<el-form-item>
				<kt-button :label="$t('action.reset')"  perms="
				basics:warehouseinformation:reset"   type="primary" @click="resetSelection" />
			</el-form-item>
		</el-form>
	</div>
	<div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
		<el-form :inline="true" :size="size">
			<el-form-item>
				<el-button-group>
				<el-tooltip content="刷新" placement="top">
					<el-button icon="fa fa-refresh" @click="$refs.CyTable.findPageBeforeRestPages(filters)"></el-button>
				</el-tooltip>
				<el-tooltip content="列显示" placement="top">
					<el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
				</el-tooltip>
				<!-- <el-tooltip content="导出" placement="top">
					<el-button icon="fa fa-file-excel-o"></el-button>
				</el-tooltip> -->
				</el-button-group>
			</el-form-item>
		</el-form>
		<!--表格显示列界面-->
		<table-column-filter-dialog ref="tableColumnFilterDialog" :columns="columns" 
			@handleFilterColumns="handleFilterColumns"> 
		</table-column-filter-dialog>
	</div>
	<!--表格内容栏-->
	<kt-table :volume="350" permsEdit="sys:user:edit" permsDelete="sys:user:delete"
		:data="pageResult" :columns="filterColumns"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right" inline="">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			 <el-row :gutter="20">
				<el-col :span="24">
					<div class="grid-content bg-purple" style="margin-top: -70px;text-align:center" >WMS系统PDA管理页面</div>
				</el-col>
			</el-row>
			<el-form-item label="PDA设备编码" prop="code">
				<el-input v-model="dataForm.code" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="PDA设备名称" prop="name">
				<el-input v-model="dataForm.name"  auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="PDA设备型号" prop="model">
				<el-input v-model="dataForm.model"  auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="存放区域" prop="storage_area">
				<el-input v-model="dataForm.storage_area"  auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="存放仓库" prop="storage_warehouse">
			 <el-select v-model="dataForm.storage_warehouse" style="width: 100%" >    
			 	<el-option label="请选择" value=""></el-option>
			      <el-option label="自有库" value="自有库"></el-option>
			      <el-option label="委外库" value="委外库"></el-option>
			    </el-select>
			</el-form-item>
			<el-form-item label="设备照片" prop="photo">
				<el-input v-model="dataForm.photo"  auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="直接管理人" prop="manager">
				<el-input v-model="dataForm.manager"  auto-complete="off"></el-input>
			</el-form-item>
		
			<el-form-item label="主管部门" prop="dept">
				<el-input v-model="dataForm.dept"  auto-complete="off"></el-input>
			</el-form-item>
		    <el-form-item label="设备性质" prop="equipment_nature">
				<el-input v-model="dataForm.equipment_nature"  auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="联系电话(手机)" prop="phone">
				<el-input v-model="dataForm.phone" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-input v-model="dataForm.status" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="dataForm.remark" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>

	<!--打印界面-->
	<el-dialog :title="operation?'打印预览':'打印'" width="35%" :visible.sync="printPage" :close-on-click-modal="false">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-tag style="margin-left: 33%;">北京东晓腾飞供应链管理有限公司PDA设备标识卡</el-tag>
			<el-row>
				<el-col :span="12">
				<div class="demo-image__placeholder">
					<div class="block">
						<el-image :src="src" style="margin-left: 0%;width: 200px;"></el-image>
					</div>
			    </div>
				</el-col>
				<el-col :span="12">
					<el-form-item label="监控设备编码:" style="margin-left: -6%;margin-top: 25%;">
					  <span>0234612352365</span>
				   </el-form-item>	
				</el-col>
				<el-col :span="12">
					<el-form-item label="直接管理人:">
					  <span>李四</span>
				    </el-form-item>	
				</el-col>	
			</el-row>
			</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="printPage = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.comfirm')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
export default {
	components:{
		PopupTreeInput,
		KtTable,
		KtButton,
		TableColumnFilterDialog
	},
	data() {
		return {
			size: 'small',
			filters: {
				name: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			printPage: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入仓库名称', trigger: 'blur' }
				],
				code: [
					{ required: true, message: '请输入仓库编码', trigger: 'blur' }
				],
				property: [
					{ required: true, message: '请仓库属性', trigger: 'blur' }
				]
				
			},

		
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				name: '',
				password: '123456',
				deptId: 1,
				deptName: '',
				email: 'test@qq.com',
				phone: '13889700023',
				status: 1,
				userRoles: []
			},
			deptData: [],
			deptTreeProps: {
				label: 'name',
				children: 'children'
			},
			roles: [],
			ruleForm: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: ''
				},
		   rules: {
			 name: [{ required: true, message: '请输入活动名称', trigger: 'blur' },{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
			 region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
				date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
				date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
				type: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
				resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
				desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }]
			},
		src: 'https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab'
				
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {
				code: {code:'code', value:this.filters.code}
			}
		 
			this.$api.user.findPage(this.pageRequest).then((res) => {
				this.pageResult = {content:testdata.content,
                                   pageNum: 1,
                                   pageSize: 10,
								   totalPages: 1,
								   totalSize: 4
				}
				this.findUserRoles()
			}).then(data!=null?data.callback:'')
		},
		// 加载用户角色信息
		findUserRoles: function () {
			this.$api.role.findAll().then((res) => {
				// 加载角色集合
				this.roles = res.data	
			})
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			// this.dataForm = {
			// 	id: 0,
			// 	name: '',
			// 	password: '',
			// 	deptId: 1,
			// 	deptName: '',
			// 	email: 'test@qq.com',
			// 	phone: '13889700023',
			// 	status: 1,
			// 	userRoles: []
			// }
		},
		print :function(){
			this.printPage=true
			this.operation=true
		},

	
		// 显示编辑界面
		handleEdit: function (params) {
			console.log(params)
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
			let userRoles = []
			for(let i=0,len=params.row.userRoles.length; i<len; i++) {
				userRoles.push(params.row.userRoles[i].roleId)
			}
			this.dataForm.userRoles = userRoles
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						let userRoles = []
						for(let i=0,len=params.userRoles.length; i<len; i++) {
							let userRole = {
								userId: params.id,
								roleId: params.userRoles[i]
							}
							userRoles.push(userRole)
						}
						params.userRoles = userRoles
						this.$api.user.save(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPage(null)
						})
					})
				}
			})
		},
		// 获取部门列表
		findDeptTree: function () {
			this.$api.dept.findDeptTree().then((res) => {
				this.deptData = res.data
				console.log(this.deptData )
			})
		},
		// 菜单树选中
      	deptTreeCurrentChangeHandle (data, node) {
        	this.dataForm.deptId = data.id
        	this.dataForm.deptName = data.name
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		// 处理表格列过滤显示
      	displayFilterColumnsDialog: function () {
			this.$refs.tableColumnFilterDialog.setDialogVisible(true)
      	},
		// 处理表格列过滤显示
      	handleFilterColumns: function (data) {
			this.filterColumns = data.filterColumns
			this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      	},
		// 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:50},
				{prop:"code", label:"PDA设备编码", minWidth:100},
				{prop:"name", label:"PDA设备名称", minWidth:120},
				{prop:"model", label:"PDA设备型号", minWidth:120},
				{prop:"storage_warehouse", label:"存放仓库", minWidth:120},
				{prop:"storage_area", label:"存放区域", minWidth:120},
				{prop:"photo", label:"设备照片", minWidth:120},
				{prop:"dept", label:"主管部门", minWidth:120},
				{prop:"manager", label:"直接管理人", minWidth:120},
				{prop:"phone", label:"联系电话(手机)", minWidth:120},
				{prop:"status", label:"状态", minWidth:120},
				{prop:"equipment_nature", label:"设备性质", minWidth:120},
				{prop:"remark", label:"备注", minWidth:120},
				// {prop:"lastUpdateBy", label:"更新人", minWidth:100},
				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	}
	},
	mounted() {
		this.findDeptTree()
		this.initColumns()
	}
}
	var testdata={
				content:[{id: "1",
						code: "DX--PDA-0001",
						name: "PDA一号",
						model:"cs0561",
						storage_warehouse:"顺义库",
						storage_area: "自有库",
						photo:"暂无1",
						dept:"仓储部",
						manager:"李四",
						phone:"130130898544",
						status:"在用",
						equipment_nature:"正常使用",
						remark:"暂无1",
						},
						{id: "2",
						code: "DX--PDA-0001",
						name: "PDA一号",
						model:"cs0561",
						storage_warehouse:"顺义库",
						storage_area: "自有库",
						photo:"暂无1",
						dept:"仓储部",
						manager:"李四",
						phone:"130130898544",
						status:"在用",
						equipment_nature:"正常使用",
						remark:"暂无1",
						},
						{id: "3",
						code: "DX--PDA-0001",
						name: "PDA一号",
						model:"cs0561",
						storage_warehouse:"顺义库",
						storage_area: "自有库",
						photo:"暂无1",
						dept:"仓储部",
						manager:"李四",
						phone:"130130898544",
						status:"在用",
						equipment_nature:"正常使用",
						remark:"暂无1",
						},
						{id: "4",
						code: "DX--PDA-0001",
						name: "PDA一号",
						model:"cs0561",
						storage_warehouse:"顺义库",
						storage_area: "自有库",
						photo:"暂无1",
						dept:"仓储部",
						manager:"李四",
						phone:"130130898544",
						status:"在用",
						equipment_nature:"正常使用",
						remark:"暂无1",
						}]

			       }
</script>

<style scoped>

</style>
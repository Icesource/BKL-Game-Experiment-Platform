<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="''"
                v-model="listQuery.username">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
<!--      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"-->
<!--                 icon="el-icon-edit">添加-->
<!--      </el-button>-->
<!--      <el-button class="filter-item" :loading="downloadLoading" style="margin-left: 20px;" type="info" icon="document"-->
<!--                 @click="handleDownload">Export Excel-->
<!--      </el-button>-->
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%;margin: 20px 0">
      <el-table-column align="center" :label="$t('app.id')" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" :label="$t('app.name')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" :label="$t('app.school')">
        <template slot-scope="scope">
          <span>{{scope.row.school}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" :label="$t('app.email')">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" :label="$t('app.phone')">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" :label="$t('app.lastActive')">
        <template slot-scope="scope">
          <span v-if="scope.row.lastTimeToGame==null">{{$t('app.noOperate')}}</span>
          <span v-else>{{scope.row.lastTimeToGame}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('app.operate')" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.row)">
            {{$t('app.viewRecentActions')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.currentPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="$t('app.recentActionsTitle')" :visible.sync="dialogFormVisible">
      <el-table
        :data="userOperateList"
        style="width: 100%">
        <el-table-column
          prop="id"
          :label="$t('app.id')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="gameName"
          :label="$t('app.gameName')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="strategy"
          :label="$t('app.strategy')"
          width="100">
        </el-table-column>
        <el-table-column
          prop="time"
          :label="$t('table.date')">
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, getUserOperate } from '@/api/users'
  import { Message, MessageBox } from 'element-ui'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'

  export default {
    name: 'complexTable',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        userOperateList:[],
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          currentPage: 0,
          pageSize: 20,
          username: undefined
        },
        temp: {
          id: undefined,
          username: '',
          password: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',

        dialogPvVisible: false,
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx'
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      strategyFilter(status){
        const statusMap = {
          0: this.$t('app.betray'),
          1: this.$t('app.cooperation')
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        // this.listQuery.role = 'user'
        fetchList(this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.currentPage = 0
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.currentPage = val
        this.getList()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          username: '',
          password: ''
        }
        this.checkedRoles = []
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleView(row) {
        this.resetTemp()
        const queryMessage = Message({
          message:'querying,pleasing wait',
          type:'info',
          duration:0
        })
        getUserOperate({'id':row.id}).then((response)=>{
          if(response.code===20000){
            this.userOperateList = response.data.content
            this.userOperateList.forEach((item)=>{
              if(item.strategy===0) item.strategy= this.$t('app.cooperation')
              else item.strategy = this.$t('app.betray')
            })
            // console.log(this.userOperateList)
            queryMessage.close()
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
          }
        })


      },

      // handleDelete(row) {
      //   var query = {
      //     'id': row.id
      //   }
      //   deleteUser(query).then(res => {
      //     this.$notify({
      //       title: '成功',
      //       message: '删除成功',
      //       type: 'success',
      //       duration: 2000
      //     })
      //     this.getList()
      //   })
      // },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      changeAvatar() {
        this.temp.avatarFile = this.$refs['avatarFile'].files[0]
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['编号', '用户名', '角色']
          const filterVal = ['id', 'username', 'roles']
          const list = this.list.filter(v => {
            return { 'id': v.id, 'username': v.username, 'roles': v.roles.join(',') }
          })
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.downloadLoading = false
        })
      }
    }
  }
</script>

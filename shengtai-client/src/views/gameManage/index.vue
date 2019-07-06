<template>
  <div class="app-container">
    <div class="filter-container">
      <!--      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'输入内容按回车查找'"-->
      <!--                v-model="listQuery.username">-->
      <!--      </el-input>-->
      <!--      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>-->
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary"
                 icon="el-icon-edit">{{$t('table.add')}}
      </el-button>
      <!--      <el-button class="filter-item" :loading="downloadLoading" style="margin-left: 20px;" type="info" icon="document"-->
      <!--                 @click="handleDownload">Export Excel-->
      <!--      </el-button>-->
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row
              style="width: 100%;margin: 10px 0">
      <el-table-column width="60" align="center" :label="$t('app.id')">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" :label="$t('app.gameName')">
        <template slot-scope="scope">
          <span>{{scope.row.gameName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" :label="'N'">
        <template slot-scope="scope">
          <span>{{scope.row.N}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" :label="'T'">
        <template slot-scope="scope">
          <span>{{scope.row.T}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" :label="'K'">
        <template slot-scope="scope">
          <span>{{scope.row.K}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" :label="'t'">
        <template slot-scope="scope">
          <span>{{scope.row.t}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" :label="'o'">
        <template slot-scope="scope">
          <span>{{scope.row.o}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" :label="'ec'">
        <template slot-scope="scope">
          <span>{{scope.row.ec}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" :label="'ed'">
        <template slot-scope="scope">
          <span>{{scope.row.ed}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" :label="'x0'">
        <template slot-scope="scope">
          <span>{{scope.row.x0}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60" align="center" :label="'R0'">
        <template slot-scope="scope">
          <span>{{scope.row.R0}}</span>
        </template>
      </el-table-column>

      <el-table-column width="60" align="center" :label="'X'">
        <template slot-scope="scope">
          <span>{{scope.row.X}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="60" align="center" :label="'R'">
        <template slot-scope="scope">
          <span>{{scope.row.R}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" :label="'status'">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusStyleFilter">
            {{ row.status | statusContentFilter }}
          </el-tag>
        </template>
      </el-table-column>


      <!--      <el-table-column min-width="150px" :label="'权限'">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tag v-for="item in scope.row.roles" :key="item.id">{{item}}</el-tag>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column align="center" :label="$t('table.actions')" min-width="300"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            {{$t('table.edit')}}
          </el-button>
          <el-button type="info" size="mini" @click="handleReset(scope.row)">
            {{$t('app.reset')}}
          </el-button>
          <el-button v-if="scope.row.status==0" type="success" size="mini" @click="handleChangeStatus(scope.row)">
            {{$t('app.Enable')}}
          </el-button>
          <el-button v-if="scope.row.status==1" type="danger" size="mini" @click="handleChangeStatus(scope.row)">
            {{$t('app.Disable')}}
          </el-button>
          <el-button type="info" size="mini" @click="handleToCsv(scope.row)">
            {{$t('table.export')}}
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item v-if="dialogStatus==='update'" :label="$t('app.id')" prop="id">
          <el-input v-model="temp.id" :disabled="true"></el-input>
        </el-form-item>

        <el-row>
          <el-col>
            <el-form-item :label="$t('app.gameName')" prop="name">
              <el-input v-model="temp.gameName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label-width="20px" :label="'N'" prop="name">
              <el-input v-model="temp.N"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="20px" :label="'T'" prop="name">
              <el-input v-model="temp.T"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="20px" :label="'K'" prop="name">
              <el-input v-model="temp.K"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label-width="20px" :label="'x0'" prop="name">
              <el-input v-model="temp.x0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="20px" :label="'R0'" prop="name">
              <el-input v-model="temp.R0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="20px" :label="'ec'" prop="name">
              <el-input v-model="temp.ec"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label-width="20px" :label="'ed'" prop="name">
            <el-input v-model="temp.ed"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="20px" :label="'o'" prop="name">
            <el-input v-model="temp.o"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="20px" :label="'t'" prop="name">
            <el-input v-model="temp.t"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

        <el-row>
            <el-form-item label-width="60px" :label="'game type'" prop="name">
              <el-radio-group v-model="temp.gameType">
                <el-radio :label="1">type 1</el-radio>
                <el-radio :label="2">type 2</el-radio>
                <el-radio :label="3">type 3</el-radio>
                <el-radio :label="4">type 4</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchList, createGame, updateGame, resetGame, changeGameStatus } from '@/api/games'
  import { Message, MessageBox } from 'element-ui'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import { exportCsv } from '../../api/games'
  import { getToken } from '../../utils/auth'

  export default {
    name: 'complexTable',
    directives: {
      waves
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          currentPage: 0,
          pageSize: 20,
          username: undefined
        },
        temp: {
          gameName: '',
          N: 500 /* 网络规模 */,
          T: 2, /* 增长率 */
          K: 1,
          x0: 0.1,
          R0: 0.3,
          ec: 0.3,
          ed: 0.3,
          o: 0.5,
          t: 10
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('app.updateGame'),
          create: this.$t('app.createGame')
        },
        dialogPvVisible: false,
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx'
      }
    },
    filters: {
      statusContentFilter(status) {
        const statusMap = {
          0: 'Disabled',
          1: 'Enabled'
        }
        return statusMap[status]
      },
      statusStyleFilter(status) {
        const statusMap = {
          0: 'danger',
          1: 'success'
        }
        return statusMap[status]
      }
    },
    created() {
      this.recursiveGetList()
    },
    methods: {
      getList() {
        fetchList(this.listQuery).then(response => {
          if (response.code === 20000) {
            this.list = response.data.content
            this.total = response.data.totalElements
          }
        })
      },
      recursiveGetList() {
        // this.listLoading = true
        // this.listQuery.role = 'user'
        fetchList(this.listQuery).then(response => {
          if (response.code === 20000) {
            this.list = response.data.content
            this.total = response.data.totalElements

            setTimeout(() => {
              this.recursiveGetList()
            }, 15000)

            this.listLoading = false
          } else {
            Message({
              message: this.$t('message.' + response.message),
              type: 'error',
              duration: 5 * 1000
            })
          }
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
          gameName: '',
          N: 500 /* 网络规模 */,
          T: 2, /* 增长率 */
          K: 1,
          x0: 0.1,
          R0: 0.3,
          ec: 0.3,
          ed: 0.3,
          o: 0.5,
          t: 10
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var formData = new FormData()
            // formData.append('username', this.temp.username)
            // formData.append('password', this.temp.password)
            createGame(this.temp).then((data) => {
              if (data.code === 20000) {
                Message({
                  message: this.$t('message.' + data.message),
                  type: 'success',
                  duration: 3 * 1000
                })
                this.dialogFormVisible = false
                this.getList()
              } else {
                Message({
                  message: this.$t('message.' + data.message),
                  type: 'error',
                  duration: 3 * 1000
                })
              }
            })
          }
        })
      },
      handleUpdate(row) {
        this.resetTemp()
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateGame(this.temp).then((res) => {
              if (res.code === 20000) {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: this.$t('message.' + res.message),
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              }
            })
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
      handleReset(row) {
        resetGame({ 'id': row.id }).then((res) => {
          if (res.code === 20000) {
            Message({
              message: this.$t('message.' + res.message),
              type: 'success',
              duration: 2000
            })
            this.getList()
          }
        })
      },
      handleChangeStatus(row) {
        changeGameStatus({ 'id': row.id }).then((res) => {
          if (res.code === 20000) {
            Message({
              message: this.$t('message.' + res.message),
              type: 'success',
              duration: 2000
            })
            this.getList()
          }
        })
      },
      handleToCsv(row) {
        var temp = document.createElement('form')
        temp.action = 'http://139.217.224.180:8080/api/games/csv'+ '?id=' + row.id
        temp.method = 'POST'
        // temp.headers['X-token']= getToken()
        temp.style.display = 'none'
        document.body.appendChild(temp)
        temp.submit()
      }
      // handleDownload() {
      //   this.downloadLoading = true
      //   import('@/vendor/Export2Excel').then(excel => {
      //     const tHeader = ['编号', '用户名', '角色']
      //     const filterVal = ['id', 'username', 'roles']
      //     const list = this.list.filter(v => {
      //       return { 'id': v.id, 'username': v.username, 'roles': v.roles.join(',') }
      //     })
      //     const data = this.formatJson(filterVal, list)
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: this.filename,
      //       autoWidth: this.autoWidth,
      //       bookType: this.bookType
      //     })
      //     this.downloadLoading = false
      //   })
      // }
    }
  }
</script>

<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
<!--      订单表格区域-->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编码" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showDialog"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showPocessDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>
<!--      分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
<!--    点击修改按钮对话框-->
    <el-dialog
        title="修改地址" :visible.sync="EditLocationdialogVisible" width="50%" @close="EditLocationdialogClosed">
      <el-form :model="EditForm" :rules="EditFormRules" ref="EditFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="EditForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="EditForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="EditLocationdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="EditLocationdialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
<!--    物料信息对话框-->
    <el-dialog
        title="物流进度" :visible.sync="processVisible" width="50%" @close="EditLocationdialogClosed">
        <el-timeline>
          <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.timestamp">
            {{activity.content}}
          </el-timeline-item>
        </el-timeline>

      <span slot="footer" class="dialog-footer">
    <el-button @click="processVisible = false">取 消</el-button>
    <el-button type="primary" @click="processVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {getOrderlist,getKuaidi} from "network/order"
import citydata from "views/order/citydata";
export default {
  name: "Order",
  created(){
    this.getOrderList()
  },
  data(){
    return {
      queryInfo:{
        query:"",
        pagenum:1,
        pagesize:10
      },
      orderlist:[],
      total:0,
      EditLocationdialogVisible:false,
      EditForm:{
        address1:"",
        address2:""
      },
      EditFormRules:{
        address1:[
          {required:true,message:"请输入省市区/县",trigger:"blur"}
        ],
        address2: [
          {required:true,message:"请输入详细地址",trigger:"blur"}
        ]
      },
      citydata:citydata,
      processVisible:false,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }]
    }
  },
  methods:{
    async getOrderList(){
      const res = await getOrderlist(this.queryInfo)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)

      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showDialog(){
      this.EditLocationdialogVisible = true
    },
    EditLocationdialogClosed(){
      this.$refs.EditFormRef.resetFields()
    },
    async showPocessDialog(){
      // const res = await getKuaidi()
      // console.log(res);
      this.processVisible = true
    }

  }
}
</script>

<style scoped>
.el-cascader{
  width: 100%;
}
</style>
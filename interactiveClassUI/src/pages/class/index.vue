<template>
    <view style="margin-right: 8px;margin-left: 8px;">
        <view class="class_name" style="font-size: 18px; font-weight: bold;">
            {{className}}
        </view>
        <van-divider custom-style="height:1px"/>
        <van-row>
            <van-grid :border="border">
                <van-grid-item  use-slot v-if="teacher">
                    <view @click="studentManager">
                        <image
                                style="width: 100%; height: 40px;"
                                src="/static/icon/cygl.png"
                        />
                        <view>成员管理</view>
                    </view>
                </van-grid-item>
                <van-grid-item  use-slot>
                    <view @click="userTalk">
                        <image
                                style="width: 100%; height: 40px;"
                                src="/static/icon/tlq.png"
                        />
                        <view>讨论区</view>
                    </view>
            </van-grid-item>
            <van-grid-item  use-slot>
                <view @click="checkAnalysis">
                    <image
                            style="width: 100%; height: 40px;"
                            src="/static/icon/sz.png"
                    />
                    <view>分析</view>
                </view>
            </van-grid-item>
                <van-grid-item  use-slot>
                    <view @click="codeImg">
                        <image
                                style="width: 100%; height: 40px;"
                                src="/static/icon/code.png"
                        />
                        <view>二维码</view>
                    </view>
                </van-grid-item>
            </van-grid>
        </van-row>
        <van-row>
            <view class="class_center2">
                <view style="font-size: 18px;font-weight: bold;">教学日志</view>
                <view v-if="teacher">
                    <van-button icon="plus" type="info" size="small" @click="fbshow=true" @click-overlay="fbshow=false">
                        发布
                    </van-button>
                </view>
            </view>
        </van-row>
        <van-divider  custom-style="height:1px"/>
        <van-row>
            <view>
                <van-tabs swipeable @change="onChange">
                    <van-tab title="公告">
                        <notice :noticeArr="noticeArr"/>
                    </van-tab>
                    <van-tab title="课件">
                        <courseware :coursewareArr="coursewareArr"/>
                    </van-tab>
                    <van-tab title="试卷">
                        <paper :arrPaper="arrPaper"/>
                    </van-tab>
                    <van-tab title="签到">
                        <van-row>
                            <user-sign :signData="course" ref="signFun"/>
                            <van-divider  custom-style="height:1px"/>
                        </van-row>
                    </van-tab>
                </van-tabs>
            </view>
        </van-row>
        <van-row custom-class="width:100%;height=100%;">
            <view style=" display:flex; justify-content:center">
                <van-overlay :show="fbshow" @click="fbshow=false">
                    <view class="wrapper" style="margin: 50% 20%;">
                        <view style="width:100%">
                            <van-button icon="star-o" type="primary" round="true" @click="addPaper" custom-style="width:100%;">发布试卷</van-button>
                        </view>
                        <view style="width:100%;margin-top: 12px;">
                            <van-button icon="star-o" type="primary" round="true" @click="pubNotice" custom-style="width:100%;">发布公告</van-button>
                        </view>
                    </view>
                </van-overlay>
            </view>
        </van-row>
        <noticeForm ref="noticeFormCom" @refreshNotice="queryNotice" :course="course"/>
        <addPaperForm ref="paperFormCom" @refreshPaper="queryPaper" :course="course"/>
    </view>
</template>
<script>
    import notice from '@/pages/class/notice/index'
    import noticeForm from '@/pages/class/notice/form'
    import paper from '@/pages/class/paper/index'
    import addPaperForm from '@/pages/class/paper/addPaperForm'
    import courseware from '@/pages/class/courseware/index'
    import sign from '@/pages/class/sign/index'
    import {queryNotice} from "@/api/notice"
    import {queryPaper} from "@/api/paper"
    import {queryMySignInfo} from "@/api/sign"
    import {listPage} from "@/api/courseware"
    import {getStoreUserInfo, saveUserInfoStore,getUserInfo} from '@/api/user'
    export default {
        components:{
            paper,
            addPaperForm,
            courseware,
            noticeForm,
            notice,
            userSign: sign
        },
        data() {
            return {
                teacher:true,
                course:{
                    courseId:'',
                    classId:''
                },
                userInfo:null,
                showfbgg:false,
                noticeArr:[],
                coursewareArr:[],
                arrPaper:[],
                addPaperBtn:false,
                notice:{
                    noticeTitle:'',
                    noticeContent:'',
                    publishUserId:'',
                    classId:'',
                    courseId:''
                },
                className:'',
                border:false,
                fbshow:false
            }
        },
        onShow() {
            this.doGetStoreUserInfo();
        },
        mounted() {
            this.doGetUserInfo();
            this.notice.publishUserId = this.userInfo.id;
            this.queryNotice();
        },
        onLoad(option) {
            const dataItem = JSON.parse(decodeURIComponent(option.item));
            if(dataItem.roleId=='1'){
                this.teacher=false;
                this.className=dataItem.courseId.className;
                this.notice.classId=dataItem.courseId.classId;
                this.notice.courseId=dataItem.courseId.courseId;
                this.course.classId=dataItem.courseId.classId;
                this.course.courseId=dataItem.courseId.courseId;
            }else{
                this.teacher=dataItem.roleId=='2';
                this.className=dataItem.item.className;
                this.notice.classId=dataItem.item.id;
                this.notice.courseId=dataItem.courseId;
                this.course.classId=dataItem.item.id;
                this.course.courseId=dataItem.courseId;
            }
        },
        methods:{
            codeImg(){
                uni.navigateTo({
                    url: '/pages/class/codeImg/index?item='+this.course.classId
                });
            },
            studentManager(){
                console.log('成员管理');
                uni.navigateTo({
                    url: '/pages/class/student/index?item='+encodeURIComponent(JSON.stringify(this.course))
                });
            },
            userTalk(){
                uni.navigateTo({
                    url: '/pages/class/talk/index?classId='+ this.course.classId
                });
            },
            checkAnalysis(){
                uni.navigateTo({
                    url: '/pages/class/Analysis/index?item='+this.course.courseId
                });
            },
            doGetUserInfo() {
                getUserInfo().then(resp => {
                    this.userInfo = resp
                    saveUserInfoStore(resp)
                })
            },
            async doGetStoreUserInfo() {
                this.userInfo = await getStoreUserInfo()
                console.log(this.userInfo)
            },
            pubNotice() {
                this.$refs.noticeFormCom.showDialog()
            },
            addPaper(){
                this.$refs.paperFormCom.showDialog()
            },
            onChange(event){
                var index=event.detail.name;
                if(index==0){
                    this.queryNotice();
                }if(index==1){
                    this.queryCourseware();
                }
                if(index==2){
                    this.queryPaper();
                }
                if(index==3){
                    this.$refs.signFun.querySignInfo();
                }
            },
            queryNotice(){
                var data={
                    courseId:this.notice.courseId,
                    classId:this.notice.classId,
                    page:1,
                    limit:30
                }
                queryNotice(data).then(resp => {
                    this.noticeArr=resp;
                });
            },
            queryCourseware(){
                var data={
                    id:this.notice.courseId,
                    classId:this.notice.classId,
                    page:1,
                    limit:30
                }
                listPage(data).then(resp => {
                    this.coursewareArr=resp;
                });
            },
            queryPaper(){
                var data={
                    courseId:this.notice.courseId,
                    classId:this.notice.classId,
                    publishUserId:this.notice.publishUserId,
                    page:1,
                    limit:30
                }
                queryPaper(data).then(resp => {
                    this.arrPaper =resp;
                    console.log(resp);
                });
            },
            mgetLocation(){
                console.log("获取位置开始");
                this.getLocal();
            },
            Dk(flag){
                var now=moment();
                if(flag==1){
                    this.dkflag1=false;
                    this.nowTime1=now.format('HH:mm:ss');
                }
                if(flag==2){
                    this.dkflag2=false;
                    this.nowTime2=now.format('HH:mm:ss');
                }
            }
        }
    }
</script>
<style>
.option_icon image{
    width:70%;
    height:36px;
}
.class_center2{
    display: flex;
    justify-content: space-between;
}
.notice_title{
    font-family: "Times New Roman", Times, serif;
    font-weight: bold;
    font-size: 16px;
}
.notice_content{
    font-family:"微软雅黑","黑体","宋体";
    font-size: 14px;
    color: #000000;
}
.notice_foot{
    font-size: 12px;
    color: #b3b3b3;
}
.signIn{
    height: 40px;
    display: flex;
    justify-content: space-between;
}
.address{
    height: 50px;
}
 .signIn_left{
    margin: auto 0px;
}
.signIn_right{
    margin: auto 0px;
}
.signIn_time{
    font-size: 12px;
    color: #b3b3b3;
}
.kj_zlist{
    box-shadow: 0 4px 8px 0 rgba(28,31,33,.1);
    margin: 10px auto;
    border: 1px solid #F0F0F0;
    border-radius: 4px;
}
.kj_list{
    display: flex;
    margin-bottom: 2px;
}
.kj_title{
    flex: 1;
    height: 50px;
    line-height: 50px;
    color:black;
    margin-left: 10px;

}
.kj_yl,.kj_download{
    width: 40px;
    margin: auto 10px;
}
</style>
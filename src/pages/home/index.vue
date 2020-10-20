<template>
    <view class="home-index">
        <mp-navigation-bar
            :loading="false"
            :show="true"
            :animated="false"
            :color="color"
            :background="background"
            :title="title" 
            :back="false">
        </mp-navigation-bar>
        <!-- 搜索框 -->
        <view class="search-box-wrap">
            <view class="search-box-inner">
                <view class="search-box">
                    <input type="text" placeholder="搜索" v-model="searchText" confirm-type="search" @confirm="search" />
                    <icon type="search" @tap="search" size="14"></icon>
                </view>
            </view>
        </view>
        <!-- 轮播图 -->
        <view class="section">
            <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="500" :circular="true">
                <swiper-item v-for="(item, index) in swipers" :key="index">
                    <image :src="photoBaseUrl + item.image" mode="aspectFit" class="banner" @tap="handleNewDetailP(index)"></image>
                </swiper-item>
            </swiper>
        </view>
        <!-- 活动介绍 -->
        <view class="section-single" v-if="introduct.activityDescr !== ''">
            <view class="list-item-text-primary">
                <view class="intro-wrap">
                    <text class="intro-title">活动介绍</text>
                </view>
                <view class="parser-wrap">
                    <jyf-parser :html="introduct.activityDescr" :domain="photoBaseUrl"></jyf-parser>
                </view>
            </view>
        </view>
        <!-- 专题新闻 -->
        <view class="special-box-wrap" v-if="specials.length > 0">
            <view class="intro-wrap">
                <text class="intro-title">专题新闻</text>
                <text class="more" @tap="jump">更多></text>
            </view>
            <view v-for="(item, index) in specials" :key="index" class="special-box-inner" @tap="handleDetail(item)">
                <image :src="item.image ? item.image : '/static/nopic.jpg'" mode="aspectFit" class="image-sp-main" />
                <view class="special-right">
                    <view class="special-title">{{item.title}}</view>
                    <view class="special-summary">{{item.summary}}</view>
                    <view class="special-desc">
                        <view>{{item.created_at.substring(0, 10)}}</view>
                        <view>{{item.views}}人观看过</view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 科普探秘 -->
        <view class="home-section marginB30" v-if="news.length > 0">
            <view class="intro-wrap">
                <text class="intro-title">科普探秘</text>
                <text class="more" @tap="jumpNews">更多></text>
            </view>
            <view v-for="(newItem, idx) in news" :key="idx" class="list-item-sp" @tap="handleDetail(newItem)">
                <view class="new-img-sp">
                    <image v-if="newItem.image" :src="newItem.image" mode="aspectFit" class="image-sp" />
                    <image v-else src="/static/nopic.jpg" mode="aspectFit" class="image-sp" />
                </view>
                <view style="position:relative;top:10rpx">
                    <view class="list-item-text-title-sp">
                        <text>{{newItem.title}}</text>
                    </view>
                    <view class="list-item-text-content-sp" style="margin-right:5rpx;margin-top:2rpx">
                        <view class="item-text-content-single">
                            <text>{{newItem.summary}}</text>
                        </view>
                        <view>
                            <view style="position:relative;top:15rpx;float:left;color:#999;font-size:24rpx">
                                {{newItem.views}}人观看过
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 科技抗疫 -->
        <view class="home-section" v-if="techArr.image">
            <view class="intro-wrap">
                <text class="intro-title">{{techArr.title}}</text>
            </view>
            <view class="new-img-item-single">
                <image :src="photoBaseUrl + techArr.image" mode="widthFix" @tap="jumpNewNews()" />
            </view>
        </view>
        <!-- 美丽丰台科普行 -->
        <view class="home-section" v-if="kpArr.image">
            <view class="intro-wrap">
                <text class="intro-title">{{kpArr.title}}</text>
            </view>
            <view class="new-img-item-single">
                <image :src="photoBaseUrl + kpArr.image" mode="widthFix" @tap="jumpKp(kpArr)" />
            </view>
        </view>
        <!-- 垃圾分类小游戏 -->
        <view class="home-section" v-if="gameArr.image">
            <view class="intro-wrap">
                <text class="intro-title">{{gameArr.title}}</text>
            </view>
            <view class="new-img-item-single">
                <image :src="photoBaseUrl + gameArr.image" mode="widthFix" @tap="jumpFlgame" />
            </view>
        </view>
        <view class="space-view"></view>
    </view>
</template>

<script>
import { photoBaseUrl, getCarousels, getArticles } from '../../api/api';
import parser from "@/components/jyf-parser/jyf-parser";
const appInstance = getApp();
export default {
    name: 'HomeIndex',
    data() {
        return {
            photoBaseUrl: photoBaseUrl,
            color: '#333',
            background: '#fff',
            title: '',
            news: [],
            specials: [],
            swipers: [],
            techArr: {},
            kpArr: {},
            gameArr: {},
            introduct: {
                name: "活动简介",
                activityDescr: "",
            },
            searchText: "",
            cateObj: {}
        }
    },
    components: {
        "jyf-parser": parser
    },
    onShow() {
        this.setTabBarIndex('首页');
    },
    onLoad(option) {
        appInstance.initConfig().then((res) => {
            this.title = appInstance.globalData.config.app_name;
            this.cateObj = appInstance.globalData.category;
            this.initData();
        });
    },
    methods: {
        async initData() {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            // 获取首页轮播
            await getCarousels({
                filter: {"group":"首页轮播"},
                sort: "-created_at,-sortnum",
                "per-page": 100
            })
            .then((res) => {
                this.swipers = res.data.items
            });
            // 活动介绍
            this.introduct.activityDescr = appInstance.globalData.config.activity_intro;
            // 专题新闻
            await getArticles({
                filter: {"category_id": this.cateObj['专题新闻'],"commend":"首页显示"},
                expand: 'category',
                sort: "-sortnum,-created_at",
                "per-page": 2
            })
            .then((res) => {
                this.specials = res.data.items;
            });
            // 科普探秘
            await getArticles({
                filter: {"category_id":this.cateObj['科普探秘'],"commend":"首页显示"},
                expand: 'category',
                sort: "-sortnum,-created_at",
                "per-page": 5
            })
            .then((res) => {
                this.news = res.data.items
            });
            // 科技战疫
            await getCarousels({
                filter: {"group":"科技战疫"},
                sort: "-sortnum,-created_at",
                "per-page": 1
            })
            .then((res) => {
                const json = res.data.items;
                if (json.length > 0) {
                    this.techArr = {...json[0]};
                }
            });
            // 美丽丰台科技行
            await getCarousels({
                filter: {"group":"美丽丰台科技行"},
                sort: "-sortnum,-created_at",
                "per-page": 1
            })
            .then((res) => {
                const json = res.data.items;
                if (json.length > 0) {
                    this.kpArr = {...json[0]};
                }
            });
            // 垃圾分类小游戏
            await getCarousels({
                filter: {"group":"垃圾分类小游戏"},
                sort: "-sortnum,-created_at",
                "per-page": 1
            })
            .then((res) => {
                const json = res.data.items;
                if (json.length > 0) {
                    this.gameArr = {...json[0]};
                }
            });
            uni.hideLoading();
            uni.stopPullDownRefresh();
        },
        search() {
            uni.navigateTo({
                url: `/pages/other/search_list?searchTxt=${this.searchText}`
            });
        },
        handleNewDetailP(val) {
            const url = this.swipers[val].url;
            if (url != "" && url != "/") {
                uni.navigateTo({
                    url: url
                });
            }
        },
        jump() {
            uni.navigateTo({
                url: `/pages/other/special_list`
            });
        },
        handleDetail(obj) {
            uni.navigateTo({
                url: `/pages/other/detail?id=${obj.id}`
            });
        },
        jumpNews() {
            wx.switchTab({
                url: `/pages/explore/index`
            });
        },
        jumpNewNews() {
            wx.switchTab({
                url: `/pages/zhanyi/index`
            });
        },
        jumpKp(obj) {
            var url = obj.url;
            if (url != "" && url != "/") {
                uni.navigateTo({
                    url: url
                });
            }
        },
        jumpFlgame() {
            uni.navigateToMiniProgram({
                appId: 'wx619fe2bef1718bfa',
                path: '/', 
                envVersion: 'trail',
            });
        },
    },
    onPullDownRefresh() {
        let pages = getCurrentPages();
        let curPage = pages[pages.length-1];
        curPage.onLoad();
    },
    onShareAppMessage() {
        // 分享好友
        const route = this.getCurrentUrl();
        // 实际转发到微信的内容
        const curTitle = appInstance.globalData.config.app_name;
        return {
            title: curTitle,
            path: route
        }
    },
    onShareTimeline() {
        // 分享朋友圈
        const route = this.getCurrentUrl();
        // 实际转发到微信的内容
        const curTitle = appInstance.globalData.config.app_name;
        return {
            title: curTitle,
            path: route
        }
    }
}
</script>

<style lang="scss">
// 搜索框
.search-box-wrap{
    box-sizing: border-box;
    padding: 16rpx 20rpx;
}
.search-box-inner{
    width: 100%;
    height: 56rpx;
    border-radius: 10rpx;
    background: #fff;
    border: 1rpx solid #e6e6ea;
}
.search-box{
    width: 100%;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    input{
        flex: 1;
        box-sizing: border-box;
        padding-left: 30rpx;
        padding-top: 4rpx;
        height: 54rpx;
    }
    icon{
        width: 65rpx;
        line-height: 82rpx;
        text-align: center;
    }
}
// 轮播
.section{
    background-color:#efefef;
    border-bottom:0px;
    .swiper{
        height: 460rpx;
    }
    .banner{
        height: 460rpx;
        width: 100%;
    }
}
// 活动介绍
.section-single{
    box-sizing: border-box;
    padding: 30rpx;
    .list-item-text-primary{
        margin-top: 0px;
    }
}
.list-item-text{
    margin-top: 0px;
}
.intro-wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    .intro-title{
        font-size: 34rpx;
        font-weight: 700;
    }
    .more{
        font-size: 24rpx;
        color:#27305b;
    }
}
// 专题新闻
.special-box-wrap{
    width: 100%;
    padding: 0rpx 30rpx;
    box-sizing: border-box;
    .special-box-inner{
        width: 100%;
        border-bottom: 20rpx solid #efefef;
        background-color: #fff;
        border-radius: 10rpx;
        box-sizing: border-box;
        padding: 20rpx;
        display: flex;
    }
    .special-right{
        flex: 1;
        padding-left: 20rpx;
    }
    .special-title{
        font-size: 28rpx;
        font-weight: bold;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }
    .special-summary{
        font-size: 28rpx;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
    .special-desc{
        font-size: 24rpx;
        color: #999;
        display: flex;
        justify-content: space-between;
    }
}
.home-section{
    width: 100%;
    padding: 0rpx 30rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
}
.marginB30{
    margin-bottom: 30rpx;
}
// 
.new-img-item-single{
    margin-bottom: 40rpx;
    image{
        height: 422rpx;
        width: 690rpx;
        border-radius: 8rpx;
        overflow: hidden;
    }
}
</style>

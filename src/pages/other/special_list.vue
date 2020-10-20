<template>
    <view>
        <mp-navigation-bar
            :loading="false"
            :show="true"
            :animated="false"
            :color="color"
            :background="background"
            :title="title" 
            :back="isBack">
        </mp-navigation-bar>
        <view class="page-wrapper-1">
            <view v-for="(newItem, index) in news" :key="index" class="list-item-box-single-sp" @tap="handleDetail(newItem)">
                <image :src="newItem.banner" mode="aspectFit" />
                <view class="news-title">{{newItem.title}}</view>
                <view class="news-info">
                    <view>{{newItem.created_at.substring(0, 10)}}</view>
                    <view>{{newItem.views}}人观看过</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { photoBaseUrl, getArticles } from '../../api/api';
const appInstance = getApp();
export default {
    name: 'special_list',
    data() {
        return {
            photoBaseUrl: photoBaseUrl,
            color: '#333',
            background: '#fff',
            isBack: false,
            title: '专题新闻',
            news: [],
            isMore: true,
            page: 1,
            limit: 10,
            refresh: false
        }
    },
    onLoad(options) {
        // 导航是否显示返回按钮
        const pagesArray = getCurrentPages();
        if (pagesArray.length > 1) {
            this.isBack = true
        }
        appInstance.initConfig().then((res) => {
            this.cateObj = appInstance.globalData.category;
            this.getList();
        });
    },
    methods: {
        getList() {
            uni.showLoading({
                title: '加载中',
                mask: true
            });
            getArticles({
                filter: {"category_id":this.cateObj['专题新闻']},
                expand: 'category',
                sort: "-commend,-sortnum,-created_at",
                page: this.page,
                "per-page": this.limit
            })
            .then((res) => {
                const json = res.data.items;
                if (this.refresh) {
                    this.news = [];
                    this.videoObj = {};
                    this.refresh = false;
                    uni.stopPullDownRefresh();
                }
                if (json.length > 0) {
                    this.news.push(...json);
                    this.isMore = true;
                    if (this.page === 1) {
                        this.videoObj = json[0];
                    }
                    this.page += 1;
                } else {
                    this.isMore = false;
                }
                uni.hideLoading();
            });
        },
        handleDetail(obj) {
            uni.navigateTo({
                url: `/pages/other/detail?id=${obj.id}`
            });
        }
    },
    onPullDownRefresh() {
        let pages = getCurrentPages();
        let curPage = pages[pages.length-1];
        this.page = 1;
        this.isMore = true;
        this.refresh = true;
        curPage.onLoad();
    },
    onReachBottom() {
        if (this.isMore) {
            this.getList();
        }
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
.list-item-box-single-sp{
    image{
        height: 316rpx;
        width: 100%;
    }
    .news-title{
        width: 100%;
        height: 40rpx;
        font-weight: 700;
        text-align: left;
        text-indent: 20rpx;
    }
    .news-info{
        font-size: 24rpx;
        color: #999;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0rpx 20rpx;
    }
}
</style>

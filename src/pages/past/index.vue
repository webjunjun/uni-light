<template>
    <view class="past-index">
        <mp-navigation-bar
            :loading="false"
            :show="true"
            :animated="false"
            :color="color"
            :background="background"
            :title="title" 
            :back="false">
        </mp-navigation-bar>
        <view class="past-list">
            <view v-for="(item, index) in reviews" :key="index" v-if="item.image" class="past-item" @tap="goDetail(item)">
                <image :src="item.image" mode="widthFix" />
                <view class="past-title">{{item.title}}</view>
            </view>
        </view>
        <view class="space-view"></view>
    </view>
</template>

<script>
import { photoBaseUrl, getArticles } from '../../api/api';
const appInstance = getApp();
export default {
    name: 'PastIndex',
    data() {
        return {
            color: '#333',
            background: '#fff',
            title: '往届回顾',
            reviews: [],
            cateObj: {},
            isMore: true,
            page: 1,
            limit: 10,
            refresh: false
        }
    },
    onShow() {
        this.setTabBarIndex('往届回顾');
    },
    onLoad(option) {
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
            // 获取往届回顾
            getArticles({
                filter: {"category_id":this.cateObj['往届回顾']},
                expand: 'category',
                sort: "-sortnum,-created_at",
                page: this.page,
                "per-page": this.limit
            })
            .then((res) => {
                const json = res.data.items;
                if (this.refresh) {
                    this.reviews = [];
                    this.refresh = false;
                    uni.stopPullDownRefresh();
                }
                if (json.length > 0) {
                    this.reviews.push(...json);
                    this.isMore = true;
                    this.page += 1;
                } else {
                    this.isMore = false;
                }
                uni.hideLoading();
            });
        },
        goDetail(obj) {
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
.past-list{
    box-sizing: border-box;
    padding: 30rpx 10rpx;
}
.past-item{
    width: 100%;
    background-color: #fff;
    border-radius: 10rpx;
    margin-bottom: 30rpx;
    padding-bottom: 10rpx;
    overflow: hidden;
    image{
        height: 316rpx;
        width: 100%;
    }
    .past-title{
        font-size: 28rpx;
        font-weight: 700;
        text-align: left;
        text-indent: 20rpx;
    }
}
</style>

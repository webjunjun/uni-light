<template>
    <view class="detail-page">
        <mp-navigation-bar
            :loading="false"
            :show="true"
            :animated="false"
            :color="color"
            :background="background"
            :title="title" 
            :back="isBack">
        </mp-navigation-bar>
        <mp-sticky :offset-top="offset_top" v-if="news.video_src">
            <video 
                id="myVideo" 
                :src="news.video_src" 
                :controls="true" 
                :show-center-play-btn="false" 
                :autoplay="true" 
                object-fit="contain" 
                :title="news.title" 
                :custom-cache="false"
                :picture-in-picture-mode="['push', 'pop']">
            </video>
        </mp-sticky>
        <view class="article-wrap" v-if="news.title">
            <view class="airticle-title">{{news.title}}</view>
            <view class="airticle-intro">
                <text>{{news.created_at.substring(0, 10)}}</text>
                <text>{{news.views}}人看过</text>
            </view>
            <view class="parser-wrap">
                <jyf-parser :html="news.content" :domain="photoBaseUrl"></jyf-parser>
            </view>
        </view>
        <view class="space-view"></view>
    </view>
</template>

<script>
import { photoBaseUrl, getOneArticle } from '../../api/api';
import parser from "@/components/jyf-parser/jyf-parser";
const appInstance = getApp();
export default {
    name: 'detail',
    data() {
        return {
            photoBaseUrl: photoBaseUrl,
            color: '#333',
            background: '#fff',
            isBack: false,
            title: '新闻详情',
            news: {},
            offset_top: 0,
            videoContext: null,
            autoplay: true
        }
    },
    components: {
        "jyf-parser": parser
    },
    onLoad(options) {
        // 导航是否显示返回按钮
        const pagesArray = getCurrentPages();
        if (pagesArray.length > 1) {
            this.isBack = true
        }
        appInstance.initConfig().then((res) => {
            this.offset_top = appInstance.globalData.statusBarHeight;
            this.initData(options);
        });
    },
    onShow() {
        if (this.videoContext && !this.autoplay) {
            this.videoContext.play();
        }
    },
    methods: {
        initData(options) {
            getOneArticle({
                id: options.id
            })
            .then((res) => {
                this.news = res.data;
                this.title = this.news.title;
                if (this.news.video_src) {
                    this.videoContext = uni.createVideoContext('myVideo');
                }
            });
        }
    },
    onHide() {
        if (this.videoContext) {
            this.videoContext.stop();
        }
    },
    onUnload() {
        if (this.videoContext) {
            this.videoContext.stop();
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
page{
    background-color: #fff;
}
.parser-wrap{
    margin-top: 30rpx;
    padding-top: 30rpx;
    border-top: 1rpx solid #efefef;
}
.article-wrap{
    width: 100%;
    box-sizing: border-box;
    padding: 20rpx 30rpx;
    .airticle-title{
        font-size: 34rpx;
        font-weight: bold;
    }
    .airticle-intro{
        display: flex;
        justify-content: space-between;
        font-size: 24rpx;
        color: #999;
    }
}
.__p,.__div{
    font-size: 32rpx!important;
}
._img{
    margin-top: 10rpx;
}
</style>

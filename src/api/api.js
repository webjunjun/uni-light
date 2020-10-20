import { base64encode } from '../utils/utils';
const photoBaseUrl = 'https://api.kjz.kanjian2020.com'
const baseUrl = `${photoBaseUrl}/v1`;

const myRequest = (obj) => {
    if (obj.url && obj.method) {
        return new Promise((resolve, reject) => {
            let reqData = obj.data || null;
            let header = {};
            const appInstance = getApp();
		    // if (appInstance && appInstance.globalData.userInfo !== null) {
            //     let access_token = appInstance.globalData.authInfo.access_token;
            //     let Authorization = access_token + ':';
            //     header = Object.assign({
            //         "Authorization": `Basic ${base64encode(Authorization)}`
            //     }, header);
            // }
            uni.request({
                url: obj.url,
                method: obj.method,
                header,
                timeout: 30000,
                data: reqData,
                success(res) {
                    if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
                        resolve(res);
                    }
                    //  else if (res.statusCode === 401) {
                    //     console.log(res.data, 'auth');
                    //     // 未授权，重新授权一次。
                    //     // 不能引导去wx_login，否则没法长期登录
                    //     uni.login({
                    //         provider: "weixin",
                    //         success(res) {
                    //             login({
                    //                 code: res.code
                    //             })
                    //             .then((response) => {
                    //                 // 拿到返回的openid
                    //                 const json = response.data;
                    //                 if (json.success) {
                    //                     appInstance.globalData.userInfo = json.user;
                    //                     appInstance.globalData.openid = json.user.openid;// 进入小程序代表是粉丝了。
                    //                     const pages = getCurrentPages();
                    //                     pages[pages.length -1].onLoad();
                    //                 }
                    //                 uni.hideLoading();
                    //             });
                    //         }
                    //     });
                    // } 
                    else {
                        console.log(res.data, 'fail');
                        uni.hideLoading();
						uni.showModal({
						    title: "系统提示",
						    content: res.data.message,
						    showCancel: false,
						    confirmText: "知道了",
						});
                        reject(res);
                    }
                },
                fail(err) {
                    console.log(err, 'err');
                    uni.hideLoading();
					uni.showModal({
					    title: "系统提示",
					    content: err.errMsg ? err.errMsg : err.data.message,
					    showCancel: false,
					    confirmText: "知道了",
					});
                    reject(err);
                }
            });
        });
    } else {
        uni.showToast({
            title: '参数缺失',
            icon: "none",
            duration: 1500
        });
    }
};
const uniRequest = {
    get(url, data = {}) {
        // 查询
        return myRequest({
            url,
            data,
            method: "GET"
        });
    },
    post(url, data = {}) {
        // 新增
        return myRequest({
            url,
            data,
            method: "POST"
        });
    },
    put(url, data = {}) {
        // 更新
        return myRequest({
            url,
            data,
            method: "PUT"
        });
    },
    del(url, data = {}) {
        // 删除
        return myRequest({
            url,
            data,
            method: "DELETE"
        });
    },
    head(url, data = {}) {
        return myRequest({
            url,
            data,
            method: "HEAD"
        });
    }
}

const getConfigAll = (data) => uniRequest.get(`${baseUrl}/config/get-all`, data); // 获取配置
const getArticles = (data) => uniRequest.get(`${baseUrl}/articles`, data); // 获取资讯
const getCategories = (data) => uniRequest.get(`${baseUrl}/categories`, data); // 获取分类
const getCarousels = (data) => uniRequest.get(`${baseUrl}/carousels`, data); // 获取广告
const getOneArticle = (data) => uniRequest.get(`${baseUrl}/articles/${data.id}`, data); // 获取资讯

module.exports = {
    photoBaseUrl,
    baseUrl,
    getConfigAll,
    getArticles,
    getCategories,
    getCarousels,
    getOneArticle
}
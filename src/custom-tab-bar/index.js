const appTab = getApp();
Component({
	data: {
		selected: 0,
		color: "#333",
		selectedColor: "#333",
		list: []
	},
	attached() {
		this.data.list = [{
			iconPath: "/static/tabbar/nav1_01.png",
			selectedIconPath: "/static/tabbar/nav1_02.png",
			pagePath: "/pages/home/index",
			text: "首页"
		}, {
			iconPath: "/static/tabbar/nav2_01.png",
			selectedIconPath: "/static/tabbar/nav2_02.png",
			pagePath: "/pages/explore/index",
			text: "科普探秘"
		}, {
			iconPath: "/static/tabbar/nav3_01.png",
			selectedIconPath: "/static/tabbar/nav3_02.png",
			pagePath: "/pages/zhanyi/index",
			text: "科技战疫"
		}, {
			iconPath: "/static/tabbar/nav4_01.png",
			selectedIconPath: "/static/tabbar/nav4_02.png",
			pagePath: "/pages/past/index",
			text: "往届回顾"
		}];
		this.setData({
			list: this.data.list
		});
	},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset
			const url = data.path
			wx.switchTab({
				url
			})
			this.setData({
				selected: data.index
			})
		}
	}
})

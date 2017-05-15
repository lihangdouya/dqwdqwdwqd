$(function () {
	// 每一个栏目加载的时候请求数据的开始和结束的索引
	var startIndex = 0;
	var endIndex = 20;

	// UI中展示的所有的数据
	var allDatas = [];

	// 设置栏目名称
	$('li').each(function (i,v) {
		// console.log(v);
		$(v).text(interfaces[i].title);
		v.baseUrl = interfaces[i].url;
	});

	// 处理栏目的点击事件
	$('ul').on('click',function (e) {
		// console.log(e.target.baseUrl);
		// 点击栏目颜色为白色，非点击的栏目为黑色
		$(e.target).addClass('active').siblings().removeClass('active');
		// 把开始和结束的索引置为默认值
		startIndex = 0;
		endIndex = 20;
		// 拼接请求接口
		var reqUrl = createRequestUrl(e.target.baseUrl,startIndex,endIndex);
		// 把页面清空
		$('.content').html('');
		allDatas = [];
		// 发起请求

		loadDatas(reqUrl,loadContentForUI);
	});
	

	// 拼接请求接口
	function createRequestUrl (baseUrl,startIndex,endIndex) {
		return baseUrl + startIndex + "-" + endIndex + ".html";
	}

	// 请求头条数据
	function loadDatas (requestUrl,callback) {
		$.ajax({
			type:'post',
			url:'http://localhost:9999',
			data:requestUrl,
			success:function (data) {
				// console.log(data);
				var dataObj = JSON.parse(data);
				// console.log(dataObj);
				if (Object.values(dataObj).length > 0) {
					var datas = Object.values(dataObj)[0];
					console.log(datas);
					$.merge(allDatas,datas);
					callback(datas);
				}
			},
			error:function (msg) {
				
			}
		});
	}

	// 页面默认加载头条
	var ttRequestUrl = createRequestUrl("http://c.m.163.com/nc/article/headline/T1348647853363/",startIndex,endIndex);
	loadDatas(ttRequestUrl,loadContentForUI);
	$('li:first').addClass('active');


	function loadContentForUI (datas) {
		// 根据返回的数据添加页面的内容
		$.each(datas,function (i,v) {
			if (datas[i].ads) {}
			$(".content").append('<div class="clist"><div><img src="' + v.imgsrc + '"></div><div><p>' + v.title + '</p><p><span>' + v.ptime + '</span><span>' + v.replyCount + '</span></p></div></div>');
		});	
	}

	// 处理页面新闻的点击事件，跳转详情
	$('.content').on('click','.clist',function(e){
		// console.log(e.currentTarget);
		// console.log($('.clist').index(e.currentTarget));
		var indexOfTarget = $('.clist').index(e.currentTarget);
		var detailUrl = allDatas[indexOfTarget].url_3w;
		if (detailUrl) {
			window.open(detailUrl);
		}
	});

	// 监听滚动事件，加载更多数据
	$(window).scroll(function () {
		var lastDivH = $('.clist:last').offset().top + $('.clist:last').outerHeight();
		var windowH = $(window).height() + $(document).scrollTop();
		// console.log(lastDivH);
		// console.log(windowH);
		if (lastDivH == windowH) {
			console.log('加载更多');
			startIndex += 20;
			endIndex += 20;
			var ttRequestUrl1 = createRequestUrl("http://c.m.163.com/nc/article/headline/T1348647853363/",startIndex,endIndex);
			console.log(ttRequestUrl1);
			loadDatas(ttRequestUrl1,loadContentForUI);
		}
	});
});





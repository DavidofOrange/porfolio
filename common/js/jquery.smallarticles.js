$(function () {

	/* ------------------------------------------- */
	/* アンカーアニメーション */
	/* ------------------------------------------- */
	$(document).on("click", "a[href*='#']", function (e) {
		if ($("html").hasClass("menu-active")) {
			bodyFixReset();
			$("html").removeClass("menu-active");
		}
		let getHeight = $("#header").outerHeight(true);
		let speed = 500;
		let target = $(this.hash === "#" || this.hash === "" ? "html" : this.hash);
		let position = target.offset().top;
		$("body,html").animate({ scrollTop: position - getHeight }, speed, "swing");
		return false;
	});

	// 検索ボックスを完全にリセットする場合
	$(document).on("click","input[type='reset']", function (e) {
		$(this).closest(".common-area.search").find("input[type='checkbox'],input[type='radio']").each(function () {
			$(this).removeAttr("checked");
		});
		$(this).closest(".common-area.search").find("option").each(function () {
			$(this).removeAttr("selected");
		});
		$(this).closest(".common-area.search").find("input[type='text']").each(function () {
			$(this).removeAttr("value");
		});
	});

	// Wordpressの外観メニュー内に「popup」を使用する場合に設定
	// $(".popup").on("click",function (event) {
	// 	event.preventDefault();
	// 	let target = $("a", this).attr("href");
	// 	popup(target);
	// });

	// 全体的に右クリ禁止する場合
	// $(document).on("contextmenu", function (e) {
	// 	return false;
	// });

});

/* ------------------------------------------- */
/* ロード後の処理 */
/* ------------------------------------------- */
$(window).on("load", function () {

	// URLにハッシュがついていた場合
	let hash = location.hash;
	if (hash) {
		let getHeight = $("#header").outerHeight(true);
		let speed = 0;
		let target = $(hash);
		let position = target.offset().top;
		$("body,html")
			.delay(100)
			.animate({ scrollTop: position - getHeight }, speed, "swing");
	}

	// デザイン確認用(※スクロールバーを1pxにする)
	let query = location.search;
	if (query == "?deve=1") {
		$("html").addClass("deve");
	}

});

/* ------------------------------------------- */
/* スクロールの処理(リサイズ、ロードも含む) */
/* ------------------------------------------- */
$(window).on("load scroll resize", function () {
	let scroll = $(window).scrollTop();
	let doch = $(document).innerHeight();
	let winh = $(window).innerHeight();
	let scroll_judge01 = 50;
	let scroll_judge02 = (doch - winh) * 0.8;


	// 少しでもスクロールした場合(scroll_judge01)
	if (scroll > scroll_judge01) {
		$("html").addClass("scroll-now");
		$("#footer .pageup").fadeIn();
	} else if (scroll < scroll_judge01) {
		$("html").removeClass("scroll-now");
		$("#footer .pageup").fadeOut();
	}

	// ページ最後付近までスクロールさせた場合(scroll_judge02)
	if (scroll_judge02 <= scroll) {
		$("html").addClass("scroll-end");
	} else {
		$("html").removeClass("scroll-end");
	}

	// .moveFlagの位置を過ぎたら、クラスを付与(アニメーション用)
	$(".moveFlag").each(function () {
		let imgPos = $(this).offset().top;
		if (scroll > imgPos - winh + winh / 3) {
			$(this).addClass("on");
		} else if (scroll < imgPos - winh + winh / 3) {
			// $(this).removeClass("on");
		}
	});

});



/* ------------------------------------------- */
/* ポップアップ処理 */
/* ------------------------------------------- */
function popup(url) {
    let w = 1200;
    let h = 800;
    let left = (window.innerWidth - w) / 2 + window.screenX;
    let top = (window.innerHeight - h) / 2 + window.screenY;
    let popupWindow = window.open(url, "", "toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, scrollbars=yes, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
    popupWindow.resizeTo(w, h);
}

/* ------------------------------------------- */
/* メニューボタン処理 */
/* ------------------------------------------- */
function menu() {
	$(function () {
		$("html").toggleClass("menu-active");
		bodyFixJudge();
	});
}
function bodyFix() {
	const scrollPosi = $(window).scrollTop();
	$("html,body").css({
		position: "fixed",
		width: "100%",
		"z-index": "1",
		top: -scrollPosi,
	});
}
function bodyFixReset() {
	const scrollPosi = $("body").offset().top;
	$("html,body").css({
		position: "relative",
		width: "auto",
		top: "auto",
	});
	$("html, body").scrollTop(-scrollPosi);
}
function bodyFixJudge() {
	let getWidth = $(window).width();
	if (getWidth <= 767) {
		if ($("html").hasClass("menu-active")) {
			bodyFix();
		} else {
			bodyFixReset();
		}
	}
}

/* ------------------------------------------- */
/* viewport設定(iPad用) */
/* ------------------------------------------- */
var agent = window.navigator.userAgent.toLowerCase();
var ipad = agent.indexOf("ipad") > -1 || (agent.indexOf("macintosh") > -1 && "ontouchend" in document);
if (ipad == true) {
	viewportContent = "width=1300";
	document.querySelector("meta[name='viewport']").setAttribute("content", viewportContent);
}

$(function () {
	if (ipad == true) {
		$("html").addClass("view-ipad");
	}
});

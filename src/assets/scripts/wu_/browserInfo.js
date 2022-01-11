const browserInfo = [];
const ua = navigator.userAgent.toLowerCase();
const ver = navigator.appVersion.toLowerCase();

if(ua.indexOf("msie") != -1) {
	browserInfo.push("ie");
	
	if(ver.indexOf("msie 10.") != -1) {
		browserInfo.push(10);
	} else
	if(ver.indexOf("msie 9.") != -1) {
		browserInfo.push(9);
	} else {
		browserInfo.push(8);
		browserInfo.push("under");
	}
} else
if(ua.indexOf("trident") != -1) {
	browserInfo.push("ie");
	browserInfo.push(11);
	browserInfo.push("over");
} else
if(ua.indexOf("edge") != -1) {
	browserInfo.push("edge");
	browserInfo.push( parseInt( ua.slice(ua.lastIndexOf("/") + 1) ) );
} else
if(ua.indexOf("chrome") != -1) {
	browserInfo.push("chrome");
} else
if(ua.indexOf("safari") != -1) {
	browserInfo.push("safari");
} else
if(ua.indexOf("firefox") != -1) {
	browserInfo.push("firefox");
} else
if(ua.indexOf("opera") != -1) {
	browserInfo.push("opera");
}

export default browserInfo;

const deviceInfo = ["pc"];
const ua = navigator.userAgent.toLowerCase();

if(ua.indexOf("iphone") !== -1) {
	deviceInfo[0] = "sp";
	deviceInfo.push("ios");
	deviceInfo.push( (/os ([^\s]*) /).exec(ua)[1] );
	deviceInfo.push("iphone");
} else
if(
	ua.indexOf("ipad") !== -1 ||
	(ua.indexOf("macintosh") > -1 && "ontouchend" in document)
) {
	deviceInfo[0] = "sp";
	deviceInfo.push("ios");
	deviceInfo.push( (/os ([^\s]*) /).exec(ua)[1] );
	deviceInfo.push("ipad");
} else
if(ua.indexOf("ipod") !== -1) {
	deviceInfo[0] = "sp";
	deviceInfo.push("ios");
	deviceInfo.push( (/os ([^\s]*) /).exec(ua)[1] );
	deviceInfo.push("ipod");
} else
if(ua.indexOf("android ") !== -1) {
	deviceInfo[0] = "sp";
	deviceInfo.push("android");
	deviceInfo.push( (/android ([^\s]*);/).exec(ua)[1].replace(/\./g, "_") );
} else
if(ua.indexOf("windows phone ") !== -1) {
	deviceInfo[0] = "sp";
	deviceInfo.push("windows");
}

export default deviceInfo;

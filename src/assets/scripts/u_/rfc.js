// [RFC encode / decode]
export default {
	encodeRFC(str) {
		return encodeURIComponent(str).replace(/%20/g, "+");
	},
	decodeRFC(str) {
		return decodeURIComponent( str.replace(/\+/g, "%20") );
	}
};

import attachEventListener from "@@assets/scripts/wu_/attachEventListener";
import attachHoverStatus from "@@assets/scripts/wu_/attachHoverStatus";
import browserInfo from "@@assets/scripts/wu_/browserInfo";
import deviceInfo from "@@assets/scripts/wu_/deviceInfo";
import onDocumentReady from "@@assets/scripts/wu_/onDocumentReady";

export default {
	_version: PACKAGE_VERSION,
	
	/**
	 * バージョン情報を取得
	 * @returns {String}
	 */
	getVersion() {
		return this._version;
	},
	
	attachEventListener,
	attachHoverStatus,
	browserInfo,
	deviceInfo,
	onDocumentReady
};

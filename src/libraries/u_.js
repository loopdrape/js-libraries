import "../assets/scripts/u_/RegExp.escape";
import it from "../assets/scripts/u_/isType";
import utill from "../assets/scripts/u_/utill";
import mb from "../assets/scripts/u_/mb";
import qs from "../assets/scripts/u_/qs";
import fileInfo from "../assets/scripts/u_/fileInfo";
import rfc from "../assets/scripts/u_/rfc";
import mapRecursive from "../assets/scripts/u_/mapRecursive";

export default {
	_version: PACKAGE_VERSION,
	
	/**
	 * バージョン情報を取得
	 * @returns {String}
	 */
	getVersion() {
		return this._version;
	},
	
	...it,
	...utill,
	...mb,
	...qs,
	...fileInfo,
	...rfc,
	...mapRecursive
};

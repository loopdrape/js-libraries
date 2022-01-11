import { u_, wu_ } from "./_common";

const {
	onDocumentReady,
	browserInfo,
	deviceInfo
} = wu_;

onDocumentReady(() => {
	const $pageMainContent = document.getElementById("page_main_content");
	if($pageMainContent) {
		const ver = u_.getVersion();
		if(ver) {
			const $article = document.createElement("article");
			
			const $title = document.createElement("h2");
			$title.classList.add("icon-before");
			$title.setAttribute("data-icon", "arrow-r");
			$title.textContent = "u_ Version";
			$article.appendChild($title);
			
			const $paragraph = document.createElement("p");
			$paragraph.innerHTML = `<span>${ver}</span>`;
			$article.appendChild($paragraph);
			
			$pageMainContent.appendChild($article);
		}
		
		if( u_.isArray(browserInfo) ) {
			const $article = document.createElement("article");
			
			const $title = document.createElement("h2");
			$title.classList.add("icon-before");
			$title.setAttribute("data-icon", "arrow-r");
			$title.textContent = "Browser Info";
			$article.appendChild($title);
			
			const $paragraph = document.createElement("p");
			$paragraph.innerHTML = browserInfo.map(str => `<span>${str}</span>`).join("");
			$article.appendChild($paragraph);
			
			$pageMainContent.appendChild($article);
		}
		
		if( u_.isArray(deviceInfo) ) {
			const $article = document.createElement("article");
			
			const $title = document.createElement("h2");
			$title.classList.add("icon-before");
			$title.setAttribute("data-icon", "arrow-r");
			$title.textContent = "Device Info";
			$article.appendChild($title);
			
			const $paragraph = document.createElement("p");
			$paragraph.innerHTML = deviceInfo.map(str => `<span>${str}</span>`).join("");
			$article.appendChild($paragraph);
			
			$pageMainContent.appendChild($article);
		}
	}
	
	console.log("** document is ready.");
});

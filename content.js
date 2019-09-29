window.addEventListener('yt-navigate-finish', finishNav);

function finishNav() {
    const url = new URL(window.location);
    const params = new URLSearchParams(url.search);
    const v = params.get('v');
	if (v) {
		const chat = document.createElement('div');
		chat.setAttribute('class', 'this-is-parent-live-chat');
		chat.innerHTML = `
		<div class="live-chat">
		  <button class="live-chat-accord">Chat page:</button>
		  <div class="panel-live-chat">
			<div class="live-sub-chat"></div>
			<div class="livechat-sub">
			  <input class="live-sub-mess" type="text" placeholder="Message" value="">
			  <button class="live-sub-button">Submit</button>
			</div>
		  </div>
		</div>
		`;
		document.body.appendChild(chat);
		
		let port = chrome.runtime.connect({name: "videoID"});
		let users = 0;
		
		chat.querySelector('.live-sub-button').addEventListener('click', function () {
			let msgVal = document.querySelector(".live-sub-mess").value;
			if (msgVal) {
				port.postMessage({msgval: msgVal});
				document.querySelector(".live-sub-mess").value = "";
			}
		});
		chat.addEventListener("keyup", function(event) {
		  if (event.keyCode === 13) {
			event.preventDefault();
			chat.querySelector('.live-sub-button').click();
		  }
		});
		chat.querySelector('.live-chat-accord').addEventListener('click', function () {
			this.classList.toggle("active-live-chat");
			const panel = this.nextElementSibling;
			panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
		});
		

		port.postMessage({vid: v});
		
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				var chatHistory = document.getElementsByClassName("live-sub-chat")[0];
				chatHistory.scrollTop = chatHistory.scrollHeight;

				if (request.update) {
					let status = (parseInt(request.update) > parseInt(users)) ? "joined" : "left";
					document.querySelector(".live-sub-chat").innerHTML += "<p>A user has " + status + " the chat!</p>";
				}
				if (request.message) {
					document.querySelector(".live-sub-chat").innerHTML += "<p>" + request.message + "</p>";
				}
		});

	} else if(document.querySelector(".this-is-parent-live-chat")) {
		document.querySelector(".this-is-parent-live-chat").remove();
	}
}

finishNav();


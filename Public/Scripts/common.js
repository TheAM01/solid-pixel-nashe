function successPopup(message) {

	let msg = document.createElement("div")

	msg.setAttribute("class", "success");
	// msg.setAttribute("id", "success_popup");
	msg.innerText = message;

	document.getElementById("body").appendChild(msg);

	setTimeout(() => {
		Array.from(document.getElementsByClassName("success"))
			.forEach(popup => {
				// popup.remove();
			})
	}, 3*1000);

}

function setCookie(cname, cvalue, exdays) {

	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));

	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}

function getCookie(cname) {

	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');

	for(let i = 0; i <ca.length; i++) {

		let c = ca[i];

		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}

		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}

	}

	return "";

}

function element(name, className, attributes, innerText) {

	const element = document.createElement(name);
	element.setAttribute("class", className);

	if (attributes) {

		Object.keys(attributes).forEach(attr => {
			element.setAttribute(attr, attributes[attr]);
		});

	}

	if (!!innerText) {
		element.innerText = innerText;
	}

	return element;

}

function appendChildren(element, children) {
	children.forEach(c => {
		element.appendChild(c);
	});
}

function truncate(str, n) {
	return (str.length > n) ? str.slice(0, n-1) + '...' : str;
}

function round(num,pre) {
	return Math.ceil(num/pre)*pre;
}

function successPopup(message) {

	let msg = document.createElement("div")

	msg.setAttribute("class", "success");
	// msg.setAttribute("id", "success_popup");
	msg.innerHTML = message;

	document.getElementById("body").appendChild(msg);

	setTimeout(() => {
		Array.from(document.getElementsByClassName("success"))
			.forEach(popup => {
				popup.remove();
			})
	}, 3*1000);

}

function calculateAge(milliseconds) {
	// Number of milliseconds in a year and a day
	const millisecondsPerYear = 31536000000;
	const millisecondsPerDay = 86400000;

	// Calculate total years and remaining milliseconds
	const years = Math.floor(milliseconds / millisecondsPerYear);
	const remainingMilliseconds = milliseconds % millisecondsPerYear;

	// Calculate days from the remaining milliseconds
	const days = Math.floor(remainingMilliseconds / millisecondsPerDay);

	// Format the output
	return `${years} years, ${days} days`;
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

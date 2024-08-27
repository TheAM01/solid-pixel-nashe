function listenForUpdatesOnSellProductForm() {

	let children = Array.prototype.slice.call(document.getElementById('sell_form').children);

	children.forEach((child) => {
		child.addEventListener('input', doThing);
	});

}

function doThing(child) {

	const target = this.className.split(" ")[0].replaceAll("sf", "sfpr");
	const type = this.className.split(" ")[0].replaceAll("sf_", "");


	const handler = {

		id (value) {

			if (!!products.find(p => p.toLowerCase() === value.toLowerCase())) {

				document.getElementById("sfpr_submit").setAttribute("type", "hidden");
				const error = element("span", "error_message", {"id": "sfpr_error"})
				error.innerText = `ID "${value}" already exists. Please try to use a unique ID.`
				document.getElementById("sell_form").append(error);

			} else {
				if (!document.getElementById("sfpr_error")) return
				document.getElementById("sfpr_error").remove()
				document.getElementById("sfpr_submit").setAttribute("type", "submit");

			}

			document.getElementById("sfpr_gallery").setAttribute("href", `/gallery/${value}`)
			return

		},

		title (value) {
			document.getElementById("sfpr_gallery").innerText = `Visit ${value} gallery↗`
			document.getElementById(target).innerText = value;
		},

		price (value) {
			document.getElementById(target).innerText = `Rs ${value}`;
		},

		thumbnail (value) {
			document.getElementById(target).setAttribute("src", value);
		},

		category (value) {

			if (value.toLowerCase === "other") {

				document.getElementById("sfpr_submit").setAttribute("type", "hidden");
				const error = element("span", "error_message", {"id": "sfpr_error"})
				error.innerText = `Please select a valid category.`
				document.getElementById("sell_form").append(error);

			} else {

				if (!document.getElementById("sfpr_error")) return
				document.getElementById("sfpr_error").remove()
				document.getElementById("sfpr_submit").setAttribute("type", "submit");

			}

			document.getElementById(target).innerText = value;
			document.getElementById(target).setAttribute("href", `/category/${value.toLowerCase().replaceAll(" ", "-")}`);

		},

		content (value) {
			document.getElementById(target).innerText = value;
		},

		description (value) {
			document.getElementById(target).innerText = value;
		},



	}

	handler[type](this.value);

}
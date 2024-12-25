function getCategories(socket) {

	socket.emit("get_categories");

	socket.on("get_categories", (data) => {

		data.forEach(category => {

			const link = element("a", "ctls_link", {"href": `/category/${category.replaceAll(" ", "-")}`});
			link.innerText = category;
			document.getElementById("categories").appendChild(link);

		})
	});

}

function getCategory(socket) {

	const urx = new URL(window.location.href);
	const pr = (urx.pathname.split('/')[2]);

	document.title = `${capitalizeFirstLetter(pr.replaceAll('-', ' '))} (category) - Saste Nashe`;

	socket.emit("get_category", pr.toLowerCase().replaceAll("-", " "));

	socket.on("get_category", (data) => {

		document.getElementById("cat_head").innerHTML = `📃 Products of <span class="capitalize emphasis">${pr.replaceAll("-", ' ')}</span> category`;

		data.forEach(category => {

			const link = element("a", "ctls_link", {"href": `/products/${category.id}`});
			link.innerText = category.name;
			document.getElementById("category").appendChild(link);

		});

	});

}
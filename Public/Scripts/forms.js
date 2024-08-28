function checkRedirection() {
	const urlParams = new URLSearchParams(window.location.search);
	document.getElementById('redirect').value = urlParams.get('redirect-to');
}

function processSearch(socket) {
	const urlParams = new URLSearchParams(window.location.search);
	const searchQuery = urlParams.get('q');

	document.getElementById('search').value = searchQuery;

	socket.emit('search_results', (searchQuery));
	socket.on('search_results', data => {

		if (!data.results[0])
			return document.getElementById('search_results').innerText = "No results found, try another query!"

		for (const result of data.results) {

			const wrapper = element('a', 'srrs_wrapper', {href: `/products/${result.id}`});
			const thumbnail = element('img', 'srrs_thumbnail', {src: result.thumbnail});
			const title = element('div', 'srrs_name', null, result.name);
			const price = element('div', 'srrs_price');
			const exPrice = element('span', 'strikethrough', null, `Rs ${round((parseInt(result.price)+300), 500)}`);
			price.appendChild(exPrice);
			price.append(`Rs ${result.price}`);

			const details = element('div', 'srrs_details');

			appendChildren(details, [title, price]);
			appendChildren(wrapper, [thumbnail, details]);

			document.getElementById('search_results').appendChild(wrapper);

		}
	});
}
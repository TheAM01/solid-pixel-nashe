function homeProducts(socket) {

    socket.emit("home_products");

    socket.on("home_products", (data) => {
        
        const categories = [];

        data.forEach(product => {
            console.log(product.id);

            const parent = element('a', 'home_product_parent', {"href": `${product.url}`});
            
            const thumbnailParent = element('div', 'hmpr_thumbnail_parent');

            const thumbnail = element('img', 'hmpr_thumbnail', {"src": product.thumbnail});

            const title = element('div', "hmpr_title");
            title.innerText = product.name;

            const price = element('div', 'hmpr_price');
            price.innerText = product.price;

            appendChildren(thumbnailParent, [thumbnail]);

            appendChildren(parent, [
                thumbnailParent,
                title,
                price
            ]);

            document.getElementById("products").appendChild(parent);

            if (!categories.includes(product.category)) {
                categories.push(product.category)
            }

        });

        categories.forEach(c => {

            const categoryParent = element('a', 'category_table_element', {"href": `/category/${c}`});
            categoryParent.innerText = c;

            document.getElementById("ctrt").appendChild(categoryParent);
            
        })
        
    });

}

function element(name, className, attributes) {

    const element = document.createElement(name);
    element.setAttribute("class", className);

    if (attributes) {

        Object.keys(attributes).forEach(attr => {
            element.setAttribute(attr, attributes[attr]);
        })
    }

    return element;

}

function appendChildren(element, children) {

    children.forEach(c => {
        element.appendChild(c);
    });

}
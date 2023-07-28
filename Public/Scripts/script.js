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
            if (product.content[0].length > 20) product.content[0] = truncate(product.content[0], 30)
            title.innerText = `${product.name} - ${product.content[0]}`;

            const price = element('div', 'hmpr_price');

            const exPrice = element('span', 'strikethrough');
            exPrice.innerText = `Rs ${round(product.price, 500)}`;

            price.appendChild(exPrice);
            price.append(`Rs ${product.price}`)

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

function productPage(socket) {

    const urx = new URL(window.location.href);
    const pr = (urx.pathname.split('/')[2]);

    socket.emit("product", (pr));

    socket.on("product", (data) => {

        console.log(data)

        const parent = element("div", "product_details_parent");

        const thumbnailParent = element("div", "prdt_thumbnail_parent");

        const thumbnail = element("img", "prdt_thumbnail", {"src": data.thumbnail});
        
        const title = element("div", "prdt_title");
        title.innerText = data.name;

        const price = element("div", "prdt_price");
        price.innerText = `Rs ${data.price}`;

        const description = element("div", "prdt_description prdt_field");
        description.innerText = data.description;

        const gallery = element("a", "prdt_gallery prdt_field", {"href": `/gallery/${data.id}`});
        gallery.innerText = `Visit ${data.name} gallery ↗`

        const category = element("a", "prdt_category prdt_field");
        const categoryCategory = element("a", "prdt_category_link", {"href": `/category/${data.category.replaceAll(" ", "-")}`})
        categoryCategory.innerText = `${data.category} ↗`;

        category.append("Category:")
        category.appendChild(categoryCategory)

        const content = element("div", "prdt_content prdt_field");
        content.innerText = `Content: ${data.content.join(", ")}`

        const reviewsParent = element("div", "prdt_reviews_parent");

        const reviewHead = element("span", "heading");
        reviewHead.innerText = "Reviews: "
        reviewHead.style.margin = "10px 0 10px 0"

        const reviews = []


        data.reviews.forEach(r => {

            const reviewParent = element('div', 'prdt_review_parent');

            const reviewTop = element('div', 'prdt_review_top');

            const reviewAuthor = element('div', 'prdt_review_author');
            reviewAuthor.innerText = r.author;

            const reviewStars = element('div', 'prdt_review_stars');
            reviewStars.innerText = "⭐".repeat(parseInt(r.stars));

            const reviewContent = element('div', 'prdt_review_content');
            reviewContent.innerText = r.content;

            appendChildren(reviewTop, [
                reviewAuthor,
                reviewStars
            ]);

            appendChildren(
                reviewParent,
                [
                    reviewTop,
                    reviewContent
                ]
            );

            reviews.push(reviewParent)

        });

        appendChildren(thumbnailParent, [
            thumbnail
        ]);

        appendChildren(reviewsParent, reviews)

        appendChildren(parent, [
            thumbnailParent,
            title,
            price,
            description,
            gallery,
            category,
            content,
            reviewHead,
            reviewsParent
        ])

        appendChildren(document.getElementById("main"), [parent])

    })
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

function truncate(str, n){
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};

function round(num,pre) {
    return Math.ceil(num/pre)*pre
}
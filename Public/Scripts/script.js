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

            const categoryParent = element('a', 'category_table_element', {"href": `/category/${c.replaceAll(" ", "-")}`});
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
        const backButton = element("button", "back_button", {"onclick": "history.back()"});
        backButton.innerText = "⬅ Go back";

        const parent = element("div", "product_details_parent");

        const thumbnailParent = element("div", "prdt_thumbnail_parent");

        const thumbnail = element("img", "prdt_thumbnail", {"src": data.thumbnail});
        
        const title = element("div", "prdt_title");
        title.innerText = data.name;

        const price = element("div", "prdt_price");
        price.innerText = `Rs ${data.price}`;

        const buttonParent = element("div", "prdt_buy_options prdt_field");
        let amountField = element("input", "amount_field", {"type": "number", "placeholder": "Amount", "min": "1", "max": "10", "id": "cart_quantity"});
        let addToCartButton = element("button", "add_to_cart_button", {"onclick": `addToCart(${JSON.stringify(data)})`});
        addToCartButton.innerText = "Add to cart"

        appendChildren(buttonParent, [amountField, addToCartButton]);

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
            backButton,
            thumbnailParent,
            title,
            price,
            buttonParent,
            description,
            gallery,
            category,
            content,
            reviewHead,
            reviewsParent
        ])

        appendChildren(document.getElementById("main"), [parent])

        document.title = `${data.name} - SasteNashe - Solid Pixel`

    })
}

function addToCart(item) {

    let cartRaw = getCookie("cart");
    let cart;
    // let item = JSON.parse(i)
    console.log({cart: cartRaw, item: item.id});
  
    let qty = Math.abs(parseInt(document.getElementById("cart_quantity").value)) || 1;
  
    if (!cartRaw) {
      console.log("Cart is empty.")
      let cart = [{
        id: item.id,
        quantity: qty,
        price: parseInt(item.price),
        sum: parseInt(item.price)*qty
      }];
      successPopup(`Successfully added ${qty} ${item.id} to cart!`)
      return setCookie("cart", JSON.stringify(cart), 30)
    }
  
    cart = JSON.parse(cartRaw);
    let existing = cart.find(i => i.id === item.id);
  
    if (existing) {
  
      existing.quantity+=qty;
      existing.sum = existing.price*existing.quantity;
  
    } else {
  
      cart.push({
        id: item.id,
        quantity: qty,
        price: parseInt(item.price.toLowerCase().replaceAll("rs ", "")),
        sum: parseInt(item.price.toLowerCase().replaceAll("rs ", ""))*qty
      })
  
    }
  
    successPopup(`Successfully added ${qty} ${item.id} to cart!`)
  
    return setCookie("cart", JSON.stringify(cart), 30)
  
}

function getCategories(socket) {

    socket.emit("get_categories");

    socket.on("get_categories", (data) => {
        console.log(data);

        data.forEach(category => {
            const link = element("a", "ctls_link", {"href": `/category/${category.replaceAll(" ", "-")}`});
            link.innerText = category;
            document.getElementById("categories").appendChild(link)
        })
    });

}

function getCategory(socket) {
    const urx = new URL(window.location.href);
    const pr = (urx.pathname.split('/')[2]);
    console.log(pr);

    socket.emit("get_category", pr.toLowerCase().replaceAll("-", " "));

    socket.on("get_category", (data) => {
        console.log(data);

        data.forEach(category => {
            const link = element("a", "ctls_link", {"href": `/products/${category.id}`});
            link.innerText = category.name;
            document.getElementById("category").appendChild(link)
        });
    });
}
  
function successPopup(message) {

    let msg = document.createElement("div")
    msg.setAttribute("class", "success");
    msg.setAttribute("id", "success_popup")
    msg.innerText = message;
    document.getElementById("body").appendChild(msg);

    setTimeout(() => {document.getElementById("success_popup").remove()}  , 3*1000)
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
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  
}
  
function removeFromCart(id) {
  
    const cart = JSON.parse(getCookie("cart"));
  
    console.log(cart);
  
    const index = cart.findIndex(i => i.id.toLowerCase() === id.toLowerCase());
    if (index > -1) { // only splice array when item is found
      cart.splice(index, 1); // 2nd parameter means remove one item only
    }
  
    console.log(cart);
  
    successPopup(`Removed ${id} from cart.`)
  
    setCookie("cart", JSON.stringify(cart), 30);
    setTimeout(() => {window.location.reload()}, 5000)
}
  
function checkout() {
    let c = getCookie("cart");
    if (!c) return 
    setCookie("cart", JSON.stringify({}), 0)
    successPopup("Your items will be delivered to your adddress within 5 business days.");
    setTimeout(() => {window.location.reload()}, 5000)
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
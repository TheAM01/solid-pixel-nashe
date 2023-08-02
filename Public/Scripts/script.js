function backgroundProcesses() {
    
    // check if mobile;

    if (window.screen.width <= 800) {

        const navigation = element("div", "screen_nav");
        
        const home = element("a", "screen_nav_element", {"href": "/products"});
        home.append(
            element("img", "screen_nav_icon", {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Home-icon.svg/1024px-Home-icon.svg.png"})
        );

        const categories = element("a", "screen_nav_element", {"href": "/category"});
        categories.append(
            element("img", "screen_nav_icon", {"src": "https://pixlok.com/wp-content/uploads/2021/12/Apps-Icon-SVG-93nd.png"})
        );

        const cart = element("a", "screen_nav_element", {"href": "/cart"});
        cart.append(
            element("img", "screen_nav_icon", {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Font_Awesome_5_solid_shopping-cart.svg/1152px-Font_Awesome_5_solid_shopping-cart.svg.png"})
        );

        const account = element("a", "screen_nav_element", {"href": "/account"});
        account.append(
            element("img", "screen_nav_icon", {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Ic_account_circle_48px.svg/1200px-Ic_account_circle_48px.svg.png"})
        );

        appendChildren(navigation, [
            home,
            categories,
            cart,
            account
        ]);

        appendChildren(document.getElementById("body"), [navigation])
    };

    // advertsimetn

    const adBanner = document.getElementById("ad_banner");
    if (!!adBanner) {
        socket.emit("get_ad");
        socket.on("get_ad", (data) => {
            document.getElementById("ad_banner").setAttribute("href", data.url)
            document.getElementById("ad_img").setAttribute("src", data.thumbnail)
        });
    }
}

function homeProducts(socket) {

    socket.emit("home_products");

    socket.on("home_products", (data) => {
        
        const categories = [];

        data.forEach(product => {

            const parent = element('a', 'home_product_parent', {"href": `${product.url}`});
            
            const thumbnailParent = element('div', 'hmpr_thumbnail_parent');

            const thumbnail = element('img', 'hmpr_thumbnail', {"src": product.thumbnail});

            const title = element('div', "hmpr_title");
            if (product.content[0].length > 20) product.content[0] = truncate(product.content[0], 30);
            title.innerText = `${product.name}`;

            const content = element("div", "hmpr_content");
            content.innerText = `${product.content[0]}`;

            const price = element('div', 'hmpr_price');

            const exPrice = element('span', 'strikethrough');
            exPrice.innerText = `Rs ${round((parseInt(product.price)+300), 500)}`;

            price.appendChild(exPrice);
            price.append(`Rs ${product.price}`)

            appendChildren(thumbnailParent, [thumbnail]);

            appendChildren(parent, [
                thumbnailParent,
                title,
                content,
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

        const reviewHead = element("span", "heading invert");
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

        const author = element("a", "prdt_field prdt_author prdt_gallery", {"href": `/${data.author || "admin"}`});
        author.innerText = `Seller: ${data.author || "Admin"}`

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
            reviewsParent,
            author
        ])

        appendChildren(document.getElementById("main"), [parent])

        document.title = `${data.name} - SasteNashe - Solid Pixel`

    })
}

function addToCart(item) {

    let cartRaw = getCookie("cart");
    let cart;
    // let item = JSON.parse(i)
  
    let qty = Math.abs(parseInt(document.getElementById("cart_quantity").value)) || 1;
  
    if (!cartRaw) {
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

    socket.emit("get_category", pr.toLowerCase().replaceAll("-", " "));

    socket.on("get_category", (data) => {

        data.forEach(category => {
            const link = element("a", "ctls_link", {"href": `/products/${category.id}`});
            link.innerText = category.name;
            document.getElementById("category").appendChild(link)
        });

    });
}

function buildCart() {

    let cart = getCookie("cart");
    let items, total;

    if (!cart) {
        const image = element("img", "empty_cart_image", {"src": "https://cdni.iconscout.com/illustration/free/thumb/free-empty-cart-4085814-3385483.png"});
        let w = element("span", "heading center");
        w.innerText = "Your cart is empty!"
        document.getElementById("cart").append(image);
        return document.getElementById("cart").append(w)
    }

    cart = JSON.parse(cart);

    if (cart.length === 0) {
        const image = element("img", "empty_cart_image", {"src": "https://cdni.iconscout.com/illustration/free/thumb/free-empty-cart-4085814-3385483.png"});
        let w = element("span", "heading center");
        w.innerText = "Your cart is empty!"
        document.getElementById("cart").append(image);
        return document.getElementById("cart").append(w);
    }

    total = 0;
    cart.forEach(i => {
        total += i.sum;
    });

    socket.emit("home_products");
    socket.on("home_products", (data) => {

        cart.forEach(i => {

            const matchedProduct = data.find(k => k.id === i.id);

            const parent = element("div", "cart_item_parent");
    
            const thumbnailParent = element("div", "crit_thumbnail_parent");
    
            const thumbnail = element("img", "crit_thumbnail", {"src": matchedProduct.thumbnail});
    
            const rightWrapper = element("div", "crit_right");
    
            const title = element("div", "crit_title crit_cell");
            title.innerText = matchedProduct.name;
    
            const price = element("div", "crit_price crit_cell");
            price.innerText = `Price: ${i.price}`;
    
            const quantity = element("div", "crit_quantity crit_cell");
            quantity.innerText = `Quantity: ${i.quantity}`;
    
            const sum = element("div", "crit_sum");
    
            const remove = element("button", "remove_from_cart", {"onclick": `removeFromCart('${i.id}')`});
            remove.innerText = "Remove from cart"
    
            sum.append(remove);
            sum.append(`Total: Rs: ${i.sum}`);
    
            appendChildren(rightWrapper, [title, price, quantity, sum]);
            appendChildren(thumbnailParent, [thumbnail]);
            appendChildren(parent, [thumbnailParent, rightWrapper]);
            appendChildren(document.getElementById("cart"), [parent]);
        });

        const totalDiv = element("div", "cart_total");
        totalDiv.innerText = `Your cart total is: Rs ${total}/-`;

        const checkout = element('button', "checkout_button", {"onclick": "checkout()"});
        checkout.innerText = "Check out";

        document.getElementById("cart").appendChild(totalDiv);
        document.getElementById("cart").appendChild(checkout);

    });

}

function listenForUpdatesOnSellProductForm() {
    
    let children = Array.prototype.slice.call( document.getElementById('sell_form').children )
    children.forEach((child) => {
        child.addEventListener('input', doThing);
    });
    
}

function doThing(child) {
    const target = this.className.split(" ")[0].replaceAll("sf", "sfpr");
    const type = this.className.split(" ")[0].replaceAll("sf_", "");

    const handler = {
        id(value) {
            if (!!products.find(p => p.toLowerCase() === value.toLowerCase())) {
                document.getElementById("sfpr_submit").setAttribute("type", "hidden");
                const error = element("span", "error_message", {"id": "sfpr_error"})
                error.innerText = `ID "${value}" already exists. Please try to use a unique ID.`
                document.getElementById("sell_form").append(error);
            } else {
                document.getElementById("sfpr_error").remove()
                document.getElementById("sfpr_submit").setAttribute("type", "submit")
            }
            document.getElementById("sfpr_gallery").setAttribute("href", `/gallery/${value}`)
            return
        },
        title(value) {
            document.getElementById("sfpr_gallery").innerText = `Visit ${value} gallery↗`
            document.getElementById(target).innerText = value;
        },
        price(value) {
            document.getElementById(target).innerText = `Rs ${value}`;
        },
        thumbnail(value) {
            document.getElementById(target).setAttribute("src", value);
        },
        category(value) {
            document.getElementById(target).innerText = value;
            document.getElementById(target).setAttribute("href", `/category/${value.toLowerCase().replaceAll(" ", "-")}`);
        },
        content(value) {
            document.getElementById(target).innerText = value;
        },
        description(value) {
            document.getElementById(target).innerText = value;
        }
    }

    handler[type](this.value)
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
  
    const index = cart.findIndex(i => i.id.toLowerCase() === id.toLowerCase());
    if (index > -1) { // only splice array when item is found
      cart.splice(index, 1); // 2nd parameter means remove one item only
    }
  
    successPopup(`Removed ${id} from cart.`)
  
    setCookie("cart", JSON.stringify(cart), (30));
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
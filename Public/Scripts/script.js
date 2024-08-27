function backgroundProcesses() {
    
    // check if mobile;
    // i wish my hands and fingers worked correctly


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
    }

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

            if (!categories.includes(product.category.toLowerCase())) {
                categories.push(product.category.toLowerCase())
            }

        });

        categories.sort();

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

        if (data === 404) return window.location.replace("/*")

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

            reviews.push(reviewParent);
           
        });

        const addReview = element("input", "add_review_input", {"type": "text", "id": "add_review_field", "placeholder": "Add your own review"});

        const sh = element("div", "stars_selection_before");
        sh.innerText = "⭐";


        const stars = element("select", "stars_selection", {"name": "stars", "id": "add_review_stars"});

        let s1 = element("option", "s", {"value": "1"});
        s1.innerText = "1";

        let s2 = element("option", "s", {"value": "2"});
        s2.innerText = "2";

        let s3 = element("option", "s", {"value": "3"});
        s3.innerText = "3";

        let s4 = element("option", "s", {"value": "4"});
        s4.innerText = "4";

        let s5 = element("option", "s", {"value": "5", "selected": "true"});
        s5.innerText = "5";


        appendChildren(stars, [
            s1,
            s2,
            s3,
            s4,
            s5
        ]);
        

        const submitReview = element("button", "submit_review", {"onclick": "submitReview()", "id": "submit_review"});
        submitReview.innerText = "Submit";


        const reviewPseudoForm = element("div", "review_form");
        appendChildren(reviewPseudoForm, [sh, stars, addReview, submitReview]);

        reviews.push(reviewPseudoForm)

        const author = element("a", "prdt_field prdt_author prdt_gallery", {"href": `/u/${data.seller || "admin"}`});
        author.innerText = `Seller: ${data.seller || "Admin"}`

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

function getRecentlySold(socket) {
    socket.emit('recents');

    socket.on('recents', async (data) => {
        console.log(data)
        if (!data[0]) {
            document.getElementById('recently-sold')
                .innerText = 'Nothing sold yet :\'(';
            return;
        }

        for (const product of data) {
            const wrapper = element('div', 'rs_wrapper');
            const image = element('img', 'rs_thumbnail', {src: product.data.thumbnail});
            const title = element('div', 'rs_name', {}, `Item: ${product.data.name}`);
            const qty = element('div', 'rs_qty', {}, `Quantity: ${product.quantity}`);
            const time = element('div', 'rs_time', {}, `Time: ${product.timestamp}`);

            appendChildren(wrapper, [image, title, qty, time]);

            document.getElementById('recently-sold').appendChild(wrapper);
        }


    });
}

function fillCategories(socket) {

    socket.emit("home_products");
    socket.on("home_products", (data) => {

        const categories = [];

        data.forEach(item => {

            if (!categories.includes(item.category.toLowerCase())) {
                categories.push(item.category.toLowerCase())
            }

        });

        categories.sort();
        
        categories.forEach(category => {
            const option = element("option", "category_option", {"value": category});
            option.innerText = category;
            
            document.getElementById("product_category").appendChild(option)
        });

    });

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
      return setCookie("cart", JSON.stringify(cart), 30);

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
      });
  
    }
  
    successPopup(`Successfully added ${qty} ${item.id} to cart!`)
  
    return setCookie("cart", JSON.stringify(cart), 30);
  
}

function buildCart() {

    let cart = getCookie("cart");
    let items, total;

    if (!cart) {
        const image = element("img", "empty_cart_image", {"src": "https://cdni.iconscout.com/illustration/free/thumb/free-empty-cart-4085814-3385483.png"});
        let w = element("span", "heading center");

        w.innerText = "Your cart is empty!";
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

function submitReview() {

    const review = document.getElementById("add_review_field").value;
    const stars = document.getElementById("add_review_stars").value;

    if (!review) return;

    console.log([review, stars]);

}

function removeFromCart(id) {

    const cart = JSON.parse(getCookie("cart"));

    const index = cart.findIndex(i => i.id.toLowerCase() === id.toLowerCase());
    if (index > -1) { // only splice array when item is found
      cart.splice(index, 1); // 2nd parameter means remove one item only
    }

    successPopup(`Removed ${id} from cart.`)

    setCookie("cart", JSON.stringify(cart), (30));

    setTimeout(() => {window.location.reload()}, 5000);

}

function checkout() {

    let c = getCookie("cart");

    if (!c) return;

    fetch('/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: (c) // Convert data to JSON string
    })
        .then(response => response.json()) // Parse the JSON from the response
        .then(result => {
            console.log('Success:', result);
            // Handle the result
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle the error
        });

    // setCookie("cart", JSON.stringify({}), 0);

    successPopup("Your items will be delivered to your adddress within 5 business days.");

    setTimeout(() => {window.location.href = "/"}, 5000);

}



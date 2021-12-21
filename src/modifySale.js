const salesDB = require("./database/sales.js");
var id = "";
var sale = {};
var items = [];

window.onload = () => {
    salesDB.init();

    //Get our sale id from the url
    id = new URLSearchParams(window.location.search).get("id");
    if(id != ""){
        readSale().then((result) => {
            populateCart();
            updatePrice();
        }).catch((error) => {
            document.getElementById("saleInvalid").style.display = "block";
        });
    }
}

//Read the sale into memory from the database
function readSale() {
    return new Promise((resolve, reject) => {
        console.log("Sale id = " + id);
        salesDB.get({_id: id}).then((result) => {
            var i = 0;
            sale = result[0];
            for(var j in result[0].items) {
                items[i] = result[0].items[j];
                i++;
            }
            resolve(true);
        }).catch((error) => {
            reject(error);
        });
    })
}

//Update the price tally
function updatePrice() {
    var price = 0;
    for(var i in items) {
        price += items[i].item.price * items[i].amount;
    }

    if(typeof(price) != "number" || isNaN(price)){price = "-";}
    document.getElementById("totalPrice").innerHTML = "$" + price;
    return price;
}

//Populate the cart table
function populateCart() {
    var table = document.getElementById("cart");
    table.innerHTML = "<tr><th>Name</th><th>Description</th><th>Item Price</th><th>Amount</th><th></th></tr>";
    for(var i in items) {
        var row = table.insertRow(1);
        row.insertCell(0).innerHTML = items[i].item.name;
        row.insertCell(1).innerHTML = items[i].item.description;
        row.insertCell(2).innerHTML = "$ <input id='price" + i + "' type='number' value='" + items[i].item.price + "'></input>";
        row.insertCell(3).innerHTML = "<input id='amount" + i + "' type='number' value='" + items[i].amount + "'></input>";
        row.insertCell(4).innerHTML = "<button onclick=" + "'removeItem(" + '"' + i + '"' + ")'" + ">Remove</button>";
        document.getElementById("price" + i).addEventListener("input", function(i) {
            items[parseInt(i.target.id.split("price")[1])].item.price = parseInt(i.target.value);
            updatePrice();
        });
        document.getElementById("amount" + i).addEventListener("input", function(i) {
            items[parseInt(i.target.id.split("amount")[1])].amount = parseInt(i.target.value);
            updatePrice();
        });
    }
    document.getElementById("saleValid").style.display = "block";

    document.getElementById("itemsInCart").innerHTML = items.length;
}

//Remove an item from the cart
function removeItem(index) {
    items.splice(index, 1);
    populateCart();
    updatePrice();
}

//Update the sale
function saveSale() {
    sale.items = {};
    for(var i in items) {
        sale.items[items[i]._id] = items[i];
        if(typeof(items[i].item.price) != "number" && items[i].item.price != NaN){showPopup("Whoops!", "Please enter a value in the price for item " + items[i].item.name); return;}
        if(typeof(items[i].amount) != "number" && items[i].item.price != NaN){showPopup("Whoops!", "Please enter a value in the amount for item " + items[i].item.name); return;}
    }

    sale.totalCost = updatePrice();

    salesDB.remove(id).then(() => {
        salesDB.database.insert(salesDB.db, {
            "_id": id,
            "date": sale.date,
            "items": sale.items,
            "employeeId": sale.employeeId,
            "customerId": sale.customerId,
            "totalCost": sale.totalCost
        }).then((result) => {
            showPopup("Done!", "The order has been updated").then(() => {
                window.location.reload();
            });
        }).catch((error) => {
            console.log(error);
            showPopup("Something Happened..", "Sorry we had a problem saving the sale");
        });
    }).catch((error) => {
        console.log(error);
        showPopup("Something Happened..", "Sorry we had a problem saving the sale");
    });
}
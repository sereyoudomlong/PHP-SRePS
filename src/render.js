/**
 * Main front end javascript
 */


//Show a pretty popup window for a bit
function showPopup(title, text) {
    return new Promise((resolve, reject) => {
        document.getElementById("popupTitle").innerHTML = title;
        document.getElementById("popupText").innerHTML = text;
        document.getElementById("popup").style.display = "block";
        setTimeout(() => {document.getElementById("popup").style.opacity = 1;}, 100);
        setTimeout(() => {
            document.getElementById("popup").style.opacity = 0;
            setTimeout(() => {document.getElementById("popup").style.display = "none"; resolve(true);}, 600);
        }, 2000);
    });
}

//Randomly add some fake stock
function randomAddStock() {
    const stockDB = require("./database/stock.js");
    stockDB.init();
    stockDB.add("banana", "a banana", 2, Math.floor(Math.random() * 100) + 1);
    stockDB.add("apple", "a apple", 2, Math.floor(Math.random() * 100) + 1);
    stockDB.add("soup", "a soup", 2, Math.floor(Math.random() * 100) + 1);
    stockDB.add("lip stick", "a lip stick", 10, Math.floor(Math.random() * 100) + 1);
    stockDB.add("facial cream", "a facial cream", 3, Math.floor(Math.random() * 100) + 1);
    stockDB.add("water", "a water", 1, Math.floor(Math.random() * 100) + 1);
    stockDB.add("coke", "a coke", 3, Math.floor(Math.random() * 100) + 1);
    stockDB.add("fanta", "a fanta", 3, Math.floor(Math.random() * 100) + 1);
    stockDB.add("bread", "a bread", 2, Math.floor(Math.random() * 100) + 1);
}

//Randomly add some random sales
function randomAddSalesRecord(amount = 200) {
    const stockDB = require("./database/stock.js");
    const saleDB = require("./database/sales.js");
    stockDB.init();
    saleDB.init();

    stockDB.get({}).then((result) => {
        var itemIds = [];
        for(var i in result) {
            itemIds.push(result[i]._id);
        }
        console.log("Adding records this may take some time..");
        for(var i = 0; i < amount; i++) {
            var itemsInSale = {};
            for(var j = 0; j < Math.floor(Math.random() * 500) + 1; j++) {
                var itemId = itemIds[Math.floor(Math.random() * itemIds.length - 1)];
                itemsInSale[itemId] =  Math.floor(Math.random() * 50) + 1;
            }
            saleDB.add(itemsInSale, stockDB, "default", "default", new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2012, 0, 1).getTime()))).then((result) => {
                console.log(result);
            });
        }
    });
}
/**
 * Sales.js
 * The sales record handler for recording sales records to the database
 */

module.exports = {
    //Init the database
    init: function(stockDatabase) {
        this.database = require("./database.js");
        this.db = this.database.createDatabase("sales");
    },

    /**
     * Add a sales item to the database
     * @param itemIds is an object containing each id, amount pair {<id>: <amount>}
     * @param employeeId is the id of the employee who completed this order. Defaults to store
     * @param customerId is the id of the customer for this order. Defaults to customer
     * @param date the date of the record. Defaults to the current date
     * 
     * Returns a promise
     **/
    add: function(itemIds, stockDatabase, employeeId = "default", customerId = "default", date = new Date()) {
        return new Promise((resolve, reject) => {
            //First grab the items in this sale
            var promises = [];
            for(var i in itemIds) {promises.push(this.database.find(stockDatabase.db, {"_id": i}));}
            Promise.all(promises).then((results) => {
                //Now that all the promises have finished add the items to our memory
                var items = {};
                var price = 0;
                results.forEach((value, index) => {
                    if(value[0] !== undefined) {
                        items[value[0]._id] = {
                            "_id": value[0]._id,
                            "amount": itemIds[value[0]._id],
                            "item": value[0]
                        };
                        price += (value[0].price * itemIds[value[0]._id]) || 0;
                    }
                });

                //Insert our sales record into the database now
                this.database.insert(this.db, {
                    "date": date,
                    "items": items,
                    "employeeId": employeeId,
                    "customerId": customerId,
                    "totalCost": price
                }).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });
            });
        });
    },

    /**
     * Return an object of sales item(s)
     * @param salesIdItem If set will return a singular item with the id, otherwise will return everything
     */
    get: function(selector = {}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.find(this.db, selector);
    },

    /**
     * Remove a sales item
     * @param Selector Either pass the id of the item or a object containing values to search for
     */
    remove: function(selector, options={}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.remove(this.db, selector, options);
    },

    /**
     * Find something in the database
     * @param object The object to search for
     */
    find: function(object) {
        return this.database.find(this.db, object);
    }
}
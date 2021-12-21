/**
 * Stock.js
 * The stock record handler for recording stock records to the database
 */

module.exports = {
    //Init the database
    init: function(stockDatabase) {
        this.database = require("./database.js");
        this.db = this.database.createDatabase("stock");
    },

    /**
     * Add a new stock item to the database
     * @returns a promise with the new result
     */
    add: function(name, description, price, currentStock) {
        return this.database.insert(this.db, {
            "name": name,
            "description": description,
            "price": price || 0,
            "currentStock": currentStock || 0
        });
    },

    /**
     * Find and return a stock item
     * @param Selector Either pass the id of the item or a object containing values to search for
     */
    get: function(selector = {}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.find(this.db, selector);
    },

    /**
     * Update the entire stock item
     * @param Selector Either pass the id of the item or a object containing values to search for
     * @param Changes The changes to set on the object
     * @param Options Extra options to pass to nedb
     */
    update: function(selector, name, description, price, currentStock, options={}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        var changes = {
            "name": name,
            "description": description,
            "price": price,
            "currentStock": currentStock
        };
        return this.database.update(this.db, selector, changes, options);
    },

    /**
     * Remove a stock item
     * @param Selector Either pass the id of the item or a object containing values to search for
     * @param Options Extra options to pass to nedb
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
    },
    
    /**
     * Update a stock item's name
     * @param Selector Either pass the id of the item or a object containing values to search for
     * @param Name the items new name
     */
    updateName: function(selector, name, options={}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.update(this.db, selector, {$set: {"name": name}}, options);
    },

    /**
     * Update a stock item's description
     * @param Selector Either pass the id of the item or a object containing values to search for
     * @param Description the items new description
     */
    updateDescription: function(selector, description, options={}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.update(this.db, selector, {$set: {"description": description}}, options);
    },

    /**
     * Update a stock item's price
     * @param Selector Either pass the id of the item or a object containing values to search for
     * @param Price the items new price
     */
     updatePrice: function(selector, price, options={}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.update(this.db, selector, {$set: {"price": price}}, options);
    },

    /**
     * Update a stock item's current stock
     * @param Selector Either pass the id of the item or a object containing values to search for
     * @param CurrentStock the items new stock level
     */
    updateLevel: function(selector, currentStock, options={}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.update(this.db, selector, {$set: {"currentStock": currentStock}}, options);
    }
}
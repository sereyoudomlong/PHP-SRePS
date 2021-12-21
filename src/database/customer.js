/**
 * Employee.js
 * The employee handler for the database
 */

module.exports = {
    //Init the database
    init: function(stockDatabase) {
        this.database = require("./database.js");
        this.db = this.database.createDatabase("customer");
        this.database.insert(this.db, {"_id": "default", "firstName": "customer", "lastName": ""}).catch((error)=>{});
    },

    /**
     * Add an employee to the database
     * @param firstName The first name
     * @param lastName The last name
     */
    add: function(firstName, lastName) {
        return this.database.insert(this.db, {
            "firstName": firstName,
            "lastName": lastName
        });
    },

    /**
     * Find and return an employee
     * @param Selector Either pass the id of the item or a object containing values to search for
     */
    get: function(selector) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.find(this.db, selector);  
    },

    /**
     * Update an employee
     * @param Selector Either pass the id of the item or a object containing values to search for
     * @param firstName the first name to change to
     * @param lastName the last name to change to
     * @param options the options to pass to nedb
     */
    update: function(selector, firstName, lastName, options={}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.update(this.db, selector, {$set: {"firstName": firstName, "lastName": lastName}}, options);
    },

    /**
     * Find something in the database
     * @param object The object to search for
     */
     find: function(object) {
        return this.database.find(this.db, object);
    },

    /**
     * Remove an employee
     * @param Selector Either pass the id of the item or a object containing values to search for
     * @param options the options to pass to nedb
     */
    remove: function(selector, options={}) {
        if(typeof(selector) == "string") {selector = {"_id": selector};}
        return this.database.remove(this.db, selector, options);
    }
}
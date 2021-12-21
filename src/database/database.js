/**
 * Database.js
 * The main database handler
 * This project uses nedb (https://www.npmjs.com/package/nedb) to provide the database.
 */

const Datastore = require("nedb");
const fileLocation = "./db/";
module.exports = {
    createDatabase: function(name) {
        return new Datastore({filename: fileLocation + "/" + name + ".db", autoload: true});
    },

    //Insert a object into a database
    //Returns a promise
    insert: function(database, object) {
        var self = this;
        return new Promise((resolve, reject) => {
            database.insert(object, (error, obj) => {
                if(error == null) {
                    resolve(obj);
                }
                else {
                    reject(error);
                }
            });
        });
    },

    //Find a value in the database
    //Returns a promise
    find: function(database, object) {
        var self = this;
        return new Promise((resolve, reject) => {
            database.find(object, (error, obj) => {
                if(error == null) {
                    resolve(obj);
                }
                else {
                    reject(error);
                } 
            });
        });
    },

    //Count a value in the database
    //Returns a promise
    count: function(database, object) {
        var self = this;
        return new Promise((resolve, reject) => {
            database.count(object, (error, obj) => {
                if(error == null) {
                    resolve(obj);
                }
                else {
                    reject(error);
                } 
            })
        });
    },

    //Update a value in the database
    //Returns a promise
    update: function(database, selector, changes, options = {}) {
        var self = this;
        return new Promise((resolve, reject) => {
            database.update(selector, changes, options, (error, obj) => {
                if(error == null) {
                    resolve(obj);
                }
                else {
                    reject(error);
                } 
            })
        });
    },

    //Remove a value from the database
    //Returns a promise
    remove: function(database, selector, options = {}) {
        var self = this;
        return new Promise((resolve, reject) => {
            database.remove(selector, options, (error, obj) => {
                if(error == null) {
                    resolve(obj);
                }
                else {
                    reject(error);
                } 
            })
        });  
    },
}

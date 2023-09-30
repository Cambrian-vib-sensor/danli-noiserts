npm init







CORS: Refer: https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b
AXIOS: https://zetcode.com/javascript/axios/
fetch: https://zetcode.com/javascript/fetch/nod
The app. use() method mounts or puts the specified middleware functions at the specified path. This middleware function will be executed only when the base of the requested path matches the defined path.
app.get() function lets you define a route handler for GET requests to a given URL.

The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true). The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded.

The module.exports is a special object which is included in every JavaScript file in the Node.js application by default. The module is a variable that represents the current module, and exports is an object that will be exposed as a module. So, whatever you assign to module.exports will be exposed as a module.

A database dialect is a configuration setting for platform independent software (JPA, Hibernate, etc) which allows such software to translate its generic SQL statements into vendor specific DDL, DML.1

Difference between export and modules.export
1.
When we want to export a single class/variable/function from one module to another module, we use the module.exports way.	When we want to export multiple variables/functions from one module to another, we use exports way.
2.
Module.exports is the object reference that gets returned from the require() calls.	exports is not returned by require().  It is just a reference to module.exports.
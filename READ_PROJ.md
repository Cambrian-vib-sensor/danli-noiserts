var crypto = require('crypto');
let salt = crypto.randomBytes(16).toString('hex');
console.log(salt); //32 characters
saltSave = "69dd1875f1c5566edb07150ea8a74f17";
let hash = crypto.pbkdf2Sync("hai", salt, 
    1000, 64, `sha512`).toString(`hex`);
console.log(hash); //128 characters
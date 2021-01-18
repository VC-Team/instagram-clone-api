const bcrypt = require("bcrypt");
const saltRounds = require("../config").app.password.saltRounds || 10;

const hash = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds).then(function (err, hash) {
        if (err) {
            return err;
        }
        return hash;
    });
    return hashedPassword;
}

const compare = async (password, hash) => {
    const match = await bcrypt.compare(password, hash).then(function(result) {
        if (result) {
            return true;
        }

        return false;
    })
    return match;
}

module.exports = {
    hash,
    compare
}
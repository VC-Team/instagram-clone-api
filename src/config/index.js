const prodConfig = require("./production");
const devConfig = require("./development");

const defaultConfig = {
    
}

if (process.env.NODE_ENV == "production") {
    Object.assign(defaultConfig, prodConfig);
} else {
    Object.assign(defaultConfig, devConfig);
}

module.exports = defaultConfig;
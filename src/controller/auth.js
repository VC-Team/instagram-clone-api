
const { compare } = require("../lib/bcrypt");
const userController = require("./user");
const authenticationService = require("../service/authentication").getServices();
const authController = {};

authController.login = async (userName, password) => {
    const [user] = await userController.getByFilter({ userName });
    console.log('user: ', user);


    if (!user) return;

    const hashedPassword = user.password;
    const isMatch = await compare(password, hashedPassword);

    if (!isMatch) return;

    const token = await authenticationService.sign({ _id: user._id });

    return {
        token,
        userInfo: user
    };
}

module.exports = authController;
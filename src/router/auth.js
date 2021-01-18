const router = require("express").Router();
const userController = require("../controller/user");
const authController = require("../controller/auth");
const { pipe } = require("../helper/server");
const { hash } = require("../lib/bcrypt");

router.post(
    "/login",
    pipe(
        (req) => [req.body.userName, req.body.password],
        authController.login,
        { end: true }
    )
)

router.post("/register",
    pipe(
        async (req) => {
            const data = req.body;
            if (data.password) {
                data.password = await hash(data.password);
            }

            return [req.body]
        },
        userController.insert,
        { end: true }
    )
)


module.exports = {
    router,
    config: {
        noAuth: {
            "/login": ["POST"],
            "/register": ["POST"],
            "/test": ["GET"],
        }
    }
}
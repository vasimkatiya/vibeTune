const { Router } = require("express");
const { registerController, loginController, logoutController, profileController } = require("../controllers/auth.controller");
const { authHandler } = require("../middleware/auth");

const authRouter = Router();

authRouter.post('/register',registerController);
authRouter.post('/login',loginController);
authRouter.post('/logout',logoutController);
authRouter.get('/profile',authHandler,profileController);

module.exports = authRouter;
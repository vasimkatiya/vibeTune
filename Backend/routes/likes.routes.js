const { Router } = require("express");
const { toggleLikeSongController, viewLikeSongController } = require("../controllers/likesongs.controller");

const likeRouter = Router();

likeRouter.get('/all',viewLikeSongController);
likeRouter.get('/:like',toggleLikeSongController);

module.exports = likeRouter;
const { Router } = require("express");
const { creatorHandler } = require("../middleware/creator");
const { createSongController, roleBasedAllsongController, getAllSongController, deleteSongController, viewSongController, SearchSongController } = require("../controllers/songs.controller");
const multer = require("multer");
const { authHandler } = require("../middleware/auth");


const storage = multer.memoryStorage();

const upload = multer({
    storage:storage,
    limits:{fileSize:20*1024*1024}
});

const songRouter = Router();

songRouter.post("/create",authHandler,creatorHandler,upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
]),createSongController);

songRouter.get('/query',authHandler,SearchSongController);
songRouter.get('/upload/all',authHandler,creatorHandler,roleBasedAllsongController);
songRouter.delete('/:id',authHandler,creatorHandler,deleteSongController);

songRouter.get('/all',authHandler,getAllSongController);
songRouter.get('/:i',authHandler,viewSongController);



module.exports = songRouter;
const { Router } = require("express");
const { creatorHandler } = require("../middleware/creator");
const { createSongController, roleBasedAllsongController, getAllSongController, deleteSongController, viewSongController, SearchSongController } = require("../controllers/songs.controller");
const multer = require("multer");


const storage = multer.memoryStorage();

const upload = multer({
    storage:storage,
    limits:{fileSize:20*1024*1024}
});

const songRouter = Router();

songRouter.post("/create",creatorHandler,upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
]),createSongController);

songRouter.get('/query',SearchSongController);
songRouter.get('/upload/all',creatorHandler,roleBasedAllsongController);
songRouter.delete('/:id',creatorHandler,deleteSongController);

songRouter.get('/all',getAllSongController);
songRouter.get('/:i',viewSongController);



module.exports = songRouter;
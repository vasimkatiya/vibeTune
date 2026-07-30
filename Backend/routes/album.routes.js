const { Router } = require("express");
const { creatorHandler } = require("../middleware/creator");
const { createAlbumsController, getAllAlbumsController, deleteAlbumController, viewAlbumController, roleBasedAllAlbumController } = require("../controllers/album.controller");
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage:storage,
    limits:{fileSize:20*1024*1024}
});

const albumRouter = Router();

//admin and creators same routes

albumRouter.post('/create',creatorHandler,upload.single("image"),createAlbumsController);
albumRouter.get('/upload/all',creatorHandler,roleBasedAllAlbumController);
albumRouter.delete("/:id",creatorHandler,deleteAlbumController);

//users routes

albumRouter.get('/all',getAllAlbumsController);
albumRouter.get('/:id',viewAlbumController);

module.exports = albumRouter;
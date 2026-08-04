const express = require('express');
const connectDB = require('./database/connection');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.routes');
const { authHandler } = require('./middleware/auth');
const albumRouter = require('./routes/album.routes');
const songRouter = require('./routes/song.routes');
const likeRouter = require('./routes/likes.routes');
const cors = require('cors')



const app = express();

app.use(cors({
  origin:"https://vibe-tune-omega.vercel.app",
  credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/albums',authHandler,albumRouter);
app.use('/api/songs',authHandler,songRouter);
app.use('/api/like',authHandler,likeRouter);

app.listen(process.env.PORT || 3000 ,()=>{
    connectDB();
    console.log('server is runing on port : 3000')
});
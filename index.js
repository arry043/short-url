const express = require('express');
const { connectMongo } = require('./connnect');
const URL = require('./models/url');
const path = require('path');
const { checkForAuthentication, restrictTo } = require('./middlewares/auth')
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8001;

const urlRoutes = require('./routes/url');
const staticRouter = require('./routes/staticRouter');
const userRoute = require('./routes/user');

connectMongo('mongodb://127.0.0.1:27017/url-short').then(() => {
    console.log('Connected to Database');
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));


app.use('/url', restrictTo(["NORMAL"]), urlRoutes);
app.use('/user', userRoute);
app.use('/', staticRouter);


app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            },
        },
    }
    );
    if (!entry) {
        return res.status(404).json({ error: 'URL not found' });
    }
    res.redirect(entry.redirectUrl);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
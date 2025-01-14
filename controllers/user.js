const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const { setUser } = require('../service/auth');

async function Signup(req, res) {
    const { name, email, password } = req.body;

    // Create user
    await User.create({
        name,
        email,
        password,
    });

    // Return user
    return res.redirect("/");
}

async function Login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
        return res.render('login', {
            error: "Invailid Username or Password..!"
        });
    }

    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);

    return res.redirect("/");
}


module.exports = {
    Signup,
    Login,
}
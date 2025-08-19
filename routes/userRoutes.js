const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");

// POST method to add data in database...
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    const newUser = new User(data);

    const response = await newUser.save();
    console.log("data saved");

    const payload = {
      id: response.id,
    };

    const token = generateToken(payload);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal login error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;

    const userId = userData.id;
    const user = await User.findById(userId);

    res.status(200).json({ user });
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/profile/password", async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    user.password = newPassword;
    await user.save();

    console.log("password updated successfully");
    res.status(200).json({ message: "password updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get('/candidate', async (req, res)=> {
  try {
    //  list of candidates
    
  } catch (error) {
    
  }
})

module.exports = router;

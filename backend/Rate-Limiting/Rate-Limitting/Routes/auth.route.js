const express = require("express");
const rateLimit = require('express-rate-limit');

const router = express.Router();

const otpStore = {};

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max:3 ,
  message: 'Too many OTP requests. Please try again after 5 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
})

const passwordLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: 'Too many password attempts. Please try again after 5 minutes.',
  standardHeaders: true,
  legacyHeaders: false,

})

router.post("/generate-otp",otpLimiter, (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  otpStore[email] = otp;
  console.log(`OTP for ${email} is  ${otp}`);
  res.status(200).json({ message: "OTP generated successful" });
});

router.post("/reset-password", passwordLimiter , (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email , OTP , newPassword are required" });
  }

  if (otpStore[email] === otp) {
    console.log(`Password for ${email} has been reset to: ${newPassword}`);
    delete otpStore[email];
    res.status(200).json({ message: "Password has been reset successfully" });
  } else {
    res.status(401).json({ message: "Invalid OTP" });
  }
});

module.exports = router;

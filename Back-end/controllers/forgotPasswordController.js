import Orphanage from "../models/orphanageModel.js";
import Donor from "../models/donorModel.js";
import transporter from "../config/nodemailer.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req, res) => {
  const { email, userType } = req.body;

  try {
    // Determine which model to use based on userType
    const Model = userType === "donor" ? Donor : Orphanage;
    
    // Find user by email
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: `${userType} with this email does not exist.` });
    }

    // Generate password reset token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Password Reset Link
    const resetUrl = `https://aid-gen-z.vercel.app/reset-password/${token}`;

    // Email Content
    const mailOptions = {
      from: `"Donation System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password:\n\n${resetUrl}`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent successfully." });

  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Error in forgot password process." });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body; // New password from request body
  const { userType } = req.query; // Get userType from query params (donor or orphanage)
  console.log(token);
  console.log(password);
  console.log(userType);
  try { 
    // Determine which model to use based on userType
    const Model = userType === "donor" ? Donor : Orphanage;

    // Find user by reset password token and check if it's expired
    const user = await Model.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been successfully updated." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password." });
  }
};

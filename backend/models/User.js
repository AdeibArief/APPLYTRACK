import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { required: true, type: String, trim: true },
    email: { required: true, type: String, lowercase: true, unique: true },
    password: { required: true, type: String, minlength: 6 },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
    
}
});

UserSchema.methods.matchPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password match failed");
  }
};

export default mongoose.model("User", UserSchema);

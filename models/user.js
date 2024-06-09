import { Schema, model } from "mongoose";
import { createHmac, randomBytes } from "crypto"
import { createUserToken } from "../services/auth.js";

const userSchema = new Schema({
    profileUrl: {
        type: String,
        default: "/images/user.png"
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
}, { timestamps: true })

userSchema.pre("save", function (next) {
    const user = this
    try {
        if (!user.isModified("password")) return;

        const salt = randomBytes(16).toString()
        const hasedpassword = createHmac("sha256", salt)
            .update(user.password)
            .digest("hex")

        this.salt = salt
        this.password = hasedpassword

        next()
    } catch (error) {
        console.error('crypto support is disabled!\n', error);
    }
})

userSchema.static("matchPasswordAndCreateToken", async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) throw new Error("User not found!");

    const salt = user.salt
    const hasedpassword = user.password

    const providedPasswordHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex")

    if (providedPasswordHash !== hasedpassword) throw new Error("Password Incorrect!");

    const token = createUserToken(user)

    return token
})

export const User = model("blogUsers", userSchema)
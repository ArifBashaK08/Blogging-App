import mongoose from "mongoose";

export const dbSetup = (url) => {
    mongoose.connect(url)
.then(() => console.log("MonogDB Connected"))
.catch((err) => console.error("MonogDB refused to connect\nError : ",err))
}
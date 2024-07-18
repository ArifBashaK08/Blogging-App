import mongoose from "mongoose";

export const dbSetup = (url) => {
    mongoose.connect(url)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB refused to connect\nError: ", err));
};

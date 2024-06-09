import { Schema, model } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    imgURL: {
        type: String,
        require: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'blogUsers',
    },
}, { timestamps: true })

export const BlogModel = model("blogs", blogSchema)
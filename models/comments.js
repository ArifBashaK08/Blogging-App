import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    comment: { type: String },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blogs"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "blogUsers"
    },
}, { timestamps: true })

export const CommentsModel = model("comments", commentSchema)


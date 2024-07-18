import { Router } from "express";
import multer from "multer";
import path from "path"
import { BlogModel } from "../models/blog.js";
import { CommentsModel } from "../models/comments.js";

export const blogRouter = Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(`./public/uploads`))
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName);
    }
})

const upload = multer({ storage })

blogRouter.get("/add-blog", (req, res) => {
    res.render("addblog", {
        user: req.user,
    })
})

blogRouter.post("/", upload.single("coverImage"), async (req, res) => {
    const { title, content } = req.body

    try {
        const blog = await BlogModel.create({
            title,
            content,
            imgURL: `/uploads/${req.file.filename}`,
            createdBy: req.user._id,
        })
        return res.redirect(`/blog/${blog._id}`);
    } catch (error) {
        console.error("Error : ", error.message)
        return res.status(500).send(`<h1>500 - Internal server error</h1>`)
    }
});

blogRouter.get("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const blog = await BlogModel.findById(id).populate("createdBy")

        const comments = await CommentsModel.find({ blogId: id }).populate("createdBy")

        return res.status(200).render("blog", {
            user: req.user,
            blog,
            comments,
        })
    } catch (error) {
        console.error("Error : ", error.message)
        return res.status(500).send(`<h1>500 - Internal server error</h1>`)
    }
})

blogRouter.post("/comments/:blogId", async (req, res) => {
    try {
        const addComment = await CommentsModel.create({
            comment: req.body.comment,
            blogId: req.params.blogId,
            createdBy: req.user._id
        })

        return res.status(200).redirect(`/blog/${req.params.blogId}`)
    } catch (error) {
        console.error("Error : ", error.message)
        return res.status(500).send(`<h1>500 - Unable to comment</h1>`)
    }
})
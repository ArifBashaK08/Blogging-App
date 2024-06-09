import express from "express"
import path from "path"
import { router } from "./routes/user.js"
import { blogRouter } from "./routes/blog.js"
import { dbSetup } from "./mongoConnection.js"
import cookieParser from "cookie-parser"
import { authenticateUser } from "./middlewares/authentication.js"
import { BlogModel } from "./models/blog.js"

const app = express()
const port = 8000
const url = "mongodb://127.0.0.1:27017/local"

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

dbSetup(url)

app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(authenticateUser("token"))
app.use(express.static(path.resolve("./public")))

app.get("/", async(req, res) => {
    const allBlogs = await BlogModel.find({})
    // console.log(allBlogs)
    res.status(200).render("home", {user: req.user, blogs: allBlogs})
})

app.use("/", router)
app.use("/blog", blogRouter)


app.listen(port, () => console.log(`Server is running on port : ${port}`))
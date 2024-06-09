import { Router } from "express"
import multer from "multer";
import { userSignUp, userSignIn } from "../controllers/user.js"

export const router = Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(`./public/uploads`))
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`
        cb(null, fileName);
    }
})

const upload = multer({ storage: storage })

router.get("/signin", (req, res) => {
    return res.status(200).render("signin")
})

router.post("/signin", userSignIn)

router.get("/signup",upload.single("profilePic"), (req, res) => {
    return res.status(200).render("signup")
})

router.post("/signup", userSignUp)


router.get("/logout", (req, res) => {
    try {
        res.clearCookie("token").redirect("/");
    } catch (error) {
        res.status(400).send("Unable to Sign-Out")
    }
});
import { User } from "../models/user.js"

export const userSignIn = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) return res.status(404).send(`<h1>404 - Content missing</h1>`)

        const foundUser = await User.findOne({ email })

        if (!foundUser) return res.status(404).send(` <h1>404 - User not found! Please, sign up, first</h1>
        <script>
            setTimeout(() => {
                window.location.href = "/signup"
            }, 1000);
        </script>`)

        User.matchPasswordAndCreateToken(email, password)
            .then((token) => {
                res.status(200).cookie("token", token)
                return res.status(200).send(` <h1>Welcome to Blogs-Club</h1>
                <script>
                    setTimeout(() => {
                        window.location.href = "/"
                    }, 1000);
                </script>`)
            })
            .catch(err => {
                const locals = {
                    error: {
                        code: 404,
                        message: "It seems you've entered incorrect password!"
                    }
                };
                res.status(400).render('signin', locals)
            })
    } catch (error) {
        console.log("Error - ", error.message, "\n", error)

        return res.status(500).send(`<h1>Internal Server Error</h1>`)
    }
}

export const userSignUp = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) return res.status(404).send(`<h1>404 - Content missing</h1>
        <script>
            setTimeout(() => {
                window.location.href = "/signup"
            }, 1000);
        </script>`)
        await User.create({
            fullName, email, password
        })

        return res.status(200).send(`<h1>SignUp successfull. Redirecting to SignIn page...</h1>
            <script>
                setTimeout(() => {
                    window.location.href = "/signin"
                }, 1000);
            </script>`)
    } catch (error) {
        console.log("Error - ", error.message, "\n", error)

        return res.status(500).send(`<h1>Internal Server Error</h1>`)
    }
}
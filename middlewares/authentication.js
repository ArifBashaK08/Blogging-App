import { validateToken } from "../services/auth.js";

export const authenticateUser = () => {
    return (req, res, next) => {
        const tokenCookie = req.cookies?.token
        
        try {
            if (!tokenCookie) return next();

            const userPayload = validateToken(tokenCookie)

            req.user = userPayload
            // next()
        } catch (error) { }

        next()
    }
}
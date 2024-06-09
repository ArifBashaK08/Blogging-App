import JWT from "jsonwebtoken";

const key = "Blogger$KeY"

export const createUserToken = (user) => {
    const payload = {
        _id: user._id,
        name: user.fullName, 
        email: user.email,
        profileUrl: user.profileUrl,
        role: user.role,
    }
    const token = JWT.sign(payload, key)
    return token
}

export const validateToken = (token) => {
    const payload = JWT.verify(token, key)
    return payload
}
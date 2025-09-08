import jwt from 'jsonwebtoken';
import UserModel from '../model/User.model.js';

export function verifyToken(req, res, next) {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === "Bearer"
    ) {
         jwt.verify(req.headers.authorization.split(' ')[1], 'secretKey', function(err, verifiedToken) {
            if (err) {
                return res.status(400).json({ message: "Invalid JWT Token" });
            }

            UserModel.findById(verifiedToken.id)
                .then((user) => {
                    req.user = user;
                    next();
                })
                .catch((err) => {
                    return res.status(500).json({ message: err.message });
                });
        });
    } else {
        return res.status(401).json({ message: "Authorization header missing or malformed" });
    }
}

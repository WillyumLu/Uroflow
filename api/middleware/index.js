const { verifyJWT } = require("../libs/auth");

const headerKey = "Authorization";

// JWT verification middleware
const handleJWTVerification = (req, res, next) => {
    const auth = req.get(headerKey);
    const token = auth.split(" ")[1];
    console.log(token);
    verifyJWT(token)
        .then(content => {
            req.user = content;
            next();
        })
        .catch(error => {
            res.status(401).send(error);
        });
};

module.exports = {
    handleJWTVerification
};

const admin = require("./initialize");

const authRoute = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).send({
      error: "Not Authorized",
      message: "No auth header found",
    });
  }

  try {
    const token = authorizationHeader.split(" ")[1];
    const decodedUser = await admin.auth().verifyIdToken(token);

    if (!decodedUser.email) {
      throw new Error("No email found in decoded user");
    }

    if (!decodedUser.uid) {
      throw new Error("No userId found in decoded user");
    }

    req.headers.user = {
      email: decodedUser.email,
      userId: decodedUser.uid,
    };

    next();
  } catch (err) {
    return res
      .status(403)
      .send({ error: "Not Authorized", message: err.message });
  }
};

module.exports = authRoute;

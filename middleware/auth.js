import jwt from "jsonwebtoken";

//AUTHORIZATION

export const verifyToken = async (request, response, next) => {
  try {
    let token = request.header("Authorization");

    if (!token) {
      return response.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    request.user = verified;
    next();
    //next function middleware it works like authorization means we have routes then routes should be authored to route. So based on this verified token route will access
    //example :
    // ROUTES WITH FILES -- here we have used verified so next() function will execute register function if it is true. IF it is true route will authorized
    // app.post("/auth/register", upload.single("picture"), verified, register);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
};

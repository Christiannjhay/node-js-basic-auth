import jwt from 'jsonwebtoken';


const authenticate = async (req, res, next) => {
    
  const token = req.cookies.authToken;
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
    
  try {
    const decoded = jwt.verify( token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

export default authenticate;
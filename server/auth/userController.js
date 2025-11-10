import User from "./userModel.js";
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 

console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? 'EXISTS' : 'MISSING');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

export const register = async (req, res) => {
    try {
        // Гарантираме, че isPaid винаги е false при регистрация
        const userData = {
            ...req.body,
            isPaid: false // Изрично задаваме false, за да гарантираме че полето се създава
        };
       
        const newUser = new User(userData);
        const user = await newUser.save();
        
        // include role in JWT payload
        const token = generateToken({ id: user._id, role: user.role });
        
        res.status(201).json({
            message: "User registered successfully", 
            user: { id: user._id, email: user.email, userName: user.userName, role: user.role, isPaid: user.isPaid },
            token 
        });
    }
    catch (error) {
       
        if (error.code === 11000) {
            return res.status(409).json({ message: "A user with this email already exists." });
        }
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
       
        const user = await User.findOne({ email });
        if(!user) {
         
            return res.status(401).json({message: "Invalid email or password"}); 
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password); 
        if(!isPasswordCorrect) {
            return res.status(401).json({message: "Invalid email or password"});
        }
        
        // include role in JWT payload
        const token = generateToken({ id: user._id, role: user.role });

        res.status(200).json({
            message: "Login successful",
            user: { id: user._id, email: user.email, userName: user.userName, role: user.role, isPaid: user.isPaid || false },
            token 
        });
    }
    catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}

export const logout = async (req, res)=>{
    try {
        
     res.clearCookie('jwt'); 
        res.status(200).json({message: "User logged out successfully. Please clear the token on the client side."});
    }
    catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
}


export const getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password'); // Изключваме паролата
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({
        user: {
          id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
          isPaid: user.isPaid,
          createdAt: user.createdAt,
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

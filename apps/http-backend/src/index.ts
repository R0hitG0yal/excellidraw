import { compare, hash } from 'bcrypt';
import express,{Request, Response} from 'express';
import {z} from 'zod';
import jwt from 'jsonwebtoken';
import { middleware } from './middleware';
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateUserSchema, SigninSchema } from "@repo/common/types"; 

const app= express();
app.use(express.json());

app.post("/signup", async(req, res) => {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      const hashedPass = await hash(validatedData.password, 10);

      //save user to db
      const user = {
        ...validatedData,
        password: hashedPass,
        createdAt: new Date(),
      };

      res.status(200).json({
        message: "User created successfully",
        user: {
          userName: user.userName,
          name: user.name,
          createdAt: user.createdAt,
        },
      });
      return; 
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
        return;
      }

      console.error("Signup error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
      return;
    }
});

app.post("/signin", async (req: Request, res: Response) => {
  try {
    const validatedData = SigninSchema.parse(req.body);

    // TODO: Replace this with your actual DB query
    const user = await findUserByUsername(validatedData.userName);

    if (!user) {
       res.status(401).json({
         message: "Invalid username or password",
       });
      return;
    }

    const isPasswordValid = await compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
        res.status(401).json({
        message: "Invalid username or password",
      });
      return;

    }

    // TODO: Generate and send JWT token here if using token-based auth
    const userId = user.id;
    const token = await jwt.sign({userID},JWT_SECRET);

    res.status(200).json({
      message: "Signin successful",
      token
    });
      return;
  } catch (error) {
    if (error instanceof z.ZodError) {
        res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
      return;
    }

    console.error("Signin error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
      return;

  }
});

app.post('/room', middleware,(req, res) => {

    //db call

    res.json({roomId: 123});
    return;
});

// Helper function to find user by email (replace with your DB implementation)
async function findUserByUsername(username: string) {
  // TODO: Implement actual database query
  // This is just a placeholder
  return null;
}
// app.post("signup", (req, res) => {
//      //db call
        //res.json({roomId: 123});
// });

app.listen(3001);
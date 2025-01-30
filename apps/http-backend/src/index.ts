import { compare, hash } from 'bcrypt';
import express,{Request, Response} from 'express';
import {z} from 'zod';
import jwt from 'jsonwebtoken';
import { middleware } from './middleware';
import { JWT_SECRET } from '@repo/backend-common/config';
import { CreateUserSchema, SigninSchema } from "@repo/common/types"; 
import { prismaClient } from "@repo/db/client";

const app= express();
app.use(express.json());

app.post("/signup", async(req, res) => {
    try {
      const validatedData = CreateUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await prismaClient.user.findFirst({
        where: { username: validatedData.username },
      });

      if (existingUser) {
        res.status(409).json({
          message: "Username already exists",
        });
        return;
      }

      const hashedPass = await hash(validatedData.password, 10);

      //save user to db
      const user = {
        ...validatedData,
        password: hashedPass,
      };

      const saved = await prismaClient.user.create({ data: user });

      res.status(200).json({
        message: "User created successfully",
        user: {
          username: saved.username,
          name: saved.name,
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
        message: "Incorrect Inputs",
      });
      return;
    }
});

app.post("/signin", async (req: Request, res: Response) => {
  try {
    const validatedData = SigninSchema.parse(req.body);

    // TODO: Replace this with your actual DB query
    const user = await prismaClient.user.findFirst({
      where: {
        username: validatedData.username,
      },
    });

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
    const token = await jwt.sign({userId},JWT_SECRET);

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

app.post('/room', middleware ,(req, res) => {

    //db call
    res.json({roomId: 123});
    return;
});

app.listen(3001);
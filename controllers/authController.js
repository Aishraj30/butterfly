import { NextResponse } from "next/server";
import connectDB from "../lib/db.js";
import User from "../models/User.js";
import { generateToken } from "../lib/jwt.js";
import { z } from "zod";
import { authHooks } from "../hooks/authHooks.js";


/* =========================
   Validation Schemas
========================= */

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* =========================
   Auth Controller
========================= */

export class AuthController {
  // =====================
  // User Registration
  // =====================
  static async signup(request) {
    try {
      await connectDB();

      // Pre-signup hooks
      await authHooks.beforeSignup(request);

      const body = await request.json();

      // Validate input
      const validatedData = signupSchema.parse(body);

      // Check existing user
      const existingUser = await User.findOne({
        email: validatedData.email,
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      // Create user (model hooks run automatically)
      const user = new User(validatedData);
      await user.save();

      // Generate JWT
      const token = generateToken(user);

      // Safe response
      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };

      // Post-signup hooks
      await authHooks.afterSignup(user, token);

      return NextResponse.json(
        {
          message: "User created successfully",
          user: userResponse,
          token,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Signup error:", error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }

  // =====================
  // User Login
  // =====================
  static async login(request) {
    try {
      await connectDB();

      // Pre-login hooks
      await authHooks.beforeLogin(request);

      const body = await request.json();

      // Validate input
      const validatedData = loginSchema.parse(body);

      // Find user with password
      const user = await User.findOne({
        email: validatedData.email,
      }).select("+password");

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(
        validatedData.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Generate JWT
      const token = generateToken(user);

      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };

      // Post-login hooks
      await authHooks.afterLogin(user, token);

      return NextResponse.json(
        {
          message: "Login successful",
          user: userResponse,
          token,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }

  // =====================
  // User Logout
  // =====================
  static async logout(request) {
    try {
      await authHooks.onLogout(request);

      return NextResponse.json(
        { message: "Logout successful" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Logout error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
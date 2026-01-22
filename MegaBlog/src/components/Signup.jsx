import React, { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";
import toast from "react-hot-toast";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, touchedFields },
  } = useForm({
    mode: "onChange",
  });

  const onCreate = async (data) => {
    setError("");
    try {
      // Create user account
      const userAccount = await authService.createAccount({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (userAccount) {
        // Auto login after signup
        const session = await authService.login({
          email: data.email,
          password: data.password,
        });

        if (session) {
          const user = await authService.getCurrentUser();
          if (user) dispatch(loginAction({ userData: user }));
          toast.success("SignUp Sucessfully.");
          navigate("/");
        }
      }
    } catch (err) {
      toast.error("Signup error:", err);
      setError(err?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Create your account
        </h2>

        {error && (
          <p className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit(onCreate)}
          className="space-y-4 flex flex-col items-center justify-center "
        >
          {/* Name */}
          <Input
            className="w-full"
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 4,
                message: "Name must be at least 4 characters",
              },
            })}
            error={errors.name?.message}
            isValid={touchedFields.name && !errors.name}
          />

          {/* Email */}
          <Input
            className="w-full"
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            error={errors.email?.message}
            isValid={touchedFields.email && !errors.email}
          />

          {/* Password */}
          <Input
            className="w-full"
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              maxLength: {
                value: 20,
                message: "Password must not exceed 20 characters",
              },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
                message:
                  "Password must contain uppercase, lowercase, number & special character",
              },
            })}
            error={errors.password?.message}
            isValid={touchedFields.password && !errors.password}
          />

          {/* Confirm Password */}
          <Input
            className="w-full"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value, formValues) =>
                value === formValues.password || "Passwords do not match",
            })}
            error={errors.confirmPassword?.message}
            isValid={touchedFields.confirmPassword && !errors.confirmPassword}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            bgColor="bg-yellow-400"
            className="w-full text-black disabled:opacity-50 disabled:cursor-not-allowed"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          >
            Sign Up
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

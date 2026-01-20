import { useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../store/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onLogin = async (data) => {
    setError("");
    try {
      // Login user with Appwrite
      const session = await authService.login({
        email: data.email,
        password: data.password,
      });

      if (session) {
        const user = await authService.getCurrentUser();
        dispatch(loginAction(user));
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Login to your account
        </h2>

        {error && (
          <p className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          {/* Email */}
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
            error={errors.email?.message}
          />

          {/* Password */}
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password?.message}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            bgColor="bg-orange-700"
            className="w-full"
            loading={isSubmitting}
          >
            Login
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-orange-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

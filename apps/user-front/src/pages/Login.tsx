// src/components/Login.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../ui/share/Input";
import Button from "../ui/share/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserZodSchema, LoginUser } from "@repo/zod/user";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(loginUserZodSchema),
  });

  const onSubmit: SubmitHandler<LoginUser> = (data) => {
    console.log(data);
    // Handle form submission, e.g., send the data to an API
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="email"
            label="Email"
            type="email"
            register={register}
            required
            error={errors.email}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            required
            error={errors.password}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

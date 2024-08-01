// src/components/Register.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../ui/share/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserZodSchema, UserRegisterFormData } from "@repo/zod/user";
import Button from "../ui/share/Button";
import { useCreateUserMutation } from "../services/register";

const Register: React.FC = () => {
  const [updateJokes, isLoading] = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(registerUserZodSchema),
  });
  const onSubmit: SubmitHandler<UserRegisterFormData> = (data) => {
    updateJokes(data)
      .unwrap()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            id="name"
            label="Username"
            type="text"
            register={register}
            required
            error={errors.name}
          />
          <Input
            id="email"
            label="Email"
            type="text"
            register={register}
            required
            error={errors.email}
          />
          <Input
            id="password"
            label="Password"
            type="text"
            register={register}
            required
            error={errors.password}
          />
          <Input
            id="number"
            label="Mobile Number"
            type="number"
            register={register}
            required
            error={errors.number}
          />
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;

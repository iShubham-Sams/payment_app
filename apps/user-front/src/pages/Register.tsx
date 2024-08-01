// src/components/Register.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../ui/share/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserZodSchema, UserRegisterFormData } from "@repo/zod/user";
import Button from "../ui/share/Button";
import { useCreateUserMutation } from "../services/register";
import { redirect } from "react-router-dom";
import useNotification from "../ui/share/toast/useNotification";

const Register: React.FC = () => {
  const { NotificationComponent, triggerNotification } =
    useNotification("top-left");
  const [updateJokes, isLoading] = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(registerUserZodSchema),
  });
  const onSubmit: SubmitHandler<UserRegisterFormData> = (data) => {
    // updateJokes(data)
    //   .unwrap()
    //   .then((res) => {
    //     redirect("/login");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    console.log(data);
    triggerNotification({
      type: "success",
      message: "This is a success message!",
      duration: 3000,
      animation: "pop",
    });
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      {NotificationComponent}
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
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading.isLoading}
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;

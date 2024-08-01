// src/components/Register.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../ui/share/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserZodSchema, UserRegisterFormData } from "@repo/zod/user";
import Button from "../ui/share/Button";
import { useCreateUserMutation } from "../services/register";
import { useNavigate } from "react-router-dom";
import useNotification from "../ui/share/toast/useNotification";

const Register: React.FC = () => {
  async function resolveInTwoSeconds() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return Promise.resolve();
  }
  const navigate = useNavigate();
  const { NotificationComponent, triggerNotification } =
    useNotification("top-right");
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
      .then(async (res) => {
        triggerNotification({
          type: "success",
          message: "User register successfully",
          duration: 3000,
          animation: "pop",
        });
        await resolveInTwoSeconds();
        navigate("/auth/login");
      })
      .catch((err) => {
        console.log(err);
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
            type="text"
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

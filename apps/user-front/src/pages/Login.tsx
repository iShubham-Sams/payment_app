// src/components/Login.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../ui/share/Input";
import Button from "../ui/share/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserZodSchema, LoginUser } from "@repo/zod/user";
import { useLogInUserMutation } from "../services/login";
import useNotification from "../ui/share/toast/useNotification";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  async function resolveInTwoSeconds() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return Promise.resolve();
  }
  const { NotificationComponent, triggerNotification } =
    useNotification("top-right");
  const [logInUser, dataHook] = useLogInUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(loginUserZodSchema),
  });

  const onSubmit: SubmitHandler<LoginUser> = (data) => {
    logInUser(data)
      .unwrap()
      .then(async () => {
        triggerNotification({
          type: "success",
          message: "User register successfully",
          duration: 3000,
          animation: "pop",
        });
        await resolveInTwoSeconds();
        navigate("/home");
      })
      .catch(() => {
        triggerNotification({
          type: "error",
          message: "Something went wrong",
          duration: 3000,
          animation: "pop",
        });
      });

    // Handle form submission, e.g., send the data to an API
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      {NotificationComponent}
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
          <Button
            type="submit"
            className="w-full"
            disabled={dataHook.isLoading}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

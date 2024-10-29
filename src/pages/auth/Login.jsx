import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const FormSchema = z.object({
	email: z
		.string()
		.email({
			message: "Email must be valid email.",
		})
		.trim()
		.min(1, "Email cannot be empty"),
	password: z.string().trim().min(1, "Password cannot be empty"),
});

const Login = () => {
	const navigate = useNavigate();

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onLogin = async (data) => {
		try {
			const response = await axios.post(
				"http://localhost:8000/auth/login",
				data
			);

			if (response.data.data.token) {
				Cookies.set("token", response.data.data.token, { expires: 6 });
				toast.success("Login berhasil");
				navigate("/");
			} else {
				toast.error("Email atau password salah");
			}
		} catch (error) {
			toast.error("Email atau password salah");
			console.error("Error login:", error);
		}
	};

	return (
		<div className="flex h-screen w-full items-center justify-between px-4">
			<div className="flex flex-col gap-y-10 justify-center items-center w-full h-full">
				<h1 className="font-bold text-3xl">Sistem Informasi</h1>
				<img src="./logo.svg" alt="" className="w-72" />
				<h2 className="font-bold text-4xl">Kejaksaan Negero Tojo Una-Una</h2>
			</div>
			<div className="flex justify-center items-center w-full h-full bg-[#025148]">
				<Card className="bg-[#025148] text-white border-none w-1/2 shadow-none">
					<CardHeader>
						<CardTitle className="text-2xl">Login</CardTitle>
						<CardDescription className="text-white">
							Masukan email dan password anda untuk masuk
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onLogin)}
								className=" space-y-6"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													className="text-white placeholder:text-slate-300 p-6 text-base"
													placeholder="masukkan email..."
													{...field}
													type="text"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													className="text-white placeholder:text-slate-300 p-6 text-base"
													placeholder="masukkan password..."
													{...field}
													type="password"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button
									type="submit"
									className="w-full p-6 bg-white text-black hover:bg-slate-300 hover:text-black"
								>
									Login
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Login;

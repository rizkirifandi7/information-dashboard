/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	nama: z.string().nonempty("Nama harus diisi."),
	email: z
		.string()
		.email({
			message: "Email harus valid.",
		})
		.nonempty("Email harus diisi."),
	password: z.string().nonempty("Password harus diisi."),
	role: z.string().nonempty("Role harus diisi."),
	nomor: z.string().nonempty("Nomor harus diisi."),
});

const TambahUser = ({ fetchData }) => {
	const [openTambah, setOpenTambah] = useState(false);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			nama: "",
			email: "",
			password: "",
			role: "",
			nomor: "",
		},
	});

	const handleTambah = async (data) => {
		try {
			console.log("datanya :", data);

			const formData = new FormData();
			formData.append("nama", data.nama);
			formData.append("email", data.email);
			formData.append("password", data.password);
			formData.append("role", data.role);
			formData.append("nomor", data.nomor);

			const response = await axios.post("http://localhost:8000/user", data, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.status === 200) {
				toast.success("User berhasil ditambahkan");
				form.reset();
				setOpenTambah(false);
				fetchData();
			}
		} catch (error) {
			console.error("Error adding user:", error);
			toast.error("Gagal menambahkan user");
		}
	};

	return (
		<Dialog open={openTambah} onOpenChange={setOpenTambah}>
			<DialogTrigger asChild>
				<Button className="bg-[#025148]">
					<PlusCircle />
					Tambah User
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Tambah User</DialogTitle>
					<DialogDescription>Tambahkan user baru.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleTambah)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="nama"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nama</FormLabel>
									<FormControl>
										<Input
											className="shadow-none"
											placeholder="masukkan nama..."
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
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											className="shadow-none"
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
											className="shadow-none"
											placeholder="masukkan password..."
											{...field}
											type="password"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="admin">Admin</SelectItem>
												<SelectItem value="pegawai">Pegawai</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="nomor"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nomor</FormLabel>
									<FormControl>
										<Input
											className="shadow-none"
											placeholder="masukkan nomor..."
											{...field}
											type="number"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="submit" className="w-full mt-2">
								Submit
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default TambahUser;

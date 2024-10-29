/* eslint-disable react/prop-types */
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@radix-ui/react-select";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";

const UpdateUser = ({ userId, rowData, fetchData }) => {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		defaultValues: {
			nama: rowData.nama,
			email: rowData.email,
			password: rowData.password,
			role: rowData.role,
			nomor: rowData.nomor,
		},
	});

	const handleEdit = async (data) => {
		try {
			const response = await axios.put(
				`http://localhost:8000/user/${userId}`,
				data
			);
			if (response.status === 200) {
				toast.success("User updated successfully");
				fetchData();
				setIsOpen(false);
			} else {
				toast.error("Failed to update user");
			}
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("An error occurred while updating the user");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="outline">
					<Pencil />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Data</DialogTitle>
					<DialogDescription>
						Edit data berita dengan mengisi form di bawah ini
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit(handleEdit)}
					className="space-y-6 mt-2"
				>
					<div className="flex flex-col gap-2">
						<Label className="text-sm ">Nama</Label>
						<Input
							{...form.register("nama")}
							placeholder="Nama"
							className="shadow-none"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label>Email</Label>
						<Input
							{...form.register("email")}
							placeholder="Email"
							className="shadow-none"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label>Password</Label>
						<Input
							{...form.register("password")}
							placeholder="Password"
							className="shadow-none"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Role</Label>
						<Select
							onValueChange={(value) => form.setValue("role", value)}
							defaultValue={form.getValues("role")}
						>
							<SelectTrigger>{form.getValues("role")}</SelectTrigger>
							<SelectContent>
								<SelectItem value="admin">Admin</SelectItem>
								<SelectItem value="user">User</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Nomor</Label>
						<Input
							{...form.register("nomor")}
							placeholder="Nomor"
							className="shadow-none"
						/>
					</div>

					<Button type="submit" className="w-full">
						Update
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateUser;

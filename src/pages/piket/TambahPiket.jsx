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
import { Label } from "@/components/ui/label";
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
	jenis_piket: z.string().nonempty("Jenis piket harus diisi."),
	status_absen: z.string().nonempty("Status absen harus diisi."),
	foto_absen: z.any(),
	tgl_piket: z.string().nonempty("Tanggal piket harus diisi."),
});

const TambahPiket = ({ fetchData }) => {
	const [openTambah, setOpenTambah] = useState(false);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			nama: "",
			jenis_piket: "",
			status_absen: "",
			foto_absen: "",
			tgl_piket: "",
		},
	});

	const handleTambah = async (data) => {
		try {
			const formData = new FormData();
			formData.append("nama", data.nama);
			formData.append("jenis_piket", data.jenis_piket);
			formData.append("status_absen", data.status_absen);
			formData.append("foto_absen", data.foto_absen[0]);
			formData.append("tgl_piket", data.tgl_piket);

			const response = await axios.post(
				"http://localhost:8000/piket",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 201) {
				toast.success("Piket berhasil ditambahkan");
				form.reset();
				setOpenTambah(false);
				fetchData();
			}
		} catch (error) {
			console.error("Error adding piket:", error);
			toast.error("Gagal menambahkan piket");
		}
	};

	return (
		<Dialog open={openTambah} onOpenChange={setOpenTambah}>
			<DialogTrigger asChild>
				<Button className="bg-[#025148]">
					<PlusCircle />
					Tambah Piket
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Tambah Piket</DialogTitle>
					<DialogDescription>Tambah piket baru.</DialogDescription>
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
							name="jenis_piket"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Jenis_piket</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Jenis_piket" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="ajudan">Ajudan</SelectItem>
												<SelectItem value="kantor">Kantor</SelectItem>
												<SelectItem value="rujab">Rujab</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="status_absen"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Status Piket</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Status Piket" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="hadir">Hadir</SelectItem>
												<SelectItem value="tidak hadir">Tidak hadir</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="space-y-2">
							<Label className="">Gambar</Label>
							<Input
								type="file"
								className="shadow-none h-full py-1.5"
								onChange={(e) => form.setValue("foto_absen", e.target.files)}
							/>
						</div>
						<FormField
							control={form.control}
							name="tgl_piket"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tanggal</FormLabel>
									<FormControl>
										<Input
											className="flex items-center shadow-none w-full"
											{...field}
											type="date"
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

export default TambahPiket;

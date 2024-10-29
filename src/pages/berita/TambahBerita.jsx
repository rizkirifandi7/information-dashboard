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
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	judul: z.string().nonempty("Judul harus diisi."),
	deskripsi: z.string().nonempty("Deskripsi harus diisi."),
	gambar: z.any(),
	tanggal: z.string().nonempty("Tanggal harus diisi."),
});

const TambahBerita = ({ fetchData }) => {
	const [openTambah, setOpenTambah] = useState(false);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			judul: "",
			deskripsi: "",
			gambar: "",
			tanggal: "",
		},
	});

	const handleTambah = async (data) => {
		try {
			const formData = new FormData();
			formData.append("judul", data.judul);
			formData.append("deskripsi", data.deskripsi);
			formData.append("gambar", data.gambar[0]);
			formData.append("tanggal", data.tanggal);

			const response = await axios.post(
				"http://localhost:8000/post",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 201) {
				toast.success("Berita berhasil ditambahkan");
				form.reset();
				setOpenTambah(false);
				fetchData();
			}
		} catch (error) {
			console.error("Error adding berita:", error);
			toast.error("Gagal menambahkan berita");
		}
	};

	return (
		<Dialog open={openTambah} onOpenChange={setOpenTambah}>
			<DialogTrigger asChild>
				<Button className="bg-[#025148]">
					<PlusCircle />
					Tambah Berita
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Berita</DialogTitle>
					<DialogDescription>
						Edit berita yang sudah ada atau tambahkan berita baru.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleTambah)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="judul"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Judul</FormLabel>
									<FormControl>
										<Input
											className="shadow-none"
											placeholder="masukkan judul..."
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
							name="deskripsi"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Deskripsi</FormLabel>
									<FormControl>
										<Input
											className="shadow-none"
											placeholder="masukkan deskripsi..."
											{...field}
											type="text"
										/>
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
								onChange={(e) => form.setValue("gambar", e.target.files)}
							/>
						</div>
						<FormField
							control={form.control}
							name="tanggal"
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

export default TambahBerita;

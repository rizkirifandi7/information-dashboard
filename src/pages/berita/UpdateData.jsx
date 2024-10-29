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

export function UpdateData({ beritaId, rowData, fetchData }) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);

	const form = useForm({
		defaultValues: {
			judul: rowData.judul,
			deskripsi: rowData.deskripsi,
			tanggal: rowData.tanggal,
		},
	});

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	async function handleEdit(data) {
		const formData = new FormData();
		formData.append("judul", data.judul);
		formData.append("deskripsi", data.deskripsi);
		formData.append("tanggal", data.tanggal);
		if (selectedFile) {
			formData.append("gambar", selectedFile);
		}

		try {
			await axios.put(`http://localhost:8000/post/${beritaId}`, formData);
			toast.success("Menu berhasil diupdate");
			setIsOpen(false);
			fetchData();
		} catch (error) {
			console.error(error);
			toast.error("Terjadi kesalahan saat mengupdate data");
		}
	}

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
				<form onSubmit={form.handleSubmit(handleEdit)} className="space-y-6 mt-2">
					<div className="flex flex-col gap-2">
						<Label className="text-sm ">Judul</Label>
						<Input
							{...form.register("judul")}
							placeholder="Judul"
							className="shadow-none"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label>Deskripsi</Label>
						<Input
							{...form.register("deskripsi")}
							placeholder="Deskripsi"
							className="shadow-none"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Gambar</Label>
						<Input
							type="file"
							onChange={handleFileChange}
							className="shadow-none h-full py-1.5"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Tanggal</Label>
						<Input
							type="date"
							{...form.register("tanggal")}
							placeholder="Tanggal"
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
}

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";

export function UpdatePiket({ piketId, rowData, fetchData }) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);

	const form = useForm({
		defaultValues: {
			nama: rowData.nama,
			jenis_piket: rowData.jenis_piket,
			status_absen: rowData.status_absen,
			tgl_piket: rowData.tgl_piket,
		},
	});

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	async function handleEdit(data) {
		const formData = new FormData();

		formData.append("nama", data.nama);
		formData.append("jenis_piket", data.jenis_piket);
		formData.append("status_absen", data.status_absen);
		formData.append("tgl_piket", data.tgl_piket);
		if (selectedFile) {
			formData.append("foto_absen", selectedFile);
		}

		try {
			await axios.put(`http://localhost:8000/piket/${piketId}`, formData);
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
						<Label>Jenis Piket</Label>
						<Select
							onValueChange={(value) => form.setValue("jenis_piket", value)}
							defaultValue={form.getValues("jenis_piket")}
						>
							<SelectTrigger>{form.getValues("jenis_piket")}</SelectTrigger>
							<SelectContent>
								<SelectItem value="ajudan">Ajudan</SelectItem>
								<SelectItem value="kantor">Kantor</SelectItem>
								<SelectItem value="rujab">Rujab</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Status Absen</Label>
						<Select
							onValueChange={(value) => form.setValue("status_absen", value)}
							defaultValue={form.getValues("status_absen")}
						>
							<SelectTrigger>{form.getValues("status_absen")}</SelectTrigger>
							<SelectContent>
								<SelectItem value="hadir">Hadir</SelectItem>
								<SelectItem value="tidak hadir">Tidak hadir</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						<Label>Foto Absen</Label>
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
							{...form.register("tgl_piket")}
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

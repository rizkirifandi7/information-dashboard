/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateToISO } from "@/lib/formatDate";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import axios from "axios";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
	title: z.string().nonempty("Judul harus diisi."),
	deskripsi: z.string().nonempty("Deskripsi harus diisi."),
	schedule_start: z.any(),
	schedule_end: z.any(),
});

const TambahJadwal = ({ fetchJadwalData }) => {
	const [openTambah, setOpenTambah] = useState(false);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			deskripsi: "",
			schedule_start: "",
			schedule_end: "",
		},
	});

	const handleTambah = async (data) => {
		try {
			const formData = new FormData();
			formData.append("title", data.title);
			formData.append("deskripsi", data.deskripsi);
			formData.append("schedule_start", data.schedule_start);
			formData.append("schedule_end", data.schedule_end);

			const response = await axios.post(
				"http://localhost:8000/jadwal",
				formData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Response:", response); // Debugging log

			if (response.status === 200) {
				toast.success("Jadwal berhasil ditambahkan");
				form.reset();
				setOpenTambah(false);
				fetchJadwalData();
			}
		} catch (error) {
			console.error("Error adding jadwal:", error);
			toast.error("Gagal menambahkan jadwal");
		}
	};

	return (
		<Dialog open={openTambah} onOpenChange={setOpenTambah}>
			<DialogTrigger asChild>
				<Button className="bg-[#025148] py-6 text-base w-fit">
					<Plus />
					Tambah Jadwal
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-fit">
				<DialogHeader>
					<DialogTitle>Tambah Jadwal</DialogTitle>
					<DialogDescription>Tambah jadwal baru.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleTambah)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Judul</FormLabel>
									<FormControl>
										<Input
											className="shadow-none"
											placeholder="masukkan title..."
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
						<div className="flex items-center gap-2 pt-2">
							<FormField
								control={form.control}
								name="schedule_start"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Tanggal Mulai</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-[250px] pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															formatDateToISO(field.value, "PPP")
														) : (
															<span>Pilih tanggal</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<span className="mt-5">-</span>
							<FormField
								control={form.control}
								name="schedule_end"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Tanggal Akhir</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-[250px] pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															formatDateToISO(field.value, "PPP")
														) : (
															<span>Pilih tanggal</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
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

export default TambahJadwal;

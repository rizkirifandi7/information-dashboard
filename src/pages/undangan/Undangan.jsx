import { useEffect, useState } from "react";
import axios from "axios";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateUndangan } from "./UpdateUndangan";
import { toast } from "sonner";
import TambahUndangan from "./TambahUndangan";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Undangan = () => {
	const [data, setData] = useState([]);
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});
	const [rowSelection, setRowSelection] = useState({});
	const [openHapus, setOpenHapus] = useState(false);
	const [selectedId, setSelectedId] = useState(null);

	const token = Cookies.get("token");
	const user = token ? jwtDecode(token) : null;

	const fetchData = async () => {
		try {
			const response = await axios.get("http://localhost:8000/undangan");
			const data = response.data.data.postData;
			setData(data);
			console.log("ini datanya :", data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleDelete = async () => {
		try {
			const response = await axios.delete(
				`http://localhost:8000/undangan/${selectedId}`
			);
			if (response.status === 200) {
				toast.success("Berita berhasil dihapus");
				setOpenHapus(false);
				fetchData();
			}
		} catch (error) {
			console.error("Error deleting berita:", error);
			toast.error("Gagal menghapus berita");
		}
	};

	const columns = [
		{
			accessorKey: "judul",
			header: "Judul",
			cell: ({ row }) => (
				<div className="capitalize py-2">{row.getValue("judul")}</div>
			),
		},
		{
			accessorKey: "dokumen",
			header: "Dokumen",
			cell: ({ row }) => {
				const filename = row.getValue("dokumen");
				const url = `http://localhost:8000/undangan/view/${filename}`;
				return (
					<Link
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						className="border p-2 rounded-md"
					>
						View Document
					</Link>
				);
			},
		},
	];

	if (user && user.role !== "pegawai") {
		columns.push({
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const id = row.original.id;
				const rowData = row.original;
				return (
					<div className="flex flex-row gap-2">
						<Dialog open={openHapus} onOpenChange={setOpenHapus}>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="shadow-none "
									onClick={() => {
										setOpenHapus(true);
										setSelectedId(id); // Simpan ID yang akan dihapus
									}}
								>
									<Trash2 />
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Hapus Berita</DialogTitle>
									<DialogDescription>
										Apakah anda yakin ingin menghapus berita ini?
									</DialogDescription>
								</DialogHeader>
								<DialogFooter>
									<Button
										variant="destructive"
										className="w-full"
										onClick={() => handleDelete(id)}
									>
										Hapus
									</Button>
									<div className="w-full" onClick={() => setOpenHapus(false)}>
										<Button variant="outline" className="w-full">
											Batal
										</Button>
									</div>
								</DialogFooter>
							</DialogContent>
						</Dialog>
						<UpdateUndangan
							undanganId={id}
							rowData={rowData}
							fetchData={fetchData}
						/>
					</div>
				);
			},
		});
	}

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="w-full">
			<div className="">
				<h1 className="text-xl font-bold">Dashboard Undangan</h1>
			</div>
			<div className="flex items-center py-4 gap-2">
				<Input
					placeholder="Cari undangan..."
					value={table.getColumn("judul")?.getFilterValue() ?? ""}
					onChange={(event) =>
						table.getColumn("judul")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				{user.role === "admin" ? (
					<TambahUndangan fetchData={fetchData} />
				) : null}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Undangan;

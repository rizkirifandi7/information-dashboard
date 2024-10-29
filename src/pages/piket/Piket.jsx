import * as React from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Trash2Icon } from "lucide-react";

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
import axios from "axios";
import TambahPiket from "./TambahPiket";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UpdatePiket } from "./UpdatePiket";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Piket = () => {
	const [data, setData] = React.useState([]);
	const [sorting, setSorting] = React.useState([]);
	const [columnFilters, setColumnFilters] = React.useState([]);
	const [columnVisibility, setColumnVisibility] = React.useState({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [openHapus, setOpenHapus] = React.useState(false);
	const [selectedId, setSelectedId] = React.useState(null);

	const token = Cookies.get("token");
	const user = token ? jwtDecode(token) : null;

	const fetchData = async () => {
		try {
			const response = await axios.get(`http://localhost:8000/piket`);
			const data = response.data.data.piketData;

			if (user.role === "pegawai") {
				const filteredData = data.filter((item) => item.nama === user.nama);
				setData(filteredData);
			} else {
				setData(data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleDelete = async () => {
		try {
			const response = await axios.delete(
				`http://localhost:8000/piket/${selectedId}`
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
			accessorKey: "nama",
			header: "Nama",
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("nama")}</div>
			),
		},
		{
			accessorKey: "jenis_piket",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Jenis Piket
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="capitalize">{row.getValue("jenis_piket")}</div>
			),
		},
		{
			accessorKey: "status_absen",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Status Absen
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className="lowercase">{row.getValue("status_absen")}</div>
			),
		},
		{
			accessorKey: "foto_absen",
			header: "Foto Absen",
			cell: ({ row }) => {
				const fileName = row.getValue("foto_absen");
				const fileExtension = fileName.split(".").pop().toLowerCase();
				const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
				const fileUrl = `http://localhost:8000/piket/view/${fileName}`;

				return (
					<div className="lowercase">
						{isImage ? (
							<img
								src={fileUrl}
								alt={fileName}
								className="w-20 h-20 object-cover rounded-md"
							/>
						) : (
							<a
								href={fileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 underline"
							>
								{fileName}
							</a>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "tgl_piket",
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						Tanggal
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const rawDate = new Date(row.getValue("tgl_piket"));
				const formattedDate = `${rawDate.getFullYear()}-${String(
					rawDate.getMonth() + 1
				).padStart(2, "0")}-${String(rawDate.getDate()).padStart(2, "0")}`;
				return <div className="lowercase ml-4">{formattedDate}</div>;
			},
		},
		{
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
									<Trash2Icon />
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
						<UpdatePiket piketId={id} rowData={rowData} fetchData={fetchData} />
					</div>
				);
			},
		},
	];

	const table = useReactTable({
		data: data,
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
		initialState: {
			pagination: {
				pageSize: 5,
			},
		},
	});

	React.useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="w-full">
			<div className="">
				<h1 className="text-xl font-bold">Dashboard Piket</h1>
			</div>
			<div className="flex items-center py-4 gap-2">
				<Input
					placeholder="Cari user..."
					value={table.getColumn("nama")?.getFilterValue() ?? ""}
					onChange={(event) =>
						table.getColumn("nama")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<TambahPiket fetchData={fetchData} />
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

export default Piket;

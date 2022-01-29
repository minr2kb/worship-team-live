import React, {
	useState,
	forwardRef,
	ReactChildren,
	Ref,
	useEffect,
} from "react";
import {
	DndContext,
	closestCenter,
	MouseSensor,
	TouchSensor,
	DragOverlay,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	rectSortingStrategy,
} from "@dnd-kit/sortable";

import {
	Box,
	Grid,
	Button,
	TextField,
	useMediaQuery,
	useTheme,
	IconButton,
	Typography,
	NativeSelect,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from "@mui/material";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { use100vh } from "react-div-100vh";

import { Request, RequestSet } from "../interfaces/types";
import { DragIndicator, Delete, Add } from "@mui/icons-material";

const SortableItem = (props: any) => {
	const { items, setItems, id, value, isMobile } = props;
	const sortable = useSortable({ id: id });
	const {
		attributes,
		listeners,
		isDragging,
		setNodeRef,
		transform,
		transition,
	} = sortable;

	const style: React.CSSProperties = {
		transformOrigin: "0 0",
		opacity: isDragging ? 0.3 : 1,
		backgroundColor: "white",
		boxShadow: "4px 4px 10px rgba(0,0,0,0.1)",
		borderRadius: "7px",
		paddingTop: 7,
		paddingBottom: 7,
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const editText = (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setItems(
			items.map((item: Request) =>
				item.id == id
					? {
							id: id,
							text: e.currentTarget.value,
					  }
					: item
			)
		);
	};

	const deleteItem = () => {
		setItems(items.filter((item: Request) => item.id !== id));
	};

	return (
		<div ref={setNodeRef} style={style}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<IconButton
					sx={{ touchAction: "manipulation" }}
					{...listeners}
					{...attributes}
				>
					<DragIndicator fontSize="small" color="secondary" />
				</IconButton>

				<TextField
					variant="standard"
					value={value}
					onChange={editText}
				/>
				<IconButton onClick={deleteItem}>
					<Delete fontSize="small" color="secondary" />
				</IconButton>
			</div>
		</div>
	);
};

function GridContainer({
	children,
	columns,
}: {
	children: React.ReactNode;
	columns: number;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: `repeat(${columns}, 1fr)`,
				gridGap: 10,
				// padding: 10,
			}}
		>
			{children}
		</div>
	);
}

const sampleRequestSets: RequestSet[] = [
	{
		name: "기본 요청 리스트",
		list: [
			{ id: "1642688412052", text: "🔈 소리가 안나와요" },
			{ id: "1642688412784", text: "🔇 뮤트 해주세요" },
			{ id: "1642688414170", text: "👍 볼륨 올려주세요" },
			{ id: "1642688468362", text: "👎 볼륨 내려주세요" },
			{ id: "1642688469116", text: "🚗 템포 높여주세요" },
			{ id: "1642688479933", text: "🐢 템포 내려주세요" },
			{ id: "1642688485507", text: "💬 자막이 안나와요" },
			{ id: "1642688491737", text: "⚠️ 여기 좀 봐주세요" },
			{ id: "1642688497554", text: "✋ 한명만 와주세요" },
			{ id: "1642688497555", text: "✋ 한명만 와주세요" },
			{ id: "1642688497556", text: "✋ 한명만 와주세요" },
			{ id: "1642688497557", text: "✋ 한명만 와주세요" },
			// { id: "1642688497558", text: "✋ 한명만 와주세요" },
			// { id: "1642688497559", text: "✋ 한명만 와주세요" },
			// { id: "1642688497560", text: "✋ 한명만 와주세요" },
			// { id: "1642688497561", text: "✋ 한명만 와주세요" },
			// { id: "1642688497562", text: "✋ 한명만 와주세요" },
			// { id: "1642688497563", text: "✋ 한명만 와주세요" },
			// { id: "1642688497564", text: "✋ 한명만 와주세요" },
			// { id: "1642688497565", text: "✋ 한명만 와주세요" },
			// { id: "1642688497566", text: "✋ 한명만 와주세요" },
			// { id: "1642688497567", text: "✋ 한명만 와주세요" },
			// { id: "1642688497568", text: "✋ 한명만 와주세요" },
			// { id: "1642688497569", text: "✋ 한명만 와주세요" },
			// { id: "1642688497570", text: "✋ 한명만 와주세요" },
		],
	},
];

const EditRequestList = () => {
	const height = use100vh();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
	const isTablet = useMediaQuery(theme.breakpoints.down("tablet"));
	const [open, setOpen] = React.useState(false);
	const [requestSets, setRequestSets] =
		useState<RequestSet[]>(sampleRequestSets);
	const [items, setItems] = useState<Request[]>([]);
	const [currentRequestSet, setCurrentRequestSet] = useState<number>(0);
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [isDragging, setIsDragging] = useState(false);
	const [editNameMode, setEditNameMode] = useState<
		"new" | "duplicate" | "edit"
	>("new");
	const [requestSetName, setRequestSetName] = useState<string>("");

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

	function handleDragStart(event: any) {
		if (!event.active) {
			return;
		}
		setIsDragging(true);
		setCurrentIndex(items.map(item => item.id).indexOf(event.active.id));
	}

	function handleDragEnd(event: any) {
		setIsDragging(false);
		const { active, over } = event;

		if (active.id !== over.id) {
			setItems(items => {
				const oldIndex = items.map(item => item.id).indexOf(active.id);
				const newIndex = items.map(item => item.id).indexOf(over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	function handleDragCancel() {
		setIsDragging(false);
	}

	useEffect(() => {
		setRequestSets(sampleRequestSets);
	}, []);

	useEffect(() => {
		if (requestSets) setItems(requestSets[currentRequestSet].list);
	}, [currentRequestSet]);

	return (
		<>
			<Grid
				justifyContent={"center"}
				width="100vw"
				height={height ? height : "100vh"}
				sx={{ overflowY: "auto" }}
				p={2}
			>
				<Typography variant="h1" textAlign={"center"} mt={3} mb={1}>
					수정하기
				</Typography>
				<Grid container flexDirection={"column"} alignItems={"center"}>
					<Grid container mb={1} justifyContent="center">
						<NativeSelect
							variant="filled"
							value={currentRequestSet}
							onChange={e =>
								setCurrentRequestSet(Number(e.target.value))
							}
						>
							{requestSets.map(
								(requestSet: RequestSet, idx: number) => (
									<option key={idx} value={idx}>
										{requestSet.name}
									</option>
								)
							)}
						</NativeSelect>
						<Button
							variant="contained"
							color="info"
							sx={{
								color: "white",
								p: "3px",
								pl: 2,
								pr: 2,
								ml: 1,
							}}
						>
							이름 수정
						</Button>
					</Grid>
					<Grid container justifyContent={"center"} mb={1}>
						<Button
							variant="contained"
							sx={{
								p: "3px",
								pl: 2,
								pr: 2,
							}}
							onClick={() => {
								setEditNameMode("new");
								setRequestSetName("");
								setOpen(true);
							}}
						>
							리스트 추가
						</Button>
						<Button
							variant="contained"
							sx={{
								p: "3px",
								pl: 2,
								pr: 2,
								ml: 1,
							}}
							onClick={() => {
								setEditNameMode("duplicate");
								setRequestSetName(
									`${requestSets[currentRequestSet].name}의 복제`
								);
								setOpen(true);
							}}
						>
							리스트 복제
						</Button>
						<Button
							variant="contained"
							sx={{ p: "3px", pl: 2, pr: 2, ml: 1 }}
							onClick={() => {
								if (
									window.confirm(
										"정말로 현재 리스트를 삭제하시겠습니까?"
									)
								) {
									//
								}
							}}
						>
							리스트 삭제
						</Button>
					</Grid>
				</Grid>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
					mt={1}
				>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
						onDragCancel={handleDragCancel}
					>
						<SortableContext
							items={items.map(item => item.id)}
							strategy={rectSortingStrategy}
						>
							<GridContainer columns={2}>
								{items.map((item, index) => (
									<SortableItem
										key={item.id}
										id={item.id}
										index={index}
										value={item.text}
										items={items}
										setItems={setItems}
										isMobile={isMobile}
									/>
								))}

								<Grid
									container
									justifyContent={"center"}
									// alignItems={"center"}
									sx={{
										transformOrigin: "0 0",
										backgroundColor: "white",
										boxShadow:
											"4px 4px 10px rgba(0,0,0,0.1)",
										borderRadius: "7px",
										paddingTop: "5px",
										paddingBottom: "5px",
									}}
								>
									<IconButton
										onClick={() =>
											setItems([
												...items,
												{
													id: new Date()
														.getTime()
														.toString(),
													text: "",
												},
											])
										}
									>
										<Add />
									</IconButton>
								</Grid>
							</GridContainer>
						</SortableContext>

						{/* <DragOverlay adjustScale={true}>
				{activeId ? <Item url={activeId} /> : null}
			</DragOverlay> */}
					</DndContext>

					<Button
						fullWidth={isMobile}
						variant="contained"
						color="info"
						sx={{
							color: "white",
							mt: 2,
							p: 1,
							pl: 4,
							pr: 4,
						}}
					>
						저장하기
					</Button>
				</Box>
			</Grid>
			<Dialog
				fullWidth
				maxWidth={"mobile"}
				open={open}
				onClose={() => setOpen(false)}
			>
				{/* <DialogTitle>새로운 요청 리스트</DialogTitle> */}
				<DialogContent>
					<TextField
						sx={{ mt: 2 }}
						autoFocus
						label="리스트 이름"
						fullWidth
						color="info"
						value={requestSetName}
						onChange={e => setRequestSetName(e.currentTarget.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						variant="text"
						sx={{
							boxShadow: "none",
							p: 1,
						}}
						onClick={() => setOpen(false)}
					>
						취소
					</Button>
					<Button
						variant="text"
						sx={{
							boxShadow: "none",
							p: 1,

							color: "#007AFF",
						}}
						onClick={() => {
							if (requestSetName.length < 1) {
								window.alert("리스트의 이름을 입력해주세요");
							} else {
								if (editNameMode == "new") {
									setCurrentRequestSet(requestSets.length);
									setRequestSets([
										...requestSets,
										{ name: requestSetName, list: [] },
									]);
								} else if (editNameMode == "duplicate") {
									setCurrentRequestSet(requestSets.length);
									setRequestSets([
										...requestSets,
										{
											name: requestSetName,
											list: requestSets[currentRequestSet]
												.list,
										},
									]);
								} else if (editNameMode == "edit") {
								}
								setOpen(false);
							}
						}}
					>
						{editNameMode == "edit" ? "변경" : "생성"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default EditRequestList;

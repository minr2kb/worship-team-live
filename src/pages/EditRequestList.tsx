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
import toast, { Toaster } from "react-hot-toast";
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
	Tooltip,
} from "@mui/material";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { use100vh } from "react-div-100vh";

import { Request, RequestSet } from "../interfaces/types";
import { DragIndicator, Delete, Add, ArrowBack } from "@mui/icons-material";

import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import { useRecoilState } from "recoil";
import { userRecoil, userAuthRecoil } from "../states/recoil";
import LiveDashboard from "./LiveDashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

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

const EditRequestList = () => {
	const height = use100vh();
	const theme = useTheme();
	const navigate = useNavigate();
	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
	const isTablet = useMediaQuery(theme.breakpoints.down("tablet"));
	const [user, setUser] = useRecoilState(userRecoil);
	const [userAuth, setUserAuth] = useRecoilState(userAuthRecoil);
	const [open, setOpen] = React.useState(false);
	const [requestSets, setRequestSets] = useState<RequestSet[]>(
		user?.requestList || []
	);
	const [items, setItems] = useState<Request[]>([]);
	const [currentRequestSet, setCurrentRequestSet] = useState<number>(0);
	const [editNameMode, setEditNameMode] = useState<
		"new" | "duplicate" | "edit"
	>("new");
	const [requestSetName, setRequestSetName] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

	function handleDragStart(event: any) {
		if (!event.active) {
			return;
		}
	}

	function handleDragEnd(event: any) {
		const { active, over } = event;

		if (active.id !== over.id) {
			setItems(items => {
				const oldIndex = items.map(item => item.id).indexOf(active.id);
				const newIndex = items.map(item => item.id).indexOf(over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	const saveAll = () => {
		const toastId = toast.loading("저장중...");
		console.log({ ...user, requestList: requestSets });
		updateDoc(doc(collection(db, "User"), userAuth?.uid), {
			requestList: requestSets,
		})
			.then(res => {
				if (user) setUser({ ...user, requestList: requestSets });
				toast.dismiss(toastId);
				toast.success("모든 변경사항이 저장되었습니다");
			})
			.catch(err => {
				toast.dismiss(toastId);
				toast.error("저장에 실패하였습니다");
			});
	};

	useEffect(() => {
		if (requestSets) setItems(requestSets[currentRequestSet].list);
	}, [currentRequestSet]);

	useEffect(() => {
		setRequestSets(
			requestSets.map((requestSet, idx) =>
				idx == currentRequestSet
					? { ...requestSet, list: items }
					: requestSet
			)
		);
	}, [items]);

	return (
		<DashboardLayout>
			<Toaster position="bottom-center" />
			<Grid
				justifyContent={"center"}
				width="100vw"
				height={height ? height * 0.95 : "100vh"}
				sx={{ overflowY: "auto" }}
				p={2}
			>
				<Box>
					<Grid
						container
						justifyContent={isMobile ? "space-between" : "center"}
						mt={3}
						mb={3}
					>
						{isMobile && (
							<IconButton
								sx={{ p: 0 }}
								onClick={() => {
									navigate("/");
								}}
							>
								<ArrowBack color="secondary" />
							</IconButton>
						)}
						<Typography variant="h1" textAlign={"center"}>
							요청 편집하기
						</Typography>
						{isMobile && (
							<IconButton sx={{ p: 0, visibility: "hidden" }}>
								<ArrowBack color="secondary" />
							</IconButton>
						)}
					</Grid>
				</Box>

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
							onClick={() => {
								setEditNameMode("edit");
								setRequestSetName(
									requestSets[currentRequestSet].name
								);
								setError(null);
								setOpen(true);
							}}
						>
							이름 수정
						</Button>
					</Grid>
					<Grid container justifyContent={"center"} mb={2}>
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
								setError(null);
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
									`${requestSets[currentRequestSet].name}의 카피`
								);
								setError(null);
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
										"현재 리스트를 삭제하시겠습니까?"
									)
								) {
									if (requestSets.length < 2) {
										window.alert(
											"최소 한 개 이상의 리스트가 필요합니다."
										);
									} else {
										setRequestSets(
											requestSets.filter(
												(requestSet, idx) =>
													idx !== currentRequestSet
											)
										);
										setCurrentRequestSet(0);
									}
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
						// onDragCancel={handleDragCancel}
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
									sx={{
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
								{items.length < 1 && (
									<div style={{ visibility: "hidden" }}>
										<SortableItem
											key={0}
											id={0}
											index={1}
											value={""}
											items={items}
											setItems={setItems}
											isMobile={isMobile}
										/>
									</div>
								)}
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
						onClick={saveAll}
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
				<DialogContent>
					<TextField
						sx={{ mt: 2 }}
						autoFocus
						label="리스트 이름"
						fullWidth
						color="info"
						value={requestSetName}
						onChange={e => setRequestSetName(e.currentTarget.value)}
						error={error ? true : false}
						helperText={error || ""}
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
								setError("리스트의 이름을 입력해주세요.");
							} else if (
								requestSets
									.map(req => req.name)
									.indexOf(requestSetName) > -1
							) {
								setError("이미 존재하는 이름입니다.");
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
									setRequestSets(
										requestSets.map((requestSet, idx) =>
											idx == currentRequestSet
												? {
														...requestSet,
														name: requestSetName,
												  }
												: requestSet
										)
									);
								}
								setOpen(false);
							}
						}}
					>
						{editNameMode == "edit" ? "변경" : "생성"}
					</Button>
				</DialogActions>
			</Dialog>
		</DashboardLayout>
	);
};

export default EditRequestList;

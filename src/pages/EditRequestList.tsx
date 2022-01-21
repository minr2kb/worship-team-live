import React, { useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
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
} from "@mui/material";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	DragOverlay,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import { DragIndicator, Delete, Add, AddCircle } from "@mui/icons-material";
import { use100vh } from "react-div-100vh";

import { RequestSet } from "../interfaces/types";

const SortableItem = (props: any) => {
	const { items, setItems, id, value, isMobile } = props;
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: transition,
		zIndex: isDragging ? "500" : "auto",
		opacity: isDragging ? 0.3 : 1,
	};

	const editText = (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => {
		setItems(
			items.map((item: { id: string; text: string }) =>
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
		setItems(
			items.filter((item: { id: string; text: string }) => item.id !== id)
		);
	};

	return (
		<Grid item xs={6} ref={setNodeRef} style={style} mb={1}>
			<Card>
				<Grid
					container
					alignItems={"center"}
					justifyContent={"space-between"}
				>
					<IconButton {...listeners} {...attributes}>
						<DragIndicator fontSize="small" color="secondary" />
					</IconButton>
					{isMobile && (
						<IconButton onClick={deleteItem}>
							<Delete fontSize="small" color="secondary" />
						</IconButton>
					)}
					<TextField
						variant="standard"
						value={value}
						onChange={editText}
					/>
					{!isMobile && (
						<IconButton onClick={deleteItem}>
							<Delete fontSize="small" color="secondary" />
						</IconButton>
					)}
				</Grid>
			</Card>
		</Grid>
	);
};

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
		],
	},
];

const EditRequestList = () => {
	const height = use100vh();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
	const isTablet = useMediaQuery(theme.breakpoints.down("tablet"));
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [requestSets, setRequestSets] =
		useState<RequestSet[]>(sampleRequestSets);
	const [currentRequestSet, setCurrentRequestSet] = useState<number>(0);
	const [items, setItems] = useState<{ id: string; text: string }[]>([]);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		})
	);

	useEffect(() => {
		setRequestSets(sampleRequestSets);
	}, []);

	useEffect(() => {
		if (requestSets) setItems(requestSets[currentRequestSet].list);
	}, [currentRequestSet]);

	const handleDragStart = (event: any) => {
		if (!event.active) {
			return;
		}
		setCurrentIndex(items.map(item => item.id).indexOf(event.active.id));
	};

	const handleDragEnd = (event: any) => {
		setCurrentIndex(-1);
		const { active, over } = event;
		console.log(active, over);

		if (active.id !== over.id) {
			setItems(items => {
				const oldIndex = items.map(item => item.id).indexOf(active.id);
				const newIndex = items.map(item => item.id).indexOf(over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	return (
		<DashboardLayout>
			<Grid container justifyContent={"center"} width="100%">
				<Grid
					container
					item
					xs={isTablet ? 12 : 8}
					height={height ? height : "100vh"}
					flexDirection={"column"}
					// justifyContent={"center"}
				>
					<Box
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "stretch",
							minHeight: 0,
						}}
					>
						<Typography
							variant="h1"
							textAlign={"center"}
							mt={3}
							mb={1}
						>
							수정하기
						</Typography>
						<Grid
							container
							flexDirection={"column"}
							alignItems={"center"}
						>
							<Grid container mb={1} justifyContent="center">
								<NativeSelect variant="filled" defaultValue={0}>
									<option value={0}>기본 요청 리스트</option>
									<option value={1}>청남교회 금요철야</option>
									<option value={2}>청남교회 연습</option>
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
								>
									리스트 복제
								</Button>
								<Button
									variant="contained"
									sx={{ p: "3px", pl: 2, pr: 2, ml: 1 }}
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
									리스트 삭제
								</Button>
							</Grid>
						</Grid>
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
							onDragStart={handleDragStart}
						>
							<Grid
								item
								container
								xs={12}
								p={1}
								mb={1}
								sx={{
									overflow: "auto",
								}}
								columnSpacing={1}
							>
								<SortableContext
									items={items.map(item => item.id)}
									strategy={rectSortingStrategy}
								>
									{items.map((request, idx) => (
										<SortableItem
											key={request.id}
											id={request.id}
											value={request.text}
											items={items}
											setItems={setItems}
											isMobile={isMobile}
										/>
									))}

									<Grid item mb={1} xs={6}>
										<Card
											sx={{
												p: 0,
												height: "100%",
												justifyContent: "center",
											}}
										>
											<Grid
												container
												justifyContent={"center"}
												alignItems={"center"}
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
										</Card>
									</Grid>

									<DragOverlay>
										{currentIndex > -1 && (
											<Grid item mb={1}>
												<Card>
													<Grid
														container
														alignItems={"center"}
														justifyContent={
															"space-between"
														}
													>
														<IconButton>
															<DragIndicator
																fontSize="small"
																color="secondary"
															/>
														</IconButton>
														{isMobile && (
															<IconButton>
																<Delete
																	fontSize="small"
																	color="secondary"
																/>
															</IconButton>
														)}

														<TextField
															variant="standard"
															value={
																items[
																	currentIndex
																].text
															}
														/>
														{!isMobile && (
															<IconButton>
																<Delete
																	fontSize="small"
																	color="secondary"
																/>
															</IconButton>
														)}
													</Grid>
												</Card>
											</Grid>
										)}
									</DragOverlay>
								</SortableContext>
							</Grid>
						</DndContext>
						<Button
							variant="contained"
							color="info"
							sx={{
								color: "white",
								p: "5px",
								pl: 2,
								pr: 2,
								mr: 1,
								ml: 1,
								mb: 4,
							}}
						>
							저장하기
						</Button>
					</Box>
				</Grid>
			</Grid>
		</DashboardLayout>
	);
};

export default EditRequestList;

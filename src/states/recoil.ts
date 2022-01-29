import { atom } from "recoil";
import { User } from "firebase/auth";
import { IUser } from "../interfaces/types";

export const userRecoil = atom<IUser | null>({
	key: "userRecoil",
	default: null,
});

export const userAuthRecoil = atom<User | null>({
	key: "userAuthRecoil",
	default: null,
});

export const isLoadingRecoil = atom<boolean>({
	key: "isLoadingRecoil",
	default: true,
});

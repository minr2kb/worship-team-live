import { atom } from "recoil";
import { User } from "firebase/auth";

export const userRecoil = atom<User | null>({
	key: "userRecoil",
	default: null,
});

export const isLoadingRecoil = atom<boolean>({
	key: "isLoadingRecoil",
	default: true,
});

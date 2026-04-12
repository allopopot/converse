import { atom } from "jotai";

export const userAtom = atom<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
}>()

export const userLoadingAtom = atom(false)


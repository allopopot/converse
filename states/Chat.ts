import { atom } from "jotai";

import type { Contact } from "./Contacts";

export const contactUserAtom = atom<Contact>();
export const messageHistoryAtom = atom<any[]>([]);
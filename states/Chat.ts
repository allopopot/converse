import { atom } from "jotai";

import type { Contact } from "./Contacts";

export const contactUserAtom = atom<Contact>();
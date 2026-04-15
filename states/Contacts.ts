import { atom } from "jotai";

export interface Contact {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  contactCreatedAt: Date;
}

export const contactsAtom = atom<Contact[]>([]);
export const contactsLoadingAtom = atom(false);
export const contactsSearchQueryAtom = atom("");
export const contactsPageAtom = atom(1);
export const contactsTotalAtom = atom(0);
export const contactsHasMoreAtom = atom(true);

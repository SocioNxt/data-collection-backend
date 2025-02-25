import { nanoid } from "nanoid";

export function generateIdFromLabel(label) {
    return `${label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')}-${nanoid(6)}`;
}
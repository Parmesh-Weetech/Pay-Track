export const SORT_ORDER = {
    ASC: 'ASC',
    DESC: 'DESC',
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

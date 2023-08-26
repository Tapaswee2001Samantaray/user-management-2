export interface GetUsersParamsModel {
    page: number;
    pageSize: number;
    searchTerm?: string;
    department?: string;
}
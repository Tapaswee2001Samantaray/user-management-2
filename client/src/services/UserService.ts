import axios from "axios";
import { UserDataModel } from "../models/UserDataModel";
import { AddressModel } from "../models/AddressModel";
import { GetUsersParamsModel } from "../models/GetUsersParamsModel";

export class UserService {
    private static URL: string = "http://localhost:3005/api";

    public static getAllUsers(page: number, pageSize: number, search: string | undefined, selectedDepartment: string | undefined) {
        let userURL = `${this.URL}/users`;

        const params: GetUsersParamsModel = {
            page: page,
            pageSize: pageSize
        }

        if (search) {
            params.searchTerm = search;
        }

        if (selectedDepartment) {
            params.department = selectedDepartment;
        }

        return axios.get(userURL, {
            params: params
        });
    }


    public static getAllDepartment() {
        let deptURL = `${this.URL}/departments`
        return axios.get(deptURL);
    }


    public static registerUser(info: UserDataModel) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }
        const body = JSON.stringify(info);

        return axios.post(`${this.URL}/register`, body, config);
    }

    public static addAddress(info: AddressModel, userId: number) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        }
        const body = JSON.stringify({ ...info, userId });

        return axios.post(`${this.URL}/add-address`, body, config);
    }
}
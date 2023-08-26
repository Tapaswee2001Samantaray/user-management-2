import React, { useState, useEffect } from 'react';
import { UserModel } from '../models/UserModel';
import { UserService } from '../services/UserService';
import DataTable from 'react-data-table-component';
import AddAddress from './AddAddress';
import { AddressModel } from '../models/AddressModel';
import { DepartmentModel } from '../models/DepartmentModel';
import "./style.css";

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<UserModel[]>([]);
  const [updateAddress, setUpdateAddress] = useState<boolean>(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [addressData, setAddressData] = useState<AddressModel>({
    streetAddress: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [departmentsName, setDepartmentsName] = useState<string[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);

  const totalPages = Math.ceil(pageSize / totalRows);
  // const totalPages = Math.ceil(totalRows / pageSize);


  const columns = [
    {
      name: "First Name",
      selector: (row: UserModel) => row.f_name,
      sortable: true
    },
    {
      name: "Last Name",
      selector: (row: UserModel) => row.l_name
    },
    {
      name: "Phone Number",
      selector: (row: UserModel) => row.phn_number
    },
    {
      name: "Email",
      selector: (row: UserModel) => row.user_email,
      sortable: true
    },
    {
      name: "Date Of Birth",
      selector: (row: UserModel) => {
        const dob = new Date(row.dob);
        return dob.toLocaleDateString();
      }
    },
    {
      name: "Department",
      selector: (row: UserModel) => row.department
    },
    {
      name: "Total Addresses",
      selector: (row: UserModel) => row.total_addresses
    },
    {
      name: "Action",
      cell: (row: UserModel) => <AddAddress
        addressData={addressData}
        setAddressData={setAddressData}
        updateAddress={updateAddress}
        setUpdateAddress={setUpdateAddress}
        userID={row.id}
      />
    }
  ];


  const getUsers = async () => {
    try {
      const response = await UserService.getAllUsers(page, pageSize, search, selectedDepartment);
      const fetchtedUsers: UserModel[] = response.data.data.users;
      const totalRowsCount = response.data.results;

      setUsers(fetchtedUsers);
      setFilteredUsers(fetchtedUsers);
      setTotalRows(totalRowsCount);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  const getDepartments = async () => {
    try {
      const response = await UserService.getAllDepartment();
      const departmentNames = response.data.data.departments.map((dept: DepartmentModel) => dept.dept_name);
      setDepartmentsName(departmentNames);
    } catch (error: any) {
      console.log(error);
    }
  }


  useEffect(() => {
    getUsers();
  }, [updateAddress, search, page, selectedDepartment, pageSize]); // eslint-disable-next-line


  useEffect(() => {
    getDepartments();
  }, []);

  
  return (
    <div>
      <p className="text-5xl text-gray-600 font-semibold">Users List</p>
      <DataTable
        columns={columns}
        data={filteredUsers}
        fixedHeader
        fixedHeaderScrollHeight='450px'
        highlightOnHover
        subHeader
        subHeaderComponent={
          <div className='subheader-left'>
            <h5 className='text-gray-500 font-bold'>Department:</h5>
            <select
              className='subheader-input ml-2 px-2 py-1 border rounded-md mr-3'
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All</option>
              {departmentsName?.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <input
              type='text'
              placeholder='Enter Name or Email'
              className='subheader-input ml-3 px-2 py-1 border rounded-md'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />
      <nav aria-label="...">
        <ul className="pagination ml-3">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
          </li>
          <li key={page + 1} className={`page-item ${page === page + 1 ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setPage(page)}>
              {page}
            </button>
          </li>
          <li className={`page-item ${page === totalPages ? '' : 'disabled'}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
          </li>
        </ul>
        <select
          className='subheader-input ml-3 px-2 py-1 border rounded-md custom-dropdown'
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </nav>
    </div>
  );
};

export default UserTable;
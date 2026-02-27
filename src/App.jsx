import React, { useEffect, useState } from 'react';
import './App.css';
import { APIURL, callApi, IMGURL } from './lib';

const App = () => {

    const [usersData, setUsersData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    const emptyForm = {
        _id: "",
        firstname: "",
        lastname: "",
        mobile: "",
        email: "",
        password: ""
    };

    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        loadUsersList();
    }, []);

    function loadUsersList() {
        callApi("GET", APIURL + "users/getallusers", "", setUsersData);
    }

    function deleteUser(_id) {
        const ack = confirm("Do you want to delete?");
        if (!ack) return;

        callApi("DELETE", APIURL + "users/deleteuser/" + _id, "", (res) => {
            alert(res.msg);
            loadUsersList();
        });
    }

    function editUser(index) {
        const user = usersData[index];

        setFormData({
            ...user,
            _id: user._id.toString()   // 🔥 important fix
        });

        setIsEdit(true);
    }

    function addNew() {
        setFormData(emptyForm);
        setIsEdit(true);
    }

    function closeEdit() {
        setIsEdit(false);
    }

    function handleInput(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    function updateUser() {
        callApi(
            "PUT",
            APIURL + "users/updateuser",
            JSON.stringify(formData),
            (res) => {
                alert(res.msg);
                setIsEdit(false);
                loadUsersList();
            }
        );
    }

    
    function saveUser(){
        let data = JSON.stringify({
            firstname: formData.firstname,
            lastname: formData.lastname,
            mobile: formData.mobile,
            email: formData.email,
            password: formData.password
        });
        callApi("POST", APIURL + "users/saveuser", data, saveResponse);
    }

    return (
        <div className='app'>
            <div className='header'>User Management</div>

            <div className='section'>
                <table>
                    <thead>
                        <tr>
                            <th width="50">S#</th>
                            <th width="150">First Name</th>
                            <th width="150">Last Name</th>
                            <th width="100">Mobile</th>
                            <th width="250">Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData.map((user, index) => (
                            <tr key={index}>
                                <td align="center">{index + 1}</td>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.mobile}</td>
                                <td>{user.email}</td>
                                <td>
                                    <img src={IMGURL + "edit.png"} alt="" onClick={() => editUser(index)} />
                                    <img src={IMGURL + "bin.png"} alt="" onClick={() => deleteUser(user._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='footer'>
                <button onClick={addNew}>Add New</button>
                <span>Copyright @ 2026</span>
            </div>

            {isEdit &&
                <div className='popup'>
                    <div className='panel'>
                        <span onClick={closeEdit}>&times;</span>

                        <h3>
                            {formData._id === ""
                                ? "Add New User"
                                : "Edit User"}
                        </h3>

                        <label>First Name</label>
                        <input
                            type='text'
                            name='firstname'
                            value={formData.firstname}
                            onChange={handleInput}
                        />

                        <label>Last Name</label>
                        <input
                            type='text'
                            name='lastname'
                            value={formData.lastname}
                            onChange={handleInput}
                        />

                        <label>Mobile</label>
                        <input
                            type='text'
                            name='mobile'
                            value={formData.mobile}
                            onChange={handleInput}
                        />

                        <label>Email</label>
                        <input
                            type='text'
                            name='email'
                            value={formData.email}
                            onChange={handleInput}
                        />

                        {formData._id !== ""
                            ? <button onClick={updateUser}>Update</button>
                            : <button onClick={saveUser}>Save</button>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default App;
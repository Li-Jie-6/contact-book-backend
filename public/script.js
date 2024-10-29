

async function addContact() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    let params = {
        name: name,
        address: address,
        phone: phone,
    }
    if (name == "" || address == "" || phone == "") {
        alert("输入为空！")
        return
    }
    console.log(params)
    axios.post('http://localhost:3000/addcontacts', params).then(res => {
        console.log(res);
        loadContacts();
    }).catch(err => {
        console.log(err)
    })
}

async function loadContacts() {
    axios.get('http://localhost:3000/getcontacts')
        .then(function (response) {
            console.log(response.data);
            displayContacts(response.data)
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

}

function displayContacts(contacts) {
    const contactsList = document.getElementById('contacts');
    contactsList.innerHTML = '';
    let id = 0;
    contacts.forEach(contact => {
        id++;
        contactsList.innerHTML +=
            `<tr>
        <td> 序号：${id}</td>
        <td>姓名：${contact.Name}</td> 
        <td>地址：${contact.Address} </td>
        <td>电话号码：${contact.Phone}</td>
        <td><button  onclick="deleteContact(${contact.ContactId})" class="delete-button"> 删除联系人</button ></td> 
        <td> <button onclick="updateContact(${contact.ContactId})" class="update-button">更新联系人</button></td>
        </tr>`
    });
}

async function deleteContact(id) {
    axios.delete(`http://localhost:3000/deletecontacts/${id}`).then(res => {
        console.log(res)
        alert("delete sucessful")
        loadContacts()
    }).catch(err => {
        console.log(err)
    })

}

async function updateContact(id) {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    if (name == "" || address == "" || phone == "") {
        alert("输入为空！")
        return
    }
    let params = {
        name: name,
        address: address,
        phone: phone,
    }
    console.log(params)
    axios.put(`http://localhost:3000/updatecontacts/${id}`, params).then(res => {
        alert("update sucessful")
        loadContacts();
    }).catch(err => {
        console.log(err)
    })
}

window.onload = function () {
    loadContacts();
}
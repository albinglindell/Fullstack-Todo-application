let wrapper = document.querySelector(".wrapper")
let doneWrapper = document.querySelector(".doneWrapper")
let editWindowWrapper = document.querySelector(".editWindow")

let TodoComponent = (TodoName,TodoDescription,Done, id, checkedYes, checkedNo)=> `
<div class="TodoCard">
    <h1>${TodoName}</h1>
    <p>${TodoDescription}</p>
    <label for="done">Done?:</label>
    No<input type="radio" name="${id}" value="${Done}" ${checkedNo} class="radioInput" onchange="DoneWithTodo(${id}, false)">
    Yes<input type="radio" name="${id}" value="${Done}" ${checkedYes} class="radioInput" onchange="DoneWithTodo(${id}, true)">
    <button onclick="deleteTodo(${id})">Delete Todo</button>
    <button onclick="editTodo(${id})">Edit todo</button>
</div>
`
let registerUserComponent = ()=> `
<div class="registerWrapper">
<input type="text" id="_usernameRegister" placeholder="Username">
<input type="password" id="_passwordRegister" placeholder="Password">
<input type="email" id="_emailRegister" placeholder="Email">
<button onclick="register()">Submit user</button>
</div>
`
let loginContainer=()=>`
<div class="loginDiv">
        <label for="username">Username/E-mail:</label>
        <input type="text" name="username" id="_username">
        <label for="password">Password:</label>
        <input type="password" name="password" id="_password">
        <button onclick="login()">Login</button>
        <button onclick="registerWindow()">Register user</button>
    </div>`

let editWindow = (id)=> `
<button>Close</button>
<div class="EditWrapper">
    <label for="UpdateName">Update name:</label>
        <input type="text" name="UpdateName" id="_UpdateName">
    <label for="UpdateDesc">Update description:</label>
        <input type="text" name="UpdateDesc" id="_UpdateDesc">
        <button onclick="updateTodo(${id})">Uppdate Update</button>
</div>
`

let updateTodo = async(id)=>{
const UpdateName = document.querySelector("#_UpdateName").value
const UpdateDesc = document.querySelector("#_UpdateDesc").value

let response = await axios.put(`http://localhost:1337/api/todos/${id}`, {
        data: {
            TodoName: UpdateName,
            TodoDescription: UpdateDesc,
            Done: false
            
        }},
        {
            headers:{
                Authorization:`Bearer ${sessionStorage.getItem("Token")}`
            }
        }); 
        wrapper.innerHTML =""
        doneWrapper.innerHTML =""
        editWindowWrapper.style.display="none"
        logedInCheck()

}

let DoneWithTodo = async(id, valueId)=>{
    let response = await axios.put(`http://localhost:1337/api/todos/${id}`, {
        data: {
            Done: valueId
        }},
        {
            headers:{
                Authorization:`Bearer ${sessionStorage.getItem("Token")}`
            }
        });
        logedInCheck()
}

let editTodo = (id)=>{
    editWindowWrapper.style.display="flex"
    editWindowWrapper.innerHTML = editWindow(id)
}

let login = async ()=>{
    let username = document.querySelector("#_username").value
    let password = document.querySelector("#_password").value
    
    let response = await axios.post("http://localhost:1337/api/auth/local", 
    {
        identifier : username,
        password: password
    });
    let token = response.data.jwt
    sessionStorage.setItem("Token", token)
    editWindowWrapper.style.display="none"
    editWindowWrapper.innerHTML=""
    logedInCheck()
}

let registerWindow = ()=>{
    editWindowWrapper.style.display="flex"
    editWindowWrapper.innerHTML= registerUserComponent()
}

let register = async()=>{
    let userName = document.querySelector("#_usernameRegister").value
    let password = document.querySelector("#_passwordRegister").value
    let registerEmail = document.querySelector("#_emailRegister").value

    let response = await axios.post("http://localhost:1337/api/auth/local/register", 
    {
        username : userName,
        email: registerEmail,
        password: password,
        confirmed : true
    });
    let token = response.data.jwt
    sessionStorage.setItem("Token", token)
    editWindowWrapper.style.display="none"
    editWindowWrapper.innerHTML=""
}

let addTodo = async()=>{
    let todoName = document.querySelector("#_todoName").value
    let todoDesc = document.querySelector("#_todoDesc").value
    let response = await axios.post("http://localhost:1337/api/todos", {
        data: {
            TodoName: todoName,
            TodoDescription: todoDesc,
            Done: false
            
        }},
        {
            headers:{
                Authorization:`Bearer ${sessionStorage.getItem("Token")}`
            }
        }); 
       logedInCheck()
}


let deleteTodo =  async (id)=>{
   
   await axios.delete(`http://localhost:1337/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`
        }
      });
    
    logedInCheck()
    }

const logedIn = sessionStorage.getItem("Token")
let logedInCheck = ()=>{
    wrapper.innerHTML =""
    doneWrapper.innerHTML =""
    if (logedIn){
       axios.get ("http://localhost:1337/api/todos")
        .then(data=>{
            let todos = data.data.data
    
            todos.forEach(Todo =>{
    
                let {id, attributes}= Todo
                let {TodoName, TodoDescription, Done}=attributes
                
                if(Done === false){
                    wrapper.innerHTML += TodoComponent(TodoName, TodoDescription, Done, id ,"", "checked")
    
                }else if(Done === true){
                    doneWrapper.innerHTML += TodoComponent(TodoName, TodoDescription, Done, id, "checked")
                }
               
                
            })
    
        })
        
        
    
    }

}
logedInCheck()

let OpenLogin =()=>{
    editWindowWrapper.style.display="flex"
    editWindowWrapper.innerHTML= loginContainer()

}
let logOut =()=>{
    sessionStorage.clear()
    wrapper.innerHTML = ""
    doneWrapper.innerHTML =""

}
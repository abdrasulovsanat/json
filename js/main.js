// technical_task.txt

// Task 1.
// Создать форму, в которую можно ввести след. информацию: имя пользователя, пароль, подтверждение пароля, админ или нет(можно использовать checkbox) задача: необходимо пользователей сохранять в local storage под ключом users, необходимо реализовать проверки: на уникальность имени и на совпадение паролей

// Task 2.
// Продолжаем предыдущий проект, создать форму для добавления продуктов в которую можно добавить: название, цену, ссылку на картинку; при нажатии на кнопку СОЗДАТЬ ПРОДУКТ, должна запрашиваться информация о пользователе в модальном окне(имя и пароль), затем необходимо проверить существует ли этот пользователь, подходит ли пароль к данному пользователю и является ли он админом, если все совпадает, добавить продукт в db.json(использовать json-server), также у каждого продукта должно быть поле АВТОР, автора необходимо динамически добавлять самостоятельно, данные можно получить к примеру в момент проверки существует ли пользователь вообще

// Task 3.
// Продолжаем предыдущий проект, добавить функцию рендера, которая срабатывает при обновлении страницы по умолчанию, а также запускается при нажатии на кнопку ПОЛУЧИТЬ СПИСОК ПРОДУКТОВ

// Task 4.
// Продолжаем предыдущий проект, добавить возможность редактирования продуктов, у каждого продукта должна быть кнопка РЕДАКТИРОВАТЬ, при нажатии на которую данные о продукте попадают в форму(можно использовать форму, которая предназначалась для создания продукта, можно создать отдельную, также можно использовать модалку), затем при нажатии на кнопку СОХРАНИТЬ ИЗМЕНЕНИЯ продукт должен быть изменен и страница должна заново отрисовать все продукты

// Task 5.
// Продолжаем предыдущий проект, у каждого продукта должна быть кнопка УДАЛИТЬ, при нажатии кнопку, продукт должен быть удален, также необходимо вызвать рендер для отображения изменений

// Все таски связаны между собой, для верстки использовать бутстрап(дизайн на ваше усмотрение, компоненты, которые обязательно должны быть на странице(навбар, форма добавления продукта, карточки))
// После завершения проекта необходимо все загрузить в гитхаб и прикрепить ссылку в классруме

let userName = document.querySelector('#username');
let userPass = document.querySelector('#userpass');
let userPassConf = document.querySelector('#userpass-conf');
let adminCheck = document.querySelector('#admin-check');

// local storage scripts start
function initStorage() {
       if (!localStorage.getItem('users')) {
              localStorage.setItem('users', '[]');
       };
};
initStorage();

function setUsersToStorage(users) {
       localStorage.setItem('users', JSON.stringify(users))
};

function getUsersFromStorage() {
       let users = JSON.parse(localStorage.getItem('users'));
       return users;
};
// local storage scripts end

// create users
function createUsers() {

       let userObj = {
              name: userName.value,
              password: userPass.value,
              isLogin: false,
              isAdmin: false
       };
       
       if (adminCheck.checked == true) {
              userObj.isAdmin = true
       }

       let users = getUsersFromStorage();
       
       if (users.some(item => item.name == userName.value)) {
              alert('Username must be uniq!')
              return
       };

       if (userPass.value != userPassConf.value) {
              alert('Passwords dont match!')
              return
       };

       users.push(userObj);
       setUsersToStorage(users);

       userName.value = '';
       userPass.value = '';
       userPassConf.value = '';

       let btnClose = document.querySelector('.btn-close');
       btnClose.click();
       // render();
};

let addUserBtn = document.querySelector('.add-user-btn');
addUserBtn.addEventListener('click', createUsers);

let userNameLog = document.querySelector('#username-login');
let userPassLog = document.querySelector('#userpass-login');
let loginBtn = document.querySelector('#login-btn')

function updUser() {
       let users = getUsersFromStorage();
       users = users.filter(item => item.name != userNameLog.value && item.isLogin != false)
       setUsersToStorage(users) 

}

let prodImg = document.querySelector('#prod-url-inp');
let prodTitle = document.querySelector('#prod-title-inp');
let prodPrice = document.querySelector('#prod-price-inp');
let prodBtnAdd = document.querySelector('#add-prod-btn');
let loginBtnAdd = document.querySelector('#login-btn');
// console.log(prodBtnAdd);

function addProduct() {
       let users = getUsersFromStorage();

       let prodObj = {
              img: prodImg.value,
              title: prodTitle.value,
              price: prodPrice.value,
              author: ''
       }

       function login() {
              let users = getUsersFromStorage();
              let userObj = users.find(item => item.name == userNameLog.value);
       
              if (!userObj) {
                     alert('Invalid username or username not found!')
                     return
              }
       
              if (userObj.password !== userPassLog.value) {
                     alert('Invalid password')
                     return
              }
       
              userObj.isLogin = true
       
              setUsersToStorage(users)
              
              userNameLog.value = '';
              userPassLog.value = '';
       
              let btnClose = document.querySelector('#btn-close-login');
              btnClose.click();       

              if (userObj.isAdmin !== true) {
                     alert('You are not admin!')
                     return
              }
              
              prodObj.author = userObj.name

              fetch('http://localhost:8000/products', {
                     method: 'POST',
                     body: JSON.stringify(prodObj),
                     headers: {
                            "Content-Type": "application/json;charset=utf-8"
                     }
              });
       };

       prodImg.value = '';
       prodTitle.value = '';
       prodPrice.value = '';
       
       loginBtnAdd.addEventListener('click', login)

       let btnClose = document.querySelector('#btn-close-prod');
       btnClose.click();

}

prodBtnAdd.addEventListener('click', addProduct);

let getProductsBtn = document.querySelector('#get-products');

// render start
function render() {
       let container = document.querySelector('.container');
       container.innerHTML = '';
       fetch('http://localhost:8000/products')
              .then((result) => result.json())
              .then((data) => {
                     data.forEach(item => {
                            container.innerHTML += `
                            <div class="card w-25 m-2" style="width: 18rem;" id = "${item.id}">
                                   <img src="${item.img}" class="card-img-top" alt="error:(" height = "250">
                                   <div class="card-body bg-light bg-opacity-50">
                                          <h5 class="card-title">${item.title}</h5>
                                          <hr>
                                          <p class="card-text"><b>Price:</b> ${item.price}</p>
                                          <hr>
                                          <p class="card-text"><b>Author:</b> ${item.author}</p>
                                          <a href="#" class="btn btn-danger del-prod-btn">Delete <i class="bi bi-trash"></i></a>
                                          <a href="#" class="btn btn-primary upd-prod-btn"    
                                          data-bs-toggle="modal"
                                          data-bs-target="#staticBackdrop4">Update <i class="bi bi-gear"></i></a>
                                   </div>
                          </div>`;
                     })
                     
                     if (data.length === 0) return;
              })
}
document.addEventListener('DOMContentLoaded', render);
getProductsBtn.addEventListener('click', render)
// render end

// update product

let updImgInp = document.querySelector('#prod-url-upd');
let updTitleInp = document.querySelector('#prod-title-upd');
let updPriceInp = document.querySelector('#prod-price-upd');

function updateProd() {
       let userObj = users.find(item => item.name == userNameLog.value);

       let users = getUsersFromStorage();
       if(!userObj.isAdmin)
       fetch('http://localhost:8000/products')
              .then((result) => result.json())
              .then(products)
       
       updImgInp.value = 
       updTitleInp.value = 
       updPriceInp.value = 

       fetch(`http://localhost:8000/products/${productID}`, {
              method: 'PATCH',
              body: JSON.stringify(
                     {
                            img: newImg.value,
                            title: newTitle.value,
                            price: newPrice.value
                     }
              ),
              headers: {
                     "Content-Type": "application/json;charset=utf-8"
              }
       })
};

function addUpdateEvent() {

       let updateBtns = document.querySelectorAll('.upd-prod-btn');
       // console.log(updateBtns);
       updateBtns.forEach(item => item.addEventListener('click', updateProd))
};

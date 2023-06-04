let userlogin;
let userpassword;
let username;

const setup = () => {
  username = document.getElementById('username');
  userlogin = document.getElementById('userlogin');
  userpassword = document.getElementById('userpassword');
  document.getElementById('register').addEventListener('click', (event) => {
  event.preventDefault();
  register(false);
  });
}

window.addEventListener('DOMContentLoaded', setup);

const register =  async admin => {
  const userData = {
                     name : username.value,
                     login : userlogin.value,
                     password : userpassword.value,
                     admin : admin || false
                   };
  console.log(`data : ${userData.admin}`);

  const body = JSON.stringify(userData);
  const requestOptions = {
                         method :'POST',
                         headers : { "Content-Type": "application/json" },
                         body : body
                       };
  const response = await fetch(`/access/register`, requestOptions);
  if (response.ok) {
    const createdUser = await response.json();
    console.log(`user registered : ${JSON.stringify(createdUser)}`);
    window.location.href = '/access/login';
  }
  else {
    const error = await response.json();
    console.log(`erreur : ${error.message}`);
    document.getElementById('problem').textContent = `erreur : ${error.message}`;
  }
}

const adminRegister = () => register(true);

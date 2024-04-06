async function postData (url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    })
    return response.json()
}

const button = document.querySelector('#connect-button')

button.addEventListener('click', function(event) {
  event.preventDefault()
  const email = document.querySelector('#email').value
  const password = document.querySelector('#password').value
    postData('http://localhost:5678/api/users/login', { 
      "email": email,
      "password": password,
     //"email": "sophie.bluel@test.tld",
     //"password": "S0phie",  
  }).then((data) => {
  if (data.token) {
    //console.log(data.token)
    localStorage.setItem('accessToken', data.token); 
    console.log(localStorage)
    document.location.href="./index.html";
  } else {
    alert("Identifiant invalide. Veuillez fournir un identifiant valide.")
    //throw new Error("Identifiant invalide. Veuillez fournir un identifiant valide.");
  }})
})




async function getData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  })
  return response.json()
}

async function deleteData(url = '', data = {}) {
  const token = localStorage.getItem ('accessToken')
  console.log(token)
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    },
  })
}


getData('http://localhost:5678/api/works', {
  //"email": "sophie.bluel@test.tld",
  //"password": "S0phie",
}).then((data) => {
  let typesUniques = new Set()
  for (let i = 0; i < data.length; i++) {
    const element = data[i]
    const projects = document.querySelector('#projects')
    projects.innerHTML += renderCard(element)
    typesUniques.add(data[i].category.name)

    const modal = document.getElementById("images-list");
    modal.innerHTML += renderModal(element)

    let modalImage = document.getElementById(element.id);
    modalImage.addEventListener('click', function() { 
      modalImage.parentNode.removeChild(modalImage);
    });
  }
})

async function init() {
  const categories = getData('http://localhost:5678/api/categories').then(
    (data) => {
      const filterZone = document.querySelector('.filter-zone')
      filterZone.innerHTML = ''
      filterZone.innerHTML += `<p><a href="">Tous</a></p>`
      data.forEach((element) => {
        filterZone.innerHTML += `<p><button onclick="filterWorks('` + element.name + `')"> ` + element.name + `</button></p>`
      })
    }
  )
}

function filterWorks(type) {
  getData('http://localhost:5678/api/works', {}).then((data) => {
    const projects = document.querySelector('#projects')
    projects.innerHTML = ''
    if (type === 'Tous') {
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        projects.innerHTML += renderCard(element)
      }
    } else {
      const filteredData = data.filter(
        (element) => element.category.name === type
      )
      for (let i = 0; i < filteredData.length; i++) {
        const element = filteredData[i]

        projects.innerHTML += renderCard(element)
      }
    }
  })
  // Mettre à jour le HTML avec les éléments filtrés
}

function renderModal(element) {
  const figure2 =
   '<span id="span' + element.id + '"><img src="' 
   +element.imageUrl + 
   '" alt="' +
   element.title +
   '" style="width: 80px"> <i id="'
   + element.id + 
   '" class="fas fa-trash-alt"></i></span>'
   return figure2
}

function renderCard(element) {
  const figure =
    '<figure><img src="' +
    element.imageUrl +
    '" alt="' +
    element.title +
    '"><figcaption> ' +
    element.title +
    ' </figcaption></figure>'
  return figure
}

// Modal

const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const span = document.getElementById("close");

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const imagesList = document.getElementById ("images-list")
imagesList.addEventListener("click", function(event) {
  if (event.target.classList.contains('fa-trash-alt')) {
    const id = event.target.id 
    deleteData ('http://localhost:5678/api/works/' + id, {}).then ((data) =>{
      
      console.log(data)
      // const spanId = 'span' + event.target.getAttribute('id');
      // const span = document.getElementById(spanId)
      // if (span) {
      // imagesList.removeChild(span)
      // }

      
    })
  
}
})


// Fonction pour supprimer une image côté serveur
function deleteImageOnServer(imageId) {
  const apiUrl = 'http://localhost:5678/api/images/' + imageId;

  fetch(apiUrl, {
      method: 'DELETE',
      headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
          'Content-Type': 'application/json'
      },
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Erreur de suppression côté serveur');
      }
      return response.json();
  })
  .then(data => {
      console.log('Suppression côté serveur réussie:', data);

      // Une fois la suppression côté serveur réussie, supprimer l'image côté client
      deleteImageOnClient(imageId);
  })
  .catch(error => console.error('Erreur côté serveur:', error));
}

// Fonction pour supprimer une image côté client
function deleteImageOnClient(imageId) {
  // Supprimez l'élément côté client en utilisant l'ID de l'image
  var imageElement = document.getElementById(imageId);
  if (imageElement) {
      imageElement.parentNode.removeChild(imageElement);
      console.log('Suppression côté client réussie');
  } else {
      console.warn('L\'élément côté client n\'a pas été trouvé.');
  }
}

// Modal ajout photo
const btnAddWork = document.querySelector (".btn-add-work")
const modal2 = document.getElementById("myModal2");

btnAddWork.addEventListener ("click", function(event) {
  const modal = document.getElementById("myModal");
  modal.style.display = 'none';
  modal2.showModal();
})

const closeBtn = document.querySelector (".close")
closeBtn.addEventListener ("click", function(event) {
    modal2.style.display = 'none';
})







document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.getElementById('fileInput');
  const imageContainer = document.getElementById('imageContainer');
  const imageTitle = document.getElementById('imageTitle');
  const categoryDropdown = document.getElementById('categoryDropdown');
  const selectedCategory = document.getElementById('selectedCategory');
  const fileInputLabel = document.getElementById('fileInputLabel');

  fileInput.addEventListener('change', function () {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = function () {
          const img = new Image();
          img.src = reader.result;
          img.onload = function () {
              imageContainer.innerHTML = '';
              imageContainer.appendChild(img);
          };
      };

      if (file) {
          reader.readAsDataURL(file);
          fileInputLabel.textContent = file.name; // Met à jour le libellé du bouton avec le nom du fichier sélectionné
      }
  });

  categoryDropdown.addEventListener('change', function () {
      const selectedOption = categoryDropdown.options[categoryDropdown.selectedIndex];
      selectedCategory.textContent = `Catégorie sélectionnée : ${selectedOption.textContent}`;
  });

  // Code pour récupérer les catégories depuis une API prédéfinie
  fetch('votre_api_categories')
      .then(response => response.json())
      .then(data => {
          data.forEach(category => {
              const option = document.createElement('option');
              option.textContent = category;
              categoryDropdown.appendChild(option);
          });
      })
      .catch(error => console.error('Erreur lors de la récupération des catégories :', error));
});



init();
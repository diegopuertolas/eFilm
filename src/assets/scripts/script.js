
// =============================================================================
// DOM ELEMENTS - Referencias a elementos del HTML
// =============================================================================

// Elementos del formulario
const toggleFormBtn = document.getElementById('toggleFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const formContainer = document.getElementById('formContainer');
const movieForm = document.getElementById('movieForm');
const formTitle = document.querySelector('.form-title');
const formSubmitBtn = document.querySelector('.form-submit-btn');

// Elementos del grid de películas
const moviesGrid = document.getElementById('moviesGrid');
const moviesEmpty = document.getElementById('moviesEmpty');

// Elementos de búsqueda
const searchInput = document.getElementById('searchInput');

// Elementos del modal de información
const toggleInfoBtn = document.getElementById('toggleInfoBtn');
const closeInfoBtn = document.getElementById('closeInfoBtn');
const infoContainer = document.getElementById('infoContainer');


// =============================================================================
// STATE - Variables de estado de la aplicación
// =============================================================================

let isFormVisible = false;
let movies = JSON.parse(localStorage.getItem('movies')) || [];
let editingIndex = null;


// =============================================================================
// STORAGE FUNCTIONS - Funciones para guardar datos en localStorage
// =============================================================================

function saveMovies() {
  localStorage.setItem('movies', JSON.stringify(movies));
}


// =============================================================================
// FORM FUNCTIONS - Funciones para gestionar el formulario
// =============================================================================

function openForm(isEditing = false, index = null) {
  isFormVisible = true;
  formContainer.classList.add('active');
  toggleFormBtn.textContent = 'Cancelar';
  toggleFormBtn.classList.add('cancel');
  
  if (isEditing && index !== null) {
    editingIndex = index;
    const movie = movies[index];
    document.getElementById('titleInput').value = movie.title;
    document.getElementById('directorInput').value = movie.director;
    document.getElementById('genreInput').value = movie.genre;
    document.getElementById('dateInput').value = movie.date;
    document.getElementById('revenueInput').value = movie.revenue;
    document.getElementById('countryInput').value = movie.country;
    document.getElementById('imageInput').value = movie.image;
    formTitle.textContent = 'Editar Película';
    formSubmitBtn.textContent = 'Guardar';
  } else {
    editingIndex = null;
    formTitle.textContent = 'Nueva Película';
    formSubmitBtn.textContent = 'Crear';
  }
}

function closeForm() {
  isFormVisible = false;
  formContainer.classList.remove('active');
  toggleFormBtn.textContent = 'Añadir Película';
  toggleFormBtn.classList.remove('cancel');
  movieForm.reset();
  editingIndex = null;
  formTitle.textContent = 'Nueva Película';
  formSubmitBtn.textContent = 'Crear';
}


// =============================================================================
// INFO FUNCTIONS - Funciones para gestionar el modal de información
// =============================================================================

function openInfo() {
  infoContainer.classList.add('active');
}

function closeInfo() {
  infoContainer.classList.remove('active');
}


// =============================================================================
// MOVIE CARD FUNCTIONS - Funciones para crear las tarjetas de películas
// =============================================================================

function createMovieCard(movie, index) {
  const card = document.createElement('div');
  card.classList.add('movie-card');
  card.innerHTML = `
    <img src="${movie.image}" alt="${movie.title}" class="movie-card-image" onerror="this.src='https://via.placeholder.com/300x450?text=Sin+Imagen'">
    <div class="movie-card-info">
      <h3 class="movie-card-title">${movie.title}</h3>
      <div class="movie-card-details">
        <p class="movie-card-detail"><span>Director:</span> ${movie.director}</p>
        <p class="movie-card-detail"><span>Género:</span> ${movie.genre}</p>
        <p class="movie-card-detail"><span>Fecha:</span> ${movie.date}</p>
        <p class="movie-card-detail"><span>Recaudación:</span> ${movie.revenue}$</p>
        <p class="movie-card-detail"><span>País:</span> ${movie.country}</p>
      </div>
      <button class="movie-card-edit" data-index="${index}">Editar</button>
    </div>
    <button class="movie-card-delete" data-index="${index}">✕</button>
  `;
  return card;
}


// =============================================================================
// RENDER FUNCTIONS - Funciones para renderizar las películas en el DOM
// =============================================================================

function renderMovies(moviesToRender = movies) {
  moviesGrid.innerHTML = '';
  
  if (moviesToRender.length === 0) {
    moviesEmpty.classList.add('active');
  } else {
    moviesEmpty.classList.remove('active');
    moviesToRender.forEach((movie, index) => {
      const card = createMovieCard(movie, index);
      moviesGrid.appendChild(card);
    });
  }

  // Asignar eventos a los botones de eliminar
  document.querySelectorAll('.movie-card-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      deleteMovie(index);
    });
  });

  // Asignar eventos a los botones de editar
  document.querySelectorAll('.movie-card-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      openForm(true, index);
    });
  });
}


// =============================================================================
// CRUD FUNCTIONS - Funciones para añadir, actualizar y eliminar películas
// =============================================================================

function addMovie(movie) {
  movies.push(movie);
  saveMovies();
  renderMovies();
}

function updateMovie(index, movie) {
  movies[index] = movie;
  saveMovies();
  renderMovies();
}

function deleteMovie(index) {
  movies.splice(index, 1);
  saveMovies();
  renderMovies();
}


// =============================================================================
// SEARCH FUNCTIONS - Funciones para buscar películas
// =============================================================================

function searchMovies(query) {
  const filtered = movies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase()) ||
    movie.director.toLowerCase().includes(query.toLowerCase()) ||
    movie.country.toLowerCase().includes(query.toLowerCase())
  );
  renderMovies(filtered);
}


// =============================================================================
// EVENT LISTENERS - Eventos de la aplicación
// =============================================================================

// Toggle del formulario (abrir/cerrar)
toggleFormBtn.addEventListener('click', () => {
  if (isFormVisible) {
    closeForm();
  } else {
    openForm();
  }
});

// Cerrar formulario con botón X
closeFormBtn.addEventListener('click', closeForm);

// Envío del formulario
movieForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const movieData = {
    title: document.getElementById('titleInput').value,
    director: document.getElementById('directorInput').value,
    genre: document.getElementById('genreInput').value,
    date: document.getElementById('dateInput').value,
    revenue: document.getElementById('revenueInput').value,
    country: document.getElementById('countryInput').value,
    image: document.getElementById('imageInput').value
  };
  
  if (editingIndex !== null) {
    updateMovie(editingIndex, movieData);
    alert('¡Película actualizada!');
  } else {
    addMovie(movieData);
    alert('¡Película creada!');
  }
  
  closeForm();
});

// Búsqueda de películas
searchInput.addEventListener('input', (e) => {
  searchMovies(e.target.value);
});

// Abrir modal de información
toggleInfoBtn.addEventListener('click', openInfo);

// Cerrar modal de información
closeInfoBtn.addEventListener('click', closeInfo);


// =============================================================================
// INIT - Inicialización de la aplicación
// =============================================================================

renderMovies();
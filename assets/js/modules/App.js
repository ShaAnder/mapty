'use strict';

//----------------- IMPORTS ----------------- //

import { Workout, Running, Cycling } from './Workout.js';

//----------------- OUR VARIABLES ----------------- //

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//-----------------  APPLICATION CLASS ----------------- //

class App {
  // Private class properties
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  constructor() {
    // CALL GET CURRENT POSITION HERE
    this.#getPosition();

    // GET LOCAL
    this.#getLocalStorage();

    // EVENT LISTENERS
    form.addEventListener('submit', this.#newWorkout.bind(this)); // bind this to make sure it points to the class
    inputType.addEventListener('change', this.#toggleElevationField.bind(this));
    containerWorkouts.addEventListener('click', this.#moveToPopup.bind(this));
  }

  // GET POSITION FUNCTION - Gets current user coords
  #getPosition() {
    // if successful coords
    if (navigator.geolocation)
      // get current position, loads map from loadmap method, bind loadmap to this
      // to make sure it's treated as a method call not just a regular callback
      navigator.geolocation.getCurrentPosition(
        this.#loadMap.bind(this),
        function () {
          // else ping that we couldn't get position
          alert('Could not get your position');
        }
      );
  }

  // LOADMAP FUNCTION - Takes position as an arg (current user position)
  #loadMap(position) {
    // get coords from the position
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    // set the view of our map from coords
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    // Getting from open street map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.#map
    );
    // when we click we call the map event function to show the form
    this.#map.on('click', this.#showForm.bind(this));

    // we want to call this here due to load orders, seeing as we're not using asynch js
    // things load at a specific order and when we say reload the page from storage the markers
    // cannot render before the map
    this.#workouts.forEach(work => {
      this.#renderWorkoutMarker(work);
    });
  }

  // SHOW FORM METHOD - Shows form when we click
  #showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  // HIDE FORM - hides the form and replaces it with the latest workout
  #hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputElevation.value =
      inputCadence.value =
        '';
    // set display to none -> remove form hidden -> after submit is hit -> Replace -> hide form again
    form.style.display = 'none';
    form.classList.remove('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
    form.classList.add('hidden');
  }

  // TOGGLE ELEVATION METHOD - Allows us to swap between modes and changes form to match
  #toggleElevationField(e) {
    e.preventDefault();
    // Get the closest parent of form row class, when we swap between running and cycling
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  // NEW WORKOUT METHOD - Creates a new workout object for the pin
  #newWorkout(e) {
    // Prevent default to stop refresh
    e.preventDefault();

    // Helper functions to validate inputs and check if all args are positive
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    // GET OUR COORDS
    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat, lng];

    // GET FORM DATA
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    // Workout var to define as needed
    let workout;

    // RUNNING OBJECT
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Guard clauses, with helper function checks
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Input must be a positive number');
      workout = new Running(coords, distance, duration, cadence);
    }

    // CYCLING OBJECT
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Input must be a positive number');
      workout = new Cycling(coords, distance, duration, elevation);
    }

    // ------- DELEGATION ------- //

    // once we're finished making the workout property we're now
    // delegating functionality and calling them here

    // ADD OBJECT TO ARR
    this.#workouts.push(workout);
    console.log(workout);

    // RENDER AS MARKER
    this.#renderWorkoutMarker(workout);

    // RENDER ON LIST
    this.#renderWorkout(workout);

    // HIDE FORM/CLEAR FIELDS
    this.#hideForm();

    // LOCAL STORAGE
    this.#setLocalStorage();
  }

  // RENDER WORKOUT MARKER - sets the form display and the text on said display
  #renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          // get the correct class with string literals to choose our class
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  // RENDER WORKOUT - Renders the workout information on the side bar using html insertion
  #renderWorkout(workout) {
    // we want to get the html for the workout we're going to add here
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.name === 'running' ? '🚴‍♀️' : '🏃‍♂️'
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    if (workout.type === 'running')
      html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(2)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
          </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevation}</span>
          <span class="workout__unit">m</span>
        </div>
        </li>
      `;
    form.insertAdjacentHTML('afterend', html);
  }

  // MOVE TO POPUP - uses closest and event delgation to allow us to move to the specified movement pin on click
  #moveToPopup(e) {
    //were going to use .closest to get the closest workout parent which will be Workout itself
    //we can then use this to navigate to that workout pin
    const workoutEl = e.target.closest('.workout');

    // place a guard clause just in case no element
    if (!workoutEl) return;

    // We now use the find method (our workouts are in an arr), to find the workout whos id
    // matches the one we click the id is stored in the dataset attribut
    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    // Finally we can use leaflets own setview method to actually move to the pin
    // it takes the coords, the zoom level and an object of options as args
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  // SET LOCAL STORAGE - simple api, used for small amounts of data, for now
  // this function goes and saves the data to the browser, for larger amounts of data use a server
  #setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  // GET OUR LOCAL STORAGE - Get the workouts
  #getLocalStorage() {
    //
    const data = JSON.parse(localStorage.getItem('workouts'));

    // Guard clause my beloved
    if (!data) return;

    // now we wanna get our data
    this.#workouts = data;

    // using for each because to loop through the workouts and render each one
    this.#workouts.forEach(work => {
      this.#renderWorkout(work);
    });
  }
}

//----------------- EXPORTS ----------------- //

export default App;

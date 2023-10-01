'use strict';

//----------------- OUR VARIABLES ----------------- //

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//----------------- WORKOUT CLASS -----------------//

class Workout {
  // Date for object creation
  date = new Date();
  // we use id to track workouts instead of using a direct name
  // we will use the current date, convert to str and take the last numbers
  id = (Date.now() + ' ').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}
// RUNNING CHILD CLASS
class Running extends Workout {
  type = 'running';
  // pass in our args into the constructor and super the common ones
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    // add cadance
    this.cadence = cadence;
    // call the pace method
    this.calcPace();
    this.setDescription();
  }

  // Now we will calculate the pace (min/km)
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
// CYCLING CHILD CLASS
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    // add elevation
    this.elevation = elevation;
    this.calcSpeed();
    this.setDescription();
  }

  // calc speed km/hr(min/60)
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

//----------------- EXPORTS ----------------- //

export { Workout, Running, Cycling };

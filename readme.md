# BANKIST

## Table Of Contents

    - [Introduction](#introduction)
        - [Why This?](#why-this?)

    - [Project Brief](#project-brief)
        - [In Depth Description](#in-depth-description)
        - [Working Rundown](#how-it-works)

    - [Learning Points & Takeaway](#learning-points-&-takeaway)

    - [Version History](#version-history)

    - [Misc](#misc)

## Introduction

This is my fourth major Javascript project from the Javascript complete course by Jonas Scmedtmann, this time showcasing use of APIS, refactoring and OOP. Originally found on [Udemy, The Javascript Complete Course by Jonas Scmedtmann](https://www.udemy.com/course/the-complete-javascript-course/), the project is a workout tracking map app.

### Why This?

As part of the course this was a project presented to us to solidify our skills with OOP, while mostly follow along learners are kind of expected to try and solve elements of the code themselves as required.

## Project Brief

### In Depth Description

On the indepth side this project utilizes OOP, the geolocation api, leaflet and open street map to create a map that the user can track their workouts on, users can add a workout, input the details and have it saved on the website for future viewing thanks to the browsers local storage.

### Working Breakdown

This is the largest application to date and has a lot of moving parts, as well as this i took the initiative to take the refactoring to a whole new level and learn how to import and export files to compartmentalize classes and code even more.

At it's core it has two major classes the app class, which contains all the core application properties and methods for the code to work and the workout class which contains the majority of all workout related properites and methods. The workout class also extends to two child classes each with their own unique attributes for each exercise.

We use importing and exporting to get our application and workouts to work together with the main link being workout -> app -> script.js

#### FUNCTIONALITY

The app has several working parts and things that it can do:

- It utilizes geolocation api to track the users exact coords at the start, enabling the map to start where your location is currently set to.

- From there users can click on the map to open a form in the side bar, this form will then allow the user to save a workouts details into an object and append that object to an array. This array is used to display the previous workouts in a list on the sidebar.

- when the form is submitted a marker with details is placed on the map for the user to see where their workout was. The user can then click on the marker to show or hide the popup and click on the workouts in the workout bar to navigate to the relevant workout.

- As well as this thanks to local storage we can save and load workouts on each browser

## Learning Points & Takeaway

This project was a great example of OOP using apis and other tools to create a working app.

## Version History

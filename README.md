# Point Pods

Point Pods is a React-based tournament manager for any multi-player game where each game ends with a numeric score or points value per player. Individual games each round are termed "pods." This uses localstorage to store player and tournament information, with no network interaction.

It supports:

- Custom minimum & maximum players per pod
- Pairing logic based on randomization or points total
- Moving players between pods, or creating a new one
- Dropping players from the tournament
- Adding new players after the tournament starts
- Print view for the player list
- Print view the pods such that the printout can be cut into slips for points to be filled out

Of note, clearing your browser's local storage will cause all data to vanish. Similarly, you need to use the same device and browser to access stored data, and incognito mode use is destructive.

## Getting Started

The project was created using [Node](https://nodejs.org/en/) and [create-react-app](https://github.com/facebook/create-react-app).

### Dependencies

* [Node](https://nodejs.org/en/)

### Built With

* [React](https://github.com/facebook/react/)
* [react-router](https://github.com/ReactTraining/react-router)
* [localforage](https://github.com/localForage/localForage)
* [react-select](https://github.com/jedwatson/react-select)
* [react-swipeable-views](https://github.com/oliviertassinari/react-swipeable-views)
* [Material-UI](https://github.com/mui-org/material-ui)

### Installing

To install it locally, simply clone or download the repository and run `npm run build`, and then host the build folder's static files in whatever your prefered setup is. Note that react-router has to be considered, so for nginx the location string is:
```
location / {
  try_files $uri /index.html;
}
```

### Development and Testing

For a development build, run `npm start` which uses react-scripts from create-react-app to compile and host the app on port 8000.

If you wish to run the tests, run `npm test`. Testing is done using [Jest](https://jestjs.io/) and [Enzyme](http://airbnb.io/enzyme/).

## Authors

* [Ryan Bragg](https://github.com/ryanabragg)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

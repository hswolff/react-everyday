# React Everyday

I'm trying to make an app for the month of September.

I'm also going to try to video log it along the way.

Please wish me all the luck.

<3

## Developer Setup

1. Clone this repo
1. `npm install`
1. `npm start`

## Roadmap

An outline of the screens we're going to make.

Project List Screen

- [x] List of projects
- [x] Data to show for each item
  - [x] Title
  - [x] Show last photo taken if it exists
  - [x] Number of photos taken
  - [x] Start of first photo and last photo
- [x] Can add a project

Add Project Screen

- [x] Prompt just for a title

Data Management

- [x] https://facebook.github.io/react-native/docs/0.56/asyncstorage
- [x] https://github.com/aweary/react-copy-write
- [ ] Cache dates that have pictures in data and lazily sync when a project is loaded
- [x] https://docs.expo.io/versions/v29.0.0/sdk/filesystem
- [ ] Add TypeScript definitions to the Selector component of react-copy-write

Project Screen

- [x] Render calendar https://github.com/wix/react-native-calendars
  - [x] For day that has a picture show it
  - [x] For future days grey it out
  - [x] For days that don’t have a picture show the number of the day
  - [x] When a user clicks on a day open the camera screen
  - [x] When a user clicks on an image it brings them to the CameraScreen in preview mode
- [x] Show edit icon in top right
  - [x] Delete project
  - [ ] Rename project
  - [ ] Export project
  - [ ] Reminders.
  - [ ] Reset alignment guides
- [ ] Show play icon
  - [ ] Stitch together all pictures into a video
  - [ ] Control FPS
  - [ ] Whether it loops

Camera Screen

- [x] https://docs.expo.io/versions/v29.0.0/sdk/camera
- [x] Flip front or back camera
- [x] Flash on or off
- [ ] Show / hide alignment guides
- [x] Close camera
- [x] Take photo
- [x] After take photo show preview.
- [x] Then allow user to retake or accept
- [ ] Allow a user to pick a photo from their photo library

Add alignment guide support

- [ ] Do automatically when first take a photo in a new orient
- [ ] Add option menu to reset alignment guides
- [ ] Save positions in project data
- [ ] https://facebook.github.io/react-native/docs/0.56/panresponder

Add ability to set reminders to take photo

- [ ] https://docs.expo.io/versions/v29.0.0/sdk/notifications
- [ ] When a user clicks on a reminder opens to the project and opens the camera
- [ ] Add to list of edit options on project page

Miscellaneous

- [ ] Lock orientation to portrait
- [ ] Change entry point to be index.js https://docs.expo.io/versions/v29.0.0/workflow/configuration
- [ ] Add support for deep linking to a project
- [ ] Find final name
- [ ] Create logo

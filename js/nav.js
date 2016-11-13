// Front-end script for navigation controls
const {ipcRenderer} = require('electron');

// Global variables
var tabIdx = 0;
var tabbedElts;
var onMenu = false;

// Establish Myo Connection
var myMyo;

$(document).ready(function () {

  var Myo = require('myo');

  // Connection error
  Myo.onError = function () {
    console.log("Couldn't connect to Myo.\nMake sure you have connected with Myo Connect.");
  }

  Myo.connect("com.MyoFBD.Editor");

  // Once connected, establish myMyo object and global settings
  Myo.on('connected', function () {

    Myo.setLockingPolicy("none");
    myMyo = Myo.create();
    myMyo.unlock(false);

    // Myo trigger events
    tabbedElts = $('.menutabbed').toArray();
    createTabbedMyoEvents();

    // Set first highlighted button
    $('#' + tabbedElts[tabIdx].id).css('background-color', 'yellow');
  });

  // Standard trigger events
  createStandardEvents();
});

// Create tab navigation events
function createTabbedMyoEvents() {
  console.log("attaching events");
  Myo.on('wave_out', function() {
    console.log("hit wave out");
    // Iteration handling
    if (tabIdx + 1 >= tabbedElts.length) {
      tabIdx = 0;
    }
    else {
      tabIdx++;
    }

    if (tabIdx == 0) {
      replaceIdx = tabbedElts.length -1;
    }
    else {
      replaceIdx = tabIdx - 1;
    }

    $('#' + tabbedElts[replaceIdx].id).css('background-color', '#222233');
    console.log("Tabbing to " + tabbedElts[tabIdx].id + "!");
    $('#' + tabbedElts[tabIdx].id).css('background-color', 'yellow');
  });

  Myo.on('wave_in', function() {

    // Iteration handling
    if (tabIdx == 0) {
      tabIdx = tabbedElts.length - 1;
    }
    else {
      tabIdx--;
    }

    if (tabIdx == tabbedElts.length - 1) {
      replaceIdx = 0;
    }
    else {
      replaceIdx = tabIdx + 1;
    }

    $('#' + tabbedElts[replaceIdx].id).css('background-color', '#222233');
    console.log("Tabbing to " + tabbedElts[tabIdx].id + "!");
    $('#' + tabbedElts[tabIdx].id).css('background-color', 'yellow');
  });

  Myo.on('fist', function() {
    console.log("Clicking " + tabbedElts[tabIdx].id + "!");
    $('#' + tabbedElts[tabIdx].id).trigger('click');
  });

  Myo.on('double_tap', function() {
    console.log('Double tap!');
    if (!onMenu) {
      tabbedElts = $('.menutabbed').toArray();
      onMenu = true;
    }
    else {
      tabbedElts = $('.tabbed').toArray();
      onMenu = false;
    }

    tabIdx = 0;
  });
}

function createStandardEvents() {

  // CLICK CONTROL
  $('#home').on('click', function () {
    changeWindow('index.html');
  });

  $('#about').on('click', function () {
    changeWindow('about.html');
  });

  $('#help').on('click', function () {
    changeWindow('help.html');
  });

  $('#settings').on('click', function() {
    changeWindow('settings.html');
  });

  $('#loadDiagram').on('click', function () {
    changeWindow('loadDiagram.html');
  });

  $('#newDiagram').on('click', function () {
    changeWindow('newDiagram.html');
  });
}

function changeWindow(page_url) {
  if(location.href.split("/").slice(-1) != page_url) {
    ipcRenderer.send('changeWindow', page_url);
  }
}

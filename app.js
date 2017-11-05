'use strict';

var imgArr = [['R2-D2 Bag', 'img/bag.jpg'], ['Banana Cutter', 'img/banana.jpg'], ['Bathroom iPad Stand', 'img/bathroom.jpg'], ['Yellow Boots', 'img/boots.jpg'], ['Multi-function Toaster', 'img/breakfast.jpg'], ['Meatball Bubble Gum', 'img/bubblegum.jpg'], ['Red Chair', 'img/chair.jpg'], ['Cthulhu Toy', 'img/cthulhu.jpg'], ['Doggie Duck Bill', 'img/dog-duck.jpg'], ['Can Of Dragon Meat', 'img/dragon.jpg'], ['Utencil Pen', 'img/pen.jpg'], ['Pet Sweep', 'img/pet-sweep.jpg'], ['Pizza Scissors', 'img/scissors.jpg'], ['Shark Sleeping Bag', 'img/shark.jpg'], ['Baby Sweep Oneside', 'img/sweep.png'], ['Tauntaun Sleeping Bag', 'img/tauntaun.jpg'], ['Can Of Unicorn Meat', 'img/unicorn.jpg'], ['Tentacle USB', 'img/usb.gif'], ['Water Can', 'img/water-can.jpg'], ['Unique Wine Glass', 'img/wine-glass.jpg']];
var counter = 0;
var imgEl = document.getElementById('left-pic');
var imgEl2 = document.getElementById('center-pic');
var imgEl3 = document.getElementById('right-pic');
var ctx = document.getElementById('chart').getContext('2d');

// array to store the objects
Image.allImages = [];
Image.justViewed = [];
Image.pics = [imgEl, imgEl2, imgEl3];
Image.results = document.getElementById('results');

// make an object
function Image(name, filepath) {
  this.name = name;
  this.filepath = filepath;
  this.votes = 0;
  this.views = 0;
  Image.allImages.push(this);
}

// create all the Image Objects
function createImageObjects() {
    for (var i = 0; i < imgArr.length; i++) {
        new Image(imgArr[i][0], imgArr[i][1]);
    }
}
createImageObjects();


// var testObject = {name:"test", time:"Date 2017-02-03T08:38:04.449Z"};
// localStorage.setItem('testObject', JSON.stringify(testObject));
// var retrievedObject = localStorage.getItem('testObject');
// console.log('retrievedObject: ', JSON.parse(retrievedObject));

console.log(Image.allImages);
// localStorage.removeItem('Images');
localStorage.setItem('Images', JSON.stringify(Image));
// localStorage["Images"] = JSON.stringify(Image);
// var storeImageObjs = JSON.parse(localStorage.getItem('Images'));
var retrievedObject = localStorage.getItem('Images');
console.log('testing ' + JSON.parse(retrievedObject));



// add all the event listeners
var container = document.getElementById('container');
container.addEventListener('click', handleClick);
  
// showImages();


function showImages() {
    var currentlyShowing = [];
    var storedImages = JSON.parse(localStorage["Images"]);
    
    // make left image unique
    currentlyShowing[0] = getRandomIndex();
    while (storedImages.justViewed.indexOf(currentlyShowing[0]) !== -1) {
        currentlyShowing[0] = getRandomIndex();
    }

    currentlyShowing[1] = getRandomIndex();
    while (currentlyShowing[0] === currentlyShowing[1] 
        || storedImages.justViewed.indexOf(currentlyShowing[1]) !== -1) {
        currentlyShowing[1] = getRandomIndex();
    }

    currentlyShowing[2] = getRandomIndex();
    while (currentlyShowing[0] === currentlyShowing[2] 
        || currentlyShowing[1] === currentlyShowing[2] 
        || storedImages.justViewed.indexOf(currentlyShowing[2]) !== -1) {
        currentlyShowing[2] = getRandomIndex();
    }

    for (var i = 0; i < storedImages.pics.length; i++) {
        storedImages.pics[i].src = storedImages.allImages[currentlyShowing[i]].filepath;
        storedImages.pics[i].id = storedImages.allImages[currentlyShowing[i]].name;
        storedImages.allImages[currentlyShowing[i]].views += 1;
        storedImages.justViewed[i] = currentlyShowing[i];
    }
}
 
function handleClick(event) {
    console.log('total clicks: ' + counter);
    var storedImages = JSON.parse(localStorage["Images"]);
    
    if (counter > 24) {
        document.getElementById('container').removeEventListener('click', handleClick);
        showTableResults();
    }
    if (event.target.id === 'container') {
        return alert('Please click on one of the images :)');
    }

    counter += 1;
    for (var i = 0; i < storedImages.allImages.length; i++) {
        if (event.target.id === storedImages.allImages[i].name) {
            storedImages.allImages[i].votes += 1;
            console.log(event.target.id + ' has ' + storedImages.allImages[i].votes + ' votes in ' + storedImages.allImages[i].views + ' views');
        }
    }

    localStorage["Images"] = JSON.stringify(storedImages);
    showImages();
}

// show the final results in a table
function showTableResults() {
    var allNames = [];
    var allVotes = [];
    var labelColors = [];

    var storedImages = JSON.parse(localStorage["Images"]);
    

    // create all the data we need for the chart
    for (var i = 0; i < storedImages.length; i++) {
        allNames.push(storeImagesd[i].name);
        allVotes.push(storeImagesd[i].votes);
        labelColors.push(getRandomColor());
    }

    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: allNames,
          datasets: [{
            label: '# of Votes',
            data: allVotes,
            backgroundColor: labelColors
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
}


// Helper functions

// this function returns a random number from 0 to the max number of images
function getRandomIndex() {
    return Math.floor(Math.random() * Image.allImages.length);
}
  
// this function rounds a decimal to n number of places
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// this function creates a random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

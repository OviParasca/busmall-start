'use strict';

var imgArr = [['R2-D2 Bag', 'img/bag.jpg'], ['Banana Cutter', 'img/banana.jpg'], ['Bathroom iPad Stand', 'img/bathroom.jpg'], ['Yellow Boots', 'img/boots.jpg'], ['Multi-function Toaster', 'img/breakfast.jpg'], ['Meatball Bubble Gum', 'img/bubblegum.jpg'], ['Red Chair', 'img/chair.jpg'], ['Cthulhu Toy', 'img/cthulhu.jpg'], ['Doggie Duck Bill', 'img/dog-duck.jpg'], ['Can Of Dragon Meat', 'img/dragon.jpg'], ['Utencil Pen', 'img/pen.jpg'], ['Pet Sweep', 'img/pet-sweep.jpg'], ['Pizza Scissors', 'img/scissors.jpg'], ['Shark Sleeping Bag', 'img/shark.jpg'], ['Baby Sweep Oneside', 'img/sweep.png'], ['Tauntaun Sleeping Bag', 'img/tauntaun.jpg'], ['Can Of Unicorn Meat', 'img/unicorn.jpg'], ['Tentacle USB', 'img/usb.gif'], ['Water Can', 'img/water-can.jpg'], ['Unique Wine Glass', 'img/wine-glass.jpg']];
var imgEl = document.getElementById('left-pic');
var imgEl2 = document.getElementById('center-pic');
var imgEl3 = document.getElementById('right-pic');
var ctx = document.getElementById('chart').getContext('2d');

// Local Storage variables
var storedImgArr = JSON.parse(localStorage.getItem('Images'));
var storedCounter = JSON.parse(localStorage.getItem('Counter'));

// array to store the objects
Image.allImages = [];
Image.justViewed = [];
Image.pics = [imgEl, imgEl2, imgEl3];

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

// Init the local storage variables (if empty)
if (storedImgArr === 'undefined') {
    console.log('stored image array is empty');
    localStorage.setItem('Images', JSON.stringify(Image.allImages));    
}
if (storedCounter === 'undefined') {
    console.log('stored counter is empty');
    storedCounter = 0;
    localStorage.setItem('Counter', JSON.stringify(storedCounter));  
}


// add all the event listeners
var container = document.getElementById('container');
container.addEventListener('click', handleClick);
  
showImages();


function showImages() {
    var currentlyShowing = [];

    currentlyShowing[0] = getRandomIndex();
    while (Image.justViewed.indexOf(currentlyShowing[0]) !== -1) {
        currentlyShowing[0] = getRandomIndex();
    }

    currentlyShowing[1] = getRandomIndex();
    while (currentlyShowing[0] === currentlyShowing[1] 
        || Image.justViewed.indexOf(currentlyShowing[1]) !== -1) {
        currentlyShowing[1] = getRandomIndex();
    }

    currentlyShowing[2] = getRandomIndex();
    while (currentlyShowing[0] === currentlyShowing[2] 
        || currentlyShowing[1] === currentlyShowing[2] 
        || Image.justViewed.indexOf(currentlyShowing[2]) !== -1) {
        currentlyShowing[2] = getRandomIndex();
    }

    for (var i = 0; i < Image.pics.length; i++) {
        Image.pics[i].src = storedImgArr[currentlyShowing[i]].filepath;
        Image.pics[i].id = storedImgArr[currentlyShowing[i]].name;
        storedImgArr[currentlyShowing[i]].views += 1;
        Image.justViewed[i] = currentlyShowing[i];
    }   
}
 
function handleClick(event) {
    console.log('total clicks: ' + storedCounter);

    if (storedCounter > 24) {
        storedCounter = 0;
        document.getElementById('container').removeEventListener('click', handleClick);
        showTableResults();

        // reset the local storage
        localStorage.setItem('Counter', JSON.stringify(storedCounter));        
        for (var i = 0; i < storedImgArr.length; i++) {
            storedImgArr[i].votes = 0;
        }
        localStorage.setItem('Images', JSON.stringify(storedImgArr));         
    } else {
        if (event.target.id === 'container') {
            return alert('Nope, you need to click on an image.');
        }

        storedCounter += 1;
        localStorage.setItem('Counter', JSON.stringify(storedCounter));    
        for (var i = 0; i < storedImgArr.length; i++) {
            if (event.target.id === storedImgArr[i].name) {
                storedImgArr[i].votes += 1;
                // update the local storage
                localStorage.setItem('Images', JSON.stringify(storedImgArr)); 
                console.log(event.target.id + ' has ' + storedImgArr[i].votes + ' votes in ' + storedImgArr[i].views + ' views');
            }
        }

        showImages();
    }
}

// show the final results in a table
function showTableResults() {
    var allNames = [];
    var allVotes = [];
    var labelColors = [];

    // create all the data we need for the chart
    for (var i = 0; i < storedImgArr.length; i++) {
        allNames.push(storedImgArr[i].name);
        allVotes.push(storedImgArr[i].votes);
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


/// Helper functions

// this function returns a random number from 0 to the max number of images
function getRandomIndex() {
    return Math.floor(Math.random() * Image.allImages.length);
}
  
// this function rounds a decimal to n number of places
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// this function creates and returns a random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

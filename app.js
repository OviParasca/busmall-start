'use strict';

var imgArr = [['R2-D2 Bag', 'img/bag.jpg'], ['Banana Cutter', 'img/banana.jpg'], ['Bathroom iPad Stand', 'img/bathroom.jpg'], ['Yellow Boots', 'img/boots.jpg'], ['Multi-function Toaster', 'img/breakfast.jpg'], ['Meatball Bubble Gum', 'img/bubblegum.jpg'], ['Red Chair', 'img/chair.jpg'], ['Cthulhu Toy', 'img/cthulhu.jpg'], ['Doggie Duck Bill', 'img/dog-duck.jpg'], ['Can Of Dragon Meat', 'img/dragon.jpg'], ['Utencil Pen', 'img/pen.jpg'], ['Pet Sweep', 'img/pet-sweep.jpg'], ['Pizza Scissors', 'img/scissors.jpg'], ['Shark Sleeping Bag', 'img/shark.jpg'], ['Baby Sweep Oneside', 'img/sweep.png'], ['Tauntaun Sleeping Bag', 'img/tauntaun.jpg'], ['Can Of Unicorn Meat', 'img/unicorn.jpg'], ['Tentacle USB', 'img/usb.gif'], ['Water Can', 'img/water-can.jpg'], ['Unique Wine Glass', 'img/wine-glass.jpg']];
var counter = 0;
var imgEl = document.getElementById('left-pic');
var imgEl2 = document.getElementById('center-pic');
var imgEl3 = document.getElementById('right-pic');

// array to store the objects
Image.allImages = [];
Image.justViewed = [];
Image.pics = [imgEl, imgEl2, imgEl3];
Image.results = document.getElementById('results');
Image.counter = 0;

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

// add all the event listeners
var container = document.getElementById('container');
container.addEventListener('click', handleClick);
  
showImages();


function getRandomIndex() {
    return Math.floor(Math.random() * Image.allImages.length);
}
  
function showImages() {
    var currentlyShowing = [];
    // make left image unique
    currentlyShowing[0] = getRandomIndex();
    while (Image.justViewed.indexOf(currentlyShowing[0]) !== -1) {
        currentlyShowing[0] = getRandomIndex();
    }

    currentlyShowing[1] = getRandomIndex();
    while (currentlyShowing[0] === currentlyShowing[1] || Image.justViewed.indexOf(currentlyShowing[1]) !== -1) {
        currentlyShowing[1] = getRandomIndex();
    }

    currentlyShowing[2] = getRandomIndex();
    while (currentlyShowing[0] === currentlyShowing[2] || currentlyShowing[1] === currentlyShowing[2] || Image.justViewed.indexOf(currentlyShowing[2]) !== -1) {
        currentlyShowing[2] = getRandomIndex();
    }

    for (var i = 0; i < Image.pics.length; i++) {
        Image.pics[i].src = Image.allImages[currentlyShowing[i]].filepath;
        Image.pics[i].id = Image.allImages[currentlyShowing[i]].name;
        Image.allImages[currentlyShowing[i]].views += 1;
        Image.justViewed[i] = currentlyShowing[i];
    }
}
 
function handleClick(event) {
    console.log('total clicks: ' + Image.counter);

    if (Image.counter > 24) {
        document.getElementById('container').removeEventListener('click', handleClick);
        showTableResults();
    }
    if (event.target.id === 'container') {
        return alert('Nope, you need to click on an image.');
    }

    Image.counter += 1;
    for (var i = 0; i < Image.allImages.length; i++) {
        if (event.target.id === Image.allImages[i].name) {
            Image.allImages[i].votes += 1;
            console.log(event.target.id + ' has ' + Image.allImages[i].votes + ' votes in ' + Image.allImages[i].views + ' views');
        }
    }

    showImages();
}

// show the final results in a table
function showTableResults() {
    // add a header li to the table
    var liEl = document.createElement('li');  
    liEl.textContent = 'Results of views and votes for each product';
    Image.results.appendChild(liEl);
    
    for (var i = 0; i < Image.allImages.length; i++) {
        if (Image.allImages[i].views > 0) {
            var liEl = document.createElement('li');
            var percentage = round(Image.allImages[i].votes / Image.allImages[i].views, 2);
            liEl.textContent = Image.allImages[i].name + ' has ' + Image.allImages[i].votes + ' votes in ' + Image.allImages[i].views + ' views. This item has been clicked ' + percentage + '% of the time.';
            Image.results.appendChild(liEl);
        }
    }
}


// Helper functions

// this function rounds a decimal to n number of places
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

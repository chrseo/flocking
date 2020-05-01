const flock = [];
var quadTree;
var system;
var alignSlider, cohesionSlider, separationSlider, numberSlider, 
    perceptionDistSlider, perceptionAngleSlider;

function setup() {
    createCanvas(800, 500);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    separationSlider = createSlider(0, 5, 1.1, 0.1);
    alignSlider = createSlider(0, 5, 1, 0.1);
    perceptionDistSlider = createSlider(0, 200, 65, 1);
    perceptionAngleSlider = createSlider(0, Math.PI, Math.PI / 3, Math.PI / 6);
    system = new Flocks();
}

function draw() {
    quadTree.clear();
    for (const boid of flock) {
        quadTree.addItem(boid.position.x, boid.position.y, boid);
    }
    background(255);
    fill(6, 43, 75);
    strokeWeight(0);
    text("cohesion: " + cohesionSlider.value(), 10, 10);
    text("separation: " + separationSlider.value(), 10, 25);
    text("alignment: " + alignSlider.value(), 10, 40);
    text("perception distance: " + perceptionDistSlider.value(), 10, 55);
    text("perception angle: " + 
        Math.round(perceptionAngleSlider.value() * (180/Math.PI)) + "°", 10, 70);
    system.simulate();
}
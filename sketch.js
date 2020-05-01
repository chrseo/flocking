const flock = [];
var quadTree;
var system;
var alignSlider, cohesionSlider, separationSlider, numberSlider, 
    perceptionDistSlider, perceptionAngleSlider;

function setup() {
    createCanvas(800, 500);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
        cohesionLabel = createDiv('Cohesion ');
        cohesionLabel.position(10, 510);  
        cohesionSlider.parent(cohesionLabel);
    separationSlider = createSlider(0, 5, 1.1, 0.1);
        separationLabel = createDiv('Separation ');
        separationLabel.position(10, 530);  
        separationSlider.parent(separationLabel);
    alignSlider = createSlider(0, 5, 1, 0.1);
        alignLabel = createDiv('Alignment ');
        alignLabel.position(10, 550);  
        alignSlider.parent(alignLabel);
    perceptionDistSlider = createSlider(0, 200, 65, 1);
        perceptionDistLabel = createDiv('Perception distance ');
        perceptionDistLabel.position(10, 570);  
        perceptionDistSlider.parent(perceptionDistLabel);
    perceptionAngleSlider = createSlider(0, Math.PI, Math.PI / 3, Math.PI / 6);
        perceptionAngleLabel = createDiv('Perception angle ');
        perceptionAngleLabel.position(10, 590);  
        perceptionAngleSlider.parent(perceptionAngleLabel);
    system = new Flocks();
}

function draw() {
    quadTree.clear();
    for (const boid of flock) {
        quadTree.addItem(boid.position.x, boid.position.y, boid);
    }
    cohesionSlider.html();
    separationSlider.html();
    alignSlider.html();
    perceptionDistSlider.html();
    perceptionAngleSlider.html();
    background(255);
    fill(6, 43, 75);
    strokeWeight(0);
    text("Cohesion: " + cohesionSlider.value(), 10, 10);
    text("Separation: " + separationSlider.value(), 10, 25);
    text("Alignment: " + alignSlider.value(), 10, 40);
    text("Perception distance: " + perceptionDistSlider.value(), 10, 55);
    text("Perception angle: " + 
        Math.round(perceptionAngleSlider.value() * (180/Math.PI)) + "°", 10, 70);
    system.simulate();
}
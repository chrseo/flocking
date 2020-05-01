// Flocking Boids
// Daniel Shiffman
// https://www.youtube.com/watch?v=mhjuuHl6qHM

const flock = [];

let alignSlider, cohesionSlider, separationSlider, numberSlider;

let quadTree;

function setup() {
    createCanvas(640, 360);
    alignSlider = createSlider(0, 5, 1, 0.1);
    cohesionSlider = createSlider(0, 5, 1, 0.1);
    separationSlider = createSlider(0, 5, 1, 0.1);

    quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));

    let numBoids = 100;
    for (let i = 0; i < numBoids; i++) {
        flock.push(new Boid()); 
    }
}

function draw() {
    quadTree.clear()
    for (const boid of flock) {
        quadTree.addItem(boid.position.x, boid.position.y, boid);
    }

    background(255);

    for (const boid of flock) {
        boid.edges();
        boid.flock(flock);
        boid.update();
        boid.show(flock);
    }
}

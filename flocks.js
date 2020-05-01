class Flocks {
    constructor() {
        quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));
        let numBoids = 100;
        for (let i = 0; i < numBoids; i++) {
            flock.push(new Boid()); 
        }
    }

    simulate() {
        for (const boid of flock) {
            boid.wrap();
            boid.flock(flock);
            boid.update();
            boid.display(flock);
        }
    }
}

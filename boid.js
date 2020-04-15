class Boid {
    constructor() {
        this.position = createVector(width / 2, height / 2);
        this.velocity = createVector();
        this.acceleration = createVector();
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
    }

}
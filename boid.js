// Flocking Boids
// Daniel Shiffman
// https://www.youtube.com/watch?v=mhjuuHl6qHM
class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 4;
        this.perception = 50;
        this.maxBirdsInPerception = 5;
    }

    //wraps boids around screen
    edges() {
        if (this.position.x > width) {
          this.position.x = 0;
        } else if (this.position.x < 0) {
          this.position.x = width;
        }
        if (this.position.y > height) {
          this.position.y = 0;
        } else if (this.position.y < 0) {
          this.position.y = height;
        }
      }
      
    flock(boids) {
        let align = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        align.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());

        //resulting vector is sum of forces
        this.acceleration.add(cohesion).add(align).add(separation);
    }

    align(boids) {
        let steer = createVector();
        let countOthers = 0;

        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, this.perception, this.maxBirdsInPerception)) {
            steer.add(other.velocity);
            countOthers++;
        }

        if (countOthers > 0) {
            //formula for steering by Craig Reynolds
            steer.div(countOthers);
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        
        return steer;
    }

    cohesion(boids) {
        let avgLocation = createVector();
        let countOthers = 0;

        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, this.perception, this.maxBirdsInPerception)) {
            avgLocation.add(other.position);
            countOthers++;
        }

        if (countOthers > 0) {
            avgLocation.div(countOthers);
            avgLocation.sub(this.position);
            avgLocation.setMag(this.maxSpeed);
            avgLocation.sub(this.velocity);
            avgLocation.limit(this.maxForce);
        }
        
        return avgLocation;
    }

    separation(boids) {
        let avgLocation = createVector();
        let countOthers = 0;

        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, this.perception, this.maxBirdsInPerception)) {
            let diff = p5.Vector.sub(this.position, other.position);
            let distance = diff.mag();
            if (distance === 0) continue;
            diff.div(distance * distance); 
            avgLocation.add(diff);
            countOthers++;
        }

        if (countOthers > 0) {
            avgLocation.div(countOthers);
            avgLocation.setMag(this.maxSpeed);
            avgLocation.sub(this.velocity);
            avgLocation.limit(this.maxForce);
        }
        
        return avgLocation;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.acceleration = createVector(0, 0);
    }

    show(boids) {
        //initial color 
        let red1 = 0;
        let green1 = 100;
        let blue1 = 255;

        //color in high density
        let red2 = 255;
        let green2 = 0;
        let blue2 = 0;

        let colorPerception = 35;
        let countOthers = 0;
        let threshold = 15;

        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, colorPerception, threshold)) {
            countOthers++;
        }

        let percent = countOthers / threshold;
        let antiPercent = 1 - percent;

        red2 = red2 * percent;
        green2 = green2 * percent;
        blue2 = blue2 * percent;

        red1 = red1 * antiPercent;
        green1 = green1 * antiPercent;
        blue1 = blue1 * antiPercent;

        red = (red1 + red2) / 2;
        green = (green1 + green2) / 2;
        blue = (blue1 + blue2) / 2;

        strokeWeight(12);
        stroke(red, green, blue);
        point(this.position.x, this.position.y);
    }
}
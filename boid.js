class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.limit(4);
        this.acceleration = createVector();
        this.maxForce = random(0.1, 0.3);
        this.maxSpeed = 5;
        this.perceptionDist = perceptionDistSlider.value();
        this.perceptionAngle = perceptionAngleSlider.value();
        this.maxBirdsInPerception = 15;
    }

    wrap() {
        //wraps boids around screen
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

        //resulting acceleration vector is sum of forces (zeros each update)
        this.acceleration.add(cohesion).add(align).add(separation);
    }

    align(boids) {
        let steer = createVector();
        let countOthers = 0;
        for (const other of quadTree.getItemsInRadius(this.position.x, 
            this.position.y, this.perceptionDist, this.maxBirdsInPerception)) {
            let toOther = p5.Vector.sub(other.position, this.position);
            if ((-1 * this.perceptionAngle) < toOther.angleBetween(this.velocity) < this.perceptionAngle) {
                steer.add(other.velocity);
                countOthers++;
            }
        }
        if (countOthers > 0) {
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

        for (const other of quadTree.getItemsInRadius(this.position.x, 
            this.position.y, this.perceptionDist, this.maxBirdsInPerception)) {
            let toOther = p5.Vector.sub(other.position, this.position);
            if ((-1 * this.perceptionAngle) < toOther.angleBetween(this.velocity) < this.perceptionAngle) {
                avgLocation.add(other.position);
                countOthers++;
            }
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

        for (const other of quadTree.getItemsInRadius(this.position.x, 
            this.position.y, this.perceptionDist, this.maxBirdsInPerception)) {
            let toOther = p5.Vector.sub(other.position, this.position);
            if ((-1 * this.perceptionAngle) < toOther.angleBetween(this.velocity) < this.perceptionAngle) {
                let diff = p5.Vector.sub(this.position, other.position);
                let distance = diff.mag();
                if (distance < 0.2) {
                    diff.div(Math.pow(distance, 3));
                } else {
                    diff.div(Math.pow(distance, 2)); 
                }
                avgLocation.add(diff);
                countOthers++;
            }
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
        this.perceptionDist = perceptionDistSlider.value();
        this.perceptionAngle = perceptionAngleSlider.value();
    }

    display(boids) {
        //initial color 
        let RGB1 = [0, 100, 255];

        //color in high density
        let RGB2 = [255, 0, 0];

        let colorPerception = 35;
        let countOthers = 0;
        let threshold = 15;

        for (const other of quadTree.getItemsInRadius(this.position.x, 
            this.position.y, colorPerception, threshold)) {
            countOthers++;
        }
    
        let percent = countOthers / threshold;
        let antiPercent = 1 - percent;

        RGB1 = RGB1.map(function(x) { return x * antiPercent; });
        RGB2 = RGB2.map(function(x) { return x * percent; });

        red = (RGB1[0] + RGB2[0]) / 2;
        green = (RGB1[1] + RGB2[1]) / 2;
        blue = (RGB1[2] + RGB2[2]) / 2;

        strokeWeight(12);
        stroke(red, green, blue);
        point(this.position.x, this.position.y);
    }
}

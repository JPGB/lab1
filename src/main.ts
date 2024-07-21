// import "./style.css";
import P5 from "p5";
import { Vector } from "p5";

const sketch = (p5Instance: P5) => {
	const planets = [
		new Planet(p5Instance, new Vector(4, 3), 10, new Vector(0.7, 0.7)),
		// new Planet(p5Instance, new Vector(440, 450), 10, new Vector(-0.6, -0.6)),
	];
	const suns = [
		new Sun(p5Instance, new Vector(135, 75), 50, 22),
		new Sun(p5Instance, new Vector(145, 145), 50, 24),
	];

	const physics = new Physics(suns, planets);

	p5Instance.setup = () => {
		p5Instance.createCanvas(500, 500);

		p5Instance.background("#f1f1f1");
	};

	p5Instance.draw = () => {
		p5Instance.background("#f1f1f1");

		for (const sun of suns) {
			sun.draw();
		}

		for (const planet of planets) {
			planet.draw();
		}

		physics.gravity();
	};
};

class Planet {
	public get radius(): number {
		return this._radius;
	}
	public get position(): Vector {
		return this._position;
	}
	public set position(value: Vector) {
		this._position = value;
	}

	constructor(
		private p5: P5,
		private _position: Vector,
		private _radius: number,
		private velocity: Vector,
	) {}

	draw() {
		this.p5.fill("white");
		this.position = new Vector(this.velocity.x, this.velocity.y).add(
			this.position,
		);

		this.p5.circle(this.position.x, this.position.y, this.radius * 2);
	}

	gravityPull(distance: Vector, gravityStrength: number) {
		// this.p5.fill("#f1f1f1f1");
		// this.p5.strokeWeight(0.3);
		// this.p5.circle(this.position.x, this.position.y, this.radius * 2);

		if (distance.x < 0) {
			this.velocity.add(gravityStrength * 0.0005);
		} else if (distance.x > 0) {
			this.velocity.add(-gravityStrength * 0.0005);
		}

		if (distance.y < 0) {
			this.velocity.add(0, gravityStrength * 0.0005);
		} else if (distance.y > 0) {
			this.velocity.add(0, -gravityStrength * 0.0005);
		}
	}
}

class Sun {
	public get gravityStrength(): number {
		return this._gravityStrength;
	}
	public get gravityRadius(): number {
		return this._gravityRadius;
	}
	public get position(): Vector {
		return this._position;
	}
	public set position(value: Vector) {
		this._position = value;
	}

	constructor(
		private p5: P5,
		private _position: Vector,
		private _gravityRadius: number,
		private _gravityStrength: number,
	) {}

	draw() {
		this.p5.fill("yellow");
		this.p5.circle(this.position.x, this.position.y, 20);

		this.p5.noFill();
		this.p5.strokeWeight(0.3);
		this.p5.circle(this.position.x, this.position.y, this.gravityRadius * 2);
	}
}

class Physics {
	constructor(private suns: Sun[], private planets: Planet[]) {}

	gravity() {
		for (const planet of this.planets) {
			for (const sun of this.suns) {
				const distanceX = planet.position.x - sun.position.x;
				const distanceY = planet.position.y - sun.position.y;

				if (
					Math.sqrt(distanceX * distanceX + distanceY * distanceY) <=
					planet.radius + sun.gravityRadius
				) {
					planet.gravityPull(
						new Vector(distanceX, distanceY),
						sun.gravityStrength,
					);
				}
			}
		}
	}
}

new P5(sketch);

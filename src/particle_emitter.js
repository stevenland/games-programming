// pretty highly optimised - uses only one array and immediately resets particles at end of life

export {createEffect, updateEffect, drawEffect};

function createEffect(color, partSize, decayTime, speed, num, radius = 0, reverse = false) {
    let s = {}; // state
    s.color = color;
    s.decayTimeAve = decayTime;
    s.timer = 0;
    s.size = partSize;
    s.speed = speed;
    s.direction = Math.PI/2 + Math.random() * 0.6 - 0.3;
    s.objectPoolLength = num;
    s.radius = radius;
    s.reverse = reverse;
    s.objectPool = createObjectPool(s.objectPoolLength, s);

	return s;
}

function createObjectPool(num, point) {
	let pool = [];
	for (let i = 0; i < num; i++) {
		pool.push(createParticle(point));
	}
	return pool;
}

function updateEffect(point, loop) {
    // update timer and release particles
    point.timer += loop.timestep;


    // update particles
    for (let i = 0; i < point.objectPoolLength; i++) {
        let dot = point.objectPool[i];
        // update x and y
        dot.x += dot.xVel * loop.timestep;
        dot.y += dot.yVel * loop.timestep;


        // update life
        dot.life -= loop.timestep;
        if (dot.life < 0) {
        	resetParticle(dot, point);
        }
    }
}

function drawEffect(point, ctx) {
    ctx.fillStyle = point.color;
    for (let i = 0; i < point.objectPoolLength; i++) {
		ctx.save();
        let dot = point.objectPool[i];
        // draw particle
        //ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.beginPath();
        //ctx.fillRect(0, 0, dot.size, dot.size);
        ctx.arc(dot.x, dot.y, dot.size / 2, 0, Math.PI * 2);
        //ctx.font = '12px verdana';
        //let text = Math.round(dot.life/dot.lifeSpan * 100)
        //ctx.fillText(text, 0, 0)
        ctx.fill();
        ctx.restore();
    }
}

function resetParticle(s, point) {
	s.x = s.startX;
	s.y = s.startY;
	s.life = s.lifeSpan;
}

function createParticle(point) {
	let randomProgress = Math.random();
	let s = {};
	s.lifeSpan = point.decayTimeAve + Math.random() * 200 - 100;
	s.direction = point.direction + Math.random() * 1 - 0.5;
	s.speed = point.speed + Math.random() * 2 * 0.2 * point.speed + - 0.1 * point.speed;
	s.xVel = Math.cos(s.direction) * s.speed;
	s.yVel = Math.sin(s.direction) * s.speed;
	s.startX = Math.random() * 1200 - 100;
	s.startY = -5;
	s.x = s.startX + s.xVel * s.lifeSpan * randomProgress;
	s.y = s.startY + s.yVel * s.lifeSpan * randomProgress;
	if (point.reverse && Math.random() > 0.2){
		s.xVel = -s.xVel;
		s.yVel = -s.yVel;
	}
	s.life = s.lifeSpan - s.lifeSpan * randomProgress;
	s.size = Math.ceil(Math.random() * 7 + 1);
	return s;
}

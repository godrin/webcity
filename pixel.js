
function init() {

	const canvas = document.getElementById("ground");

	const W = canvas.getAttribute("width")*1.0;
	const H = canvas.getAttribute("height")*1.0;

	const ground = new Float32Array(W*H);
	const co2 = new Uint8Array(W*H);

	function i(x,y) {
		return x+y*W;
	}

	function forAll(grid, fct) {
		for(let x=0;x<W;x++) {
			for(let y=0;y<H;y++) {
				grid[i(x,y)] = fct(x,y,grid[i(x,y)]);
			}
		}
	}

	function initData(grid, variance) {
		forAll(grid, function() {
			return Math.floor(Math.random()*variance);
		});
	}
	initData(ground, 5);
	initData(co2, 3);

	function buildingColor(val) {
		switch(val) {
			case 2: return [0,200,0,255];
			default: return [0,0,0,255];
		}
	}

	function groundColor(val) {
		switch(Math.floor(val)) {
			case 1: return [100,100,100,255];
			case 2: return [150,150,150,255];
			case 3: return [200,200,200,255];
			case 4: return [250,250,250,255];
			default: return [0,0,0,255];
		}
	}

	function draw(ground, groundColor, ctx) {
		var imageData = ctx.createImageData(W,H);

		for(let x=0;x<W;x++) {
			for(let y=0;y<H;y++) {
				let c = i(x,y);

				[r,g,b,a] = groundColor(ground[c]);

				let idx = c*4;

				imageData.data[idx] = r;
				imageData.data[idx + 1] = g;
				imageData.data[idx + 2] = b;
				imageData.data[idx + 3] = a;
			}
		}

		ctx.putImageData(imageData, 0,0);
	}

	function simulate(time) {

		forAll(ground, function(x,y,v) {
			return v+0.0001*time;
		});
		//console.log(ground[0]);

	}

	var lastTime;
	function drawAll(time) {
		if(!lastTime) {
			lastTime = time;
		}
		let ctx = document.getElementById("ground").getContext("2d");
		draw(ground, groundColor, ctx);
		let ctx2 = document.getElementById("building").getContext("2d");
		draw(co2, buildingColor, ctx2);

		simulate(time - lastTime);
		requestAnimationFrame(drawAll);
		lastTime = time;
	}
	requestAnimationFrame(drawAll);
}
setTimeout(init, 100);

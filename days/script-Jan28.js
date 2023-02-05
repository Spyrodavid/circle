const canvas = document.getElementById("canvas-Jan28");
const ctx = canvas.getContext("2d");

width = window.innerWidth
height = window.innerHeight

canvas.width  = width;
canvas.height = height;

mouseDown = false

canvas.addEventListener('mousedown', function() {
    mouseDown = true;
    });
  
canvas.addEventListener('mouseup', function() {
    mouseDown = false;
    });

var baseParticle = {
    pos: math.matrix([0, 1, 1]),
    Hue: 192,
    Lightness: 45,
    radius: 20,
    static: false
}

var particleArray = []


// Set the fill style and color background
ctx.fillStyle = "black";
ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

var noiseSeed = Math.random()

var programStart = Date.now()

var t1 = Date.now()
var t2 = Date.now()

Xarr = []
Yarr =  []
Zarr = []


function makeParticle(static) {
    possibleX = (Math.random() - .5) * 20 // .1
    possibleY = (Math.random() - .5) * 20
    possibleZ = (Math.random() - .5) * 20

    var newparticle = {...baseParticle}
    
    newparticle.pos = new math.matrix([possibleX, possibleY, possibleZ])

    newparticle.Hue = (possibleX + .2) * 360 * 10

    newparticle.static = static

    particleArray.push(newparticle)
}

for (let index = 0; index < 1000; index++) {
    makeParticle(false)
}  

for (let index = 0; index < 0; index++) {
    makeParticle(true)
}  

o = 2 + Math.random() * 20
// low = two individual orbits
// high = flat seperate wings
p = 20 + Math.random() * 20
// low = smaller flatter rings
b = 1/8 + Math.random() * 2 
// making this low makes a really thin long time needle
// high = slow big rings

// 5 60 2 big wings

// .01 20 1/8 weird spiral shit


ctx.translate(width / 2, height / 2)

angle = 0

var capturer = new CCapture( { format: 'webm' } );
capturer.start()

renderDone = false
frames = 0

function render(){
	requestAnimationFrame(render);
	// rendering stuff ...
	


    t1 = Date.now()
    

    let timeElapsed = t2 - programStart

    ctx.fillStyle = "white";
    ctx.fillRect(- width / 2 , - height / 2, width, height)

    angle += .01

    if (mouseDown) {
        if (particleArray.length < 1500) 
        for (let index = 0; index < 5; index++) {
            makeParticle()
            
        }
    }

    particleArray.forEach(particle => {

        if (isNaN(particle.pos.get([0]))) {
            console.log("particle outside")
        }
        
        
        Zrotate = math.matrix(  [[Math.cos(angle), -Math.sin(angle), 0],
                                 [Math.sin(angle), Math.cos(angle), 0],
                                 [0, 0, 1]])

        Xrotate = math.matrix(  [[Math.cos(angle), 0, Math.sin(angle)],
                                 [0, 1, 0],
                                 [-Math.sin(angle), 0, Math.cos(angle)]])

        Yrotate = math.matrix(  [[1, 0, 0],
                                 [Math.cos(angle), -Math.sin(angle), 0],
                                 [Math.sin(angle), Math.cos(angle), 0]])

        curRotate = Xrotate

        nx = 0
        ny = 0
        nz = 0

        translationMatrix = [0, 0, -25]


        viewMatrix = particle.pos

        viewMatrix = math.add(viewMatrix, translationMatrix)

        viewMatrix = math.multiply(curRotate, viewMatrix)

        distance = 1 / (70 - viewMatrix.get([2])) * 100

        ctx.strokeStyle = `hsl(${particle.Hue}, 100%, ${particle.Lightness}%)`


        ctx.beginPath();
        ctx.moveTo(viewMatrix.get([0]) * 10 * distance, viewMatrix.get([1]) * distance * 10);

        if (!particle.static) {
	        x = particle.pos.get([0])
	        y = particle.pos.get([1])
	        z = particle.pos.get([2])
	        
	        
	
	        dx = o*y - o*x 
	        dy = p*x - x*z - y
	        dz = x*y - b*z
	
	
	        dt = .01
	        vel = math.multiply([dx, dy, dz], dt)
	
	        particle.pos = math.add(particle.pos, vel)
            }

    
        viewMatrix = particle.pos

        viewMatrix = math.add(viewMatrix, translationMatrix)

        viewMatrix = math.multiply(curRotate, viewMatrix)

        ctx.lineTo(viewMatrix.get([0])* distance * 10, viewMatrix.get([1])* distance * 10);
        ctx.stroke()
        
    })

    t2 = Date.now()

    var frameTime = t2 - t1

    if (frames < 1000) {
        capturer.capture( canvas );
    } else if (!renderDone) {
        console.log("RENDER DONE")
        renderDone = true
        capturer.stop()
        capturer.save()
    }

    frames ++
}
render()

function Dimension2to1(x, y, width) {
    return  Math.floor(x + y * width)
}

function Dimension1to2(i, width) {
    return [Math.floor(x % width), Math.floor(Math.floor(i / width))]
}

function outsideBounds(x, y, width, height, r=0) {
    outX = (x + r < 0 || x - r > width)
    outY = (y + r < 0 || y - r > height)

    return outX || outY
}

function outsideBound1D(pos, max) {
    out = (pos < 0 || pos > max)

    return out 
}

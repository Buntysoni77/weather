const canvas = document.getElementById('weather-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function rand(min,max){ return Math.random()*(max-min)+min; }

// Sky colors (morning, noon, evening, night)
let skyColors=[['#74ebd5','#ACB6E5'],['#fceabb','#f8b500'],['#2c3e50','#4ca1af'],['#0f2027','#203a43']];
let colorIndex=0;

// Sun
let sun={x:100,y:100,radius:60};

// Particles
let clouds=[], rainDrops=[], snowFlakes=[], lightning={active:false,timer:0};

// Weather control
let weatherTypes=['sunny','rainy','snowy','stormy'];
let currentWeather='sunny';

// Initialize particles
function initParticles(){
    clouds=[]; rainDrops=[]; snowFlakes=[];
    for(let i=0;i<12;i++) clouds.push({x:rand(0,canvas.width),y:rand(0,canvas.height/3),size:rand(80,150),speed:rand(0.2,0.7)});
    for(let i=0;i<250;i++) rainDrops.push({x:rand(0,canvas.width),y:rand(0,canvas.height),length:rand(10,20),speed:rand(2,5)});
    for(let i=0;i<100;i++) snowFlakes.push({x:rand(0,canvas.width),y:rand(0,canvas.height),radius:rand(2,5),speed:rand(0.5,1.5)});
}
initParticles();

// Randomly change weather every 1–2 minutes
setInterval(()=>{
    let newWeather = weatherTypes[Math.floor(Math.random()*weatherTypes.length)];
    currentWeather = newWeather;
    initParticles(); // reset particles for new weather
}, rand(60000,120000)); // 60–120 sec

function draw(){
    // Sky gradient
    let grad=ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0, skyColors[colorIndex][0]);
    grad.addColorStop(1, skyColors[colorIndex][1]);
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Sun (always draw)
    ctx.beginPath();
    ctx.arc(sun.x,sun.y,sun.radius,0,Math.PI*2);
    ctx.fillStyle='yellow';
    ctx.fill();
    ctx.closePath();

    // Clouds (always)
    ctx.fillStyle='rgba(255,255,255,0.8)';
    clouds.forEach(c=>{
        ctx.beginPath();
        ctx.ellipse(c.x,c.y,c.size,c.size/2,0,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        c.x+=c.speed;
        if(c.x-c.size>canvas.width) c.x=-c.size;
    });

    // Weather effects based on type
    if(currentWeather==='rainy' || currentWeather==='stormy'){
        ctx.strokeStyle='rgba(0,200,255,0.5)';
        ctx.lineWidth=2;
        rainDrops.forEach(r=>{
            ctx.beginPath();
            ctx.moveTo(r.x,r.y);
            ctx.lineTo(r.x,r.y+r.length);
            ctx.stroke();
            r.y+=r.speed;
            if(r.y>canvas.height) r.y=-r.length;
        });
    }

    if(currentWeather==='snowy'){
        ctx.fillStyle='white';
        snowFlakes.forEach(s=>{
            ctx.beginPath();
            ctx.arc(s.x,s.y,s.radius,0,Math.PI*2);
            ctx.fill();
            s.y+=s.speed;
            if(s.y>canvas.height) s.y=-s.radius;
        });
    }

    if(currentWeather==='stormy'){
        // Lightning
        if(lightning.active){
            ctx.fillStyle='rgba(255,255,255,0.3)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            lightning.timer--;
            if(lightning.timer<=0) lightning.active=false;
        } else if(Math.random()<0.005){ // random lightning
            lightning.active=true;
            lightning.timer=5;
        }
    }

    // Move sun
    sun.x+=0.05;
    if(sun.x>canvas.width+50) sun.x=-50;

    requestAnimationFrame(draw);
}
draw();

// Sky color transition
setInterval(()=>{ colorIndex=(colorIndex+1)%skyColors.length; },15000);

// Resize
window.addEventListener('resize', ()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
});

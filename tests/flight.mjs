import assert from 'node:assert/strict';
import {initial,step,strips,height} from '../src/flight.js';
const run=(s,k,seconds)=>{for(let t=0;t<seconds;t+=1/60)step(s,k,1/60);};
let s=initial();run(s,{ArrowDown:true},3);assert(s.ground,'No takeoff without airspeed');run(s,{KeyW:true},6);run(s,{KeyW:true,ArrowDown:true},5);assert(!s.ground&&!s.crashed,'Runway takeoff');const y=s.y;run(s,{ArrowDown:true},3);assert(s.y>y,'Climb');const yaw=s.yaw;run(s,{ArrowRight:true},2);assert(s.yaw>yaw,'Bank turn');run(s,{ArrowUp:true},3);assert(s.vy<0,'Descent');
for(let i=0;i<strips.length;i++){const r=strips[i];s={...initial(i),y:r.y+9,z:r.z+170,ground:false,speed:34,throttle:.25,pitch:-.09,vy:-3};run(s,{ArrowUp:true},1);run(s,{},3);assert(s.ground&&!s.crashed,`Landing ${i}`);run(s,{KeyS:true,Space:true},4);assert(s.speed===0,`Full stop ${i}`);}
s={...initial(),ground:false,x:750,z:-2200,y:1,speed:40};step(s,{},.016);assert(s.crashed,'Terrain collision');s=initial();assert(!s.crashed&&s.ground&&s.speed===0,'Retry');console.log('PASS: low-speed lift prevention, takeoff, climb, turn, descent, 3 runway landings/stops, collision, reset');

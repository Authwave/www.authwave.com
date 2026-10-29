import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const result=await build({entryPoints:[fileURLToPath(new URL('../script/graphics/circuit-geometry.es6',import.meta.url))],bundle:true,platform:'node',format:'esm',loader:{'.es6':'js'},write:false});
const {generateWire,roundedPath,generateSpacedWire,parallelClearance,demoCorridor,generateEntryWire,avoidsObstacles}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
let seed=105;
const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
for(const [width,height] of [[320,330],[600,700],[1440,720],[2208,950]])for(let i=0;i<200;i++){
 const s=generateWire(width,height,{radius:36,branchChance:1,maxBranches:2},random);
 assert.ok(s.points[0][0]<0&&s.points.at(-1)[0]>width);
 for(const points of [s.points,...s.branches.map(b=>b.points)]){
  for(let j=1;j<points.length;j++){
   const [dx,dy]=[points[j][0]-points[j-1][0],points[j][1]-points[j-1][1]];
   assert.ok((dx===0)!==(dy===0));assert.ok(Math.abs(dx)+Math.abs(dy)>=2*s.radius-.001);
  }
  assert.ok(roundedPath(points,s.radius).includes(`A ${s.radius} ${s.radius}`));
 }
 for(const b of s.branches){
  assert.ok(b.junction>0&&b.junction<1);
  assert.ok(s.points.slice(1).some((p,j)=>p[1]===b.points[0][1]&&s.points[j][1]===p[1]&&b.points[0][0]>=s.points[j][0]&&b.points[0][0]<=p[0]));
 }
 assert.ok(s.branches.length<=2);
 assert.equal(generateWire(width,height,{radius:36,branchChance:0,maxBranches:2}).branches.length,0);
}
console.log('800 generated routes: orthogonal segments, fixed-radius corners, connected forks and side exits verified.');

assert.equal(parallelClearance([[[0,107.9],[400,107.9]]],[[[0,0],[400,0]]],36,3,500,500),false);
assert.equal(parallelClearance([[[0,108],[400,108]]],[[[0,0],[400,0]]],36,3,500,500),true);
assert.equal(parallelClearance([[[200,0],[200,400]]],[[[0,0],[400,0]]],36,3,500,500),true);
for(const [width,height,gutter,density] of [[305,360,23,1],[585,714,33,1],[1425,700,33,3],[2193,937,118,3]]) {
 for(let i=0;i<40;i++) {
  const config={radius:36,spacing:3,branchChance:.2,maxBranches:1};
  const occupied=[[[gutter,height],[gutter,height*.5],[-72,height*.5]],[[width-gutter,height],[width-gutter,height*.76],[width+72,height*.76]]];
  let count=0;
  for(let j=0;j<density;j++) {
   const shape=generateSpacedWire(width,height,config,occupied,random);
   if(!shape)break;
   const routes=[shape.points,...shape.branches.map(b=>b.points)];
   assert.ok(parallelClearance(routes,occupied,shape.radius,3,width,height));
   occupied.push(...routes);count++;
  }
  assert.ok(count>0,'At least one optional route fits this layout');
 }
}
console.log('Parallel spacing fixtures and 160 packed backgrounds respect three-radius clearance, including permanent anchors.');

for(const [width,height,demo,gutter] of [
 [305,390,{left:26,right:279,top:60,bottom:312},23],
 [585,840,{left:55,right:530,top:155,bottom:625},33],
]) {
 const config={radius:36,spacing:3};
 const corridor=demoCorridor(width,height,config,demo,gutter,width-gutter);
 const anchors=[[[gutter,height],[gutter,corridor.upper],[-72,corridor.upper]],[[width-gutter,height],[width-gutter,corridor.lower],[width+72,corridor.lower]]];
 for(let i=0;i<100;i++) {
  const shape=generateSpacedWire(width,height,config,anchors,random,corridor);
  assert.ok(shape,'A mobile route fits around the demo');
  assert.ok(shape.points[0][1]<demo.top,'Upper run is above the panel');
  assert.ok(shape.points.at(-1)[1]>demo.bottom,'Lower run is below the panel');
  assert.ok(shape.points[1][0]>demo.left&&shape.points[1][0]<demo.right,'Connecting run is behind the panel');
  assert.ok(parallelClearance([shape.points],anchors,36,3,width,height));
  const second=generateSpacedWire(width,height,config,[...anchors,shape.points],random,corridor);
  assert.ok(second,'The additional mobile route fits without crowding the first route');
  assert.ok(parallelClearance([second.points],[...anchors,shape.points],36,3,width,height));
 }
}
console.log('200 mobile routes use the space above and below the demo while preserving gutter clearance.');

for(const mirror of [false,true]) for(let i=0;i<100;i++) {
 const width=305,height=451,gutter=23;
 const config={radius:36,spacing:3};
 const button={left:78,right:227,top:8,bottom:50};
 const corridor=demoCorridor(width,height,config,{left:26,right:279,top:121,bottom:373},gutter,width-gutter,button,mirror);
 const left=mirror?corridor.lower:corridor.upper,right=mirror?corridor.upper:corridor.lower;
 const occupied=[[[gutter,height],[gutter,left],[-72,left]],[[width-gutter,height],[width-gutter,right],[width+72,right]]];
 for(let n=0;n<3;n++) {
  const shape=generateSpacedWire(width,height,config,occupied,random,corridor,{button,obstacles:[button]});
  assert.ok(shape,'All three mobile routes fit beside the CTA and demo');
  assert.ok(parallelClearance([shape.points],occupied,36,3,width,height));
  occupied.push(shape.points);
 }
 const entry=occupied.slice(2).find(p=>p[0][1]>=button.top&&p[0][1]<=button.bottom);
 assert.ok(entry,'The mobile scene includes an entry alongside the CTA');
 for(const points of occupied.slice(2)) {
  assert.ok(points[0][0]<0&&points.at(-1)[0]>width||points[0][0]>width&&points.at(-1)[0]<0,'Routes continue across the scene instead of returning in a loop');
  assert.ok(avoidsObstacles(points,36,[{left:66,right:239,top:-4,bottom:62}]),'The whole rounded route stays clear of the CTA');
 }
}
console.log('Three-track mobile layouts enter beside the CTA and exit across the scene on either side.');

assert.equal(avoidsObstacles([[0,0],[100,0]],36,[{left:40,right:60,top:-5,bottom:5}]),false);
assert.equal(avoidsObstacles([[0,0],[100,0],[100,100]],36,[{left:80,right:90,top:10,bottom:20}]),false,'Protect the corner as well as straight runs');
assert.equal(avoidsObstacles([[0,0],[100,0],[100,100]],36,[{left:10,right:20,top:50,bottom:60}]),true);
const sides=new Set();
for(const width of [1425,2193])for(let i=0;i<100;i++) {
 const height=1000,button={left:width/2-150,right:width/2+150,top:30,bottom:100};
 const config={radius:36,spacing:3,branchChance:1,maxBranches:2};
 const constraints={button,obstacles:[button,{left:width/2-300,right:width/2+300,top:-100,bottom:0}]};
 const shape=generateSpacedWire(width,height,config,[],random,null,constraints);
 assert.ok(shape,'Desktop also encourages a CTA-side entry');
 assert.ok(shape.points[0][1]>=button.top&&shape.points[0][1]<=button.bottom);
 assert.ok(shape.points[0][0]<0&&shape.points.at(-1)[0]>width||shape.points[0][0]>width&&shape.points.at(-1)[0]<0);
 sides.add(shape.points[0][0]<0?'left':'right');
 assert.ok(avoidsObstacles(shape.points,36,[{left:button.left-12,right:button.right+12,top:18,bottom:112}]));
}
assert.deepEqual([...sides].sort(),['left','right']);
console.log('Desktop entries use both sides; rounded paths protect the CTA and hero text.');

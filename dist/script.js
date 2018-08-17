var T3D,Game;!function(t){t.RAD_SCALE=Math.PI/180;class e{constructor(t,e,s){this.x=0,this.y=0,this.z=0,this.set(t,e,s)}set(t,e,s){return"number"==typeof t&&(this.x=t),"number"==typeof e&&(this.y=e),"number"==typeof s&&(this.z=s),this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}cross(t){let e=this.x,s=this.y,r=this.z,i=t.x,a=t.y,n=t.z;return this.x=s*n-r*a,this.y=r*i-e*n,this.z=e*a-s*i,this}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}scale(t){return this.x*=t,this.y*=t,this.z*=t,this}normalize(){var t=this.length();return t>0&&this.scale(1/t),this}clone(){return new e(this.x,this.y,this.z)}invert(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}toArray(){return[this.x,this.y,this.z]}}t.Vec3=e;class s{constructor(t){this.data=t||[0,0,0,0,0,0,0,0,0]}transpose(){const t=this.data,e=t[1],s=t[2],r=t[5];return t[1]=t[3],t[2]=t[6],t[3]=e,t[5]=t[7],t[6]=s,t[7]=r,this}}t.Mat3=s;class r{constructor(t){this.data=t||[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}clone(){return new r(this.data)}multiply(t){const e=this.data,s=e[0],r=e[1],i=e[2],a=e[3],n=e[4],h=e[5],o=e[6],c=e[7],l=e[8],u=e[9],d=e[10],m=e[11],f=e[12],p=e[13],w=e[14],y=e[15],x=t[0],A=t[1],g=t[2],v=t[3],z=t[4],M=t[5],S=t[6],b=t[7],E=t[8],R=t[9],D=t[10],F=t[11],L=t[12],P=t[13],I=t[14],T=t[15];return this.data=[s*x+r*z+i*E+a*L,s*A+r*M+i*R+a*P,s*g+r*S+i*D+a*I,s*v+r*b+i*F+a*T,n*x+h*z+o*E+c*L,n*A+h*M+o*R+c*P,n*g+h*S+o*D+c*I,n*v+h*b+o*F+c*T,l*x+u*z+d*E+m*L,l*A+u*M+d*R+m*P,l*g+u*S+d*D+m*I,l*v+u*b+d*F+m*T,f*x+p*z+w*E+y*L,f*A+p*M+w*R+y*P,f*g+p*S+w*D+y*I,f*v+p*b+w*F+y*T],this}scale(t){return this.multiply([t.x,0,0,0,0,t.y,0,0,0,0,t.z,0,0,0,0,1])}translate(t){return this.multiply([1,0,0,0,0,1,0,0,0,0,1,0,t.x,t.y,t.z,1])}rotateX(t){const e=Math.cos(t),s=Math.sin(t);return this.multiply([1,0,0,0,0,e,s,0,0,-s,e,0,0,0,0,1])}rotateY(t){const e=Math.cos(t),s=Math.sin(t);return this.multiply([e,0,-s,0,0,1,0,0,s,0,e,0,0,0,0,1])}rotateZ(t){const e=Math.cos(t),s=Math.sin(t);return this.multiply([e,s,0,0,-s,e,0,0,0,0,1,0,0,0,0,1])}rotate(t){return this.rotateX(t.x).rotateY(t.y).rotateZ(t.z)}perspective(t,e,s,r){const i=Math.tan(.5*Math.PI-.5*t),a=1/(s-r);return this.multiply([i/e,0,0,0,0,i,0,0,0,0,(s+r)*a,-1,0,0,s*r*a*2,0])}invert(){const t=this.data,e=t[0],r=t[1],i=t[2],a=t[4],n=t[5],h=t[6],o=t[8],c=t[9],l=t[10],u=l*n-h*c,d=-l*a+h*o,m=c*a-n*o,f=e*u+r*d+i*m;if(!f)return null;const p=1/f;return new s([u*p,(-l*r+i*c)*p,(h*r-i*n)*p,d*p,(l*e-i*o)*p,(-h*e+i*a)*p,m*p,(-c*e+r*o)*p,(n*e-r*a)*p])}}t.Mat4=r;class i{constructor(t=[]){this.translate=new e(t[0]||0,t[1]||0,t[2]||0),this.rotate=new e(t[3]||0,t[4]||0,t[5]||0),this.scale=new e(t[6]||1,t[7]||1,t[8]||1)}matrix(e){return(e=e||new r).scale(this.scale).rotate(this.rotate.clone().scale(t.RAD_SCALE)).translate(this.translate),this.parent?this.parent.matrix(e):e}}t.Transform=i;t.Camera=class{constructor(t=1,s=45,r=.1,i=100){this.rotate=new e,this.position=new e,this.fov=s,this.aspect=t,this.near=r,this.far=i}transform(t){return t.matrix().rotate(this.rotate.clone().invert()).translate(this.position.clone().invert())}perspective(){return(new r).perspective(this.fov,this.aspect,this.near,this.far)}};class a extends e{constructor(){super(...arguments),this.faces=[]}addFace(t){return this.faces.push(t),this}}class n{constructor(t,e,s){this.verts=[],this.normals=[],t.addFace(this),e.addFace(this),s.addFace(this),this.verts.push(t,e,s),this.normal=e.clone().sub(t).cross(s.clone().sub(t)).normalize()}calcNormals(t){return this.verts.forEach((e,s)=>{let r;e.faces.forEach(e=>{this.normal.dot(e.normal)>t&&(r=r?r.add(e.normal):e.normal.clone())}),this.normals.push(r?r.normalize():this.normal)}),this}pushVerts(t){return this.verts.forEach(e=>{t.push(...e.toArray())}),this}pushNormals(t){return this.normals.forEach(e=>{t.push(...e.toArray())}),this}}t.Mesh=class{constructor(e,s=[],r=0,i=360){if(this.verts=[],this.normals=[],e<2)return;s.length<2&&(s=this.sphere(s.length>0?s[0]+2:Math.ceil(e/2)+1));const a=this.createVerts(e,s,0,i),n=this.createFaces(a,e,s.length/2),h=Math.cos(r*t.RAD_SCALE);n.forEach(t=>{t.calcNormals(h).pushVerts(this.verts).pushNormals(this.normals)})}sphere(t){const e=[];if(t<3)return;let s=Math.PI/(t-1);for(let r=1;r<t-1;r++){let t=s*r;e.push(Math.sin(t)/2),e.push(Math.cos(t)/2)}return e}createVerts(e,s,r,i){r*=t.RAD_SCALE;let n=[],h=((i*=t.RAD_SCALE)-r)/e;n.push(new a(0,.5,0)),n.push(new a(0,-.5,0));for(let t=0;t<e;t++){let e=h*t+r,i=Math.cos(e),o=Math.sin(e);for(let t=0;t<s.length;t+=2){let e=new a(i,0,o);e.scale(s[t]).y=s[t+1],n.push(e)}}return n}createFaces(t,e,s){const r=[];let i;for(let a=1;a<e;++a){i=a*s+2,r.push(new n(t[0],t[i],t[i-s])),r.push(new n(t[1],t[i-1],t[i+s-1]));for(let e=0;e<s-1;e++){let a=i+e;r.push(new n(t[a+1],t[a-s],t[a])),r.push(new n(t[a-s+1],t[a-s],t[a+1]))}}r.push(new n(t[0],t[2],t[i])),r.push(new n(t[1],t[i+s-1],t[s+1]));for(let e=0;e<s-1;e++){let s=i+e;r.push(new n(t[e+3],t[s],t[e+2])),r.push(new n(t[s+1],t[s],t[e+3]))}return r}};t.Item=class{constructor(t,e,s){this.childs=[],this.active=!0,this.mesh=t,this.color=e,this.transform=new i(s)}add(t){return this.childs.push(t),t.transform.parent=this.transform,this}};t.Shader=class{constructor(t,e,s){this.attribs={},this.location={},this.gl=t,this.program=t.createProgram(),this.indices=t.createBuffer();const r=this.program;t.attachShader(r,this.create(t.VERTEX_SHADER,e)),t.attachShader(r,this.create(t.FRAGMENT_SHADER,s)),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS)||(console.log(t.getProgramInfoLog(r)),t.deleteProgram(r))}create(t,e){const s=this.gl,r=s.createShader(t);return s.shaderSource(r,e),s.compileShader(r),s.getShaderParameter(r,s.COMPILE_STATUS)||console.log(s.getShaderInfoLog(r)),r}attrib(t,e,s){const r=this.gl;this.location[t]||(this.location[t]=r.getAttribLocation(this.program,t),this.attribs[t]=r.createBuffer());const i=this.location[t];return r.bindBuffer(r.ARRAY_BUFFER,this.attribs[t]),r.bufferData(r.ARRAY_BUFFER,new Float32Array(e),r.STATIC_DRAW),r.enableVertexAttribArray(i),r.vertexAttribPointer(i,s,r.FLOAT,!1,0,0),this}uniform(t,e){const s=this.gl;this.location[t]||(this.location[t]=s.getUniformLocation(this.program,t));const r=this.location[t];if("number"==typeof e)return s.uniform1f(r,e),this;switch(e.length){case 2:s.uniform2fv(r,e);break;case 3:s.uniform3fv(r,e);break;case 4:s.uniform4fv(r,e);break;case 9:s.uniformMatrix3fv(r,!1,e);break;case 16:s.uniformMatrix4fv(r,!1,e)}return this}}}(T3D||(T3D={})),function(t){t.Hero=class extends T3D.Item{constructor(){super(...arguments),this.x=0,this.acc=-.02,this.fall=!1,this.speed=0}render(t){if(!this.active)return;let e=this.transform.translate,s=e.y/10+.4;s>0&&(t.beginPath(),t.arc(e.x,e.z,s,0,2*Math.PI),t.closePath(),t.fillStyle="red",t.fill())}update(){if(!this.active)return;let t=this.transform.translate;this.speed+=this.acc,t.y+=this.speed,t.x+=(this.x-t.x)/5,t.y<0&&!this.fall&&(this.speed=0,t.y=0),this.active=t.y>-10}}}(Game||(Game={})),function(t){t.Platform=class extends T3D.Item{render(t){if(!this.active)return;let e=this.transform.translate,s=this.transform.scale;t.fillStyle="blue",t.fillRect(e.x-.45*s.x,e.z-.45*s.z,.9*s.x,.9*s.z)}update(t){let e=this.transform.translate;e.z+=t;let s=e.z>2;s&&(e.z-=11);let r=1;return e.z<-8?r=e.z+9:e.z>1&&(r=2-e.z),this.transform.scale.set(r,r,r),s}}}(Game||(Game={})),function(t){t.Scene=class{constructor(){this.hud=document.getElementById("hud"),this.init()}init(){this.hero=new t.Hero,this.map=2,this.row=9,this.speed=.05,this.distance=0,this.platforms=[];for(let e=-9;e<2;e++)for(let s=-1;s<=1;s++){let r=new t.Platform;r.transform.translate.set(s,-1,e),this.platforms.push(r)}t.Rand.seed=42}input(t,e){if(this.hero.fall)return void(t.Space&&this.init());const s=this.hero;(t.ArrowLeft||t.KeyA)&&e&&s.x>=0&&s.x--,(t.ArrowRight||t.KeyD)&&e&&s.x<=0&&s.x++}render(t){let e=this.hero,s=e.transform.translate.y<-.5,r=Math.round(t.canvas.height/11);t.clearRect(0,0,t.canvas.width,t.canvas.height),t.save(),t.translate(Math.round(t.canvas.width/2),Math.round(t.canvas.height/1.2)),t.scale(r,r),s&&e.render(t),this.platforms.forEach((e,s)=>{e.render(t)}),s||e.render(t),t.restore(),this.hud.textContent=`Distance: ${this.distance.toFixed(2)}`}updateMap(){switch(Math.round(this.distance)%8){case 0:this.map=t.Rand.get(7,1);break;case 5:this.map=7}}updateIndex(){return this.row-=this.speed,this.row<=-.5&&(this.row+=11),3*Math.round(this.row)+Math.round(this.hero.transform.translate.x)+1}update(){let t=!1,e=this.hero;e.update(),this.platforms.forEach((e,s)=>{e.update(this.speed)&&(e.active=(this.map>>s%3&1)>0,t=!0)}),t&&this.updateMap();let s=this.updateIndex();e.fall||(e.fall=!this.platforms[s].active),this.distance+=this.speed}}}(Game||(Game={})),function(t){function e(t,e,s){t.addEventListener(e,s,!1)}t.fullscreen=function(){document.webkitFullscreenElement?document.webkitExitFullscreen&&(document.webkitExitFullscreen(),document.exitPointerLock()):(document.documentElement.webkitRequestFullscreen(),r.requestPointerLock())};class s{static get(t=1,e=0){return s.seed=(9301*s.seed+49297)%233280,e+s.seed/233280*(t-e)}}let r,i,a;function n(){r.width=r.clientWidth,r.height=r.clientHeight}var h,o;s.seed=Math.random(),t.Rand=s,e(window,"load",()=>{h="#game",r=(o||document).querySelector(h),i=r.getContext("2d"),a=new t.Scene,n(),function(){let t=0,s=0,r=!1,i={};e(document,"touchstart",e=>{let i=e.touches[0];t=i.clientX,s=i.clientY,r=!0}),e(document,"touchmove",e=>{if(!r)return;let n=e.touches[0];!i.ArrowRight&&n.clientX-t>20&&(i.ArrowRight=!0,a.input(i,!0),r=!1),!i.ArrowLeft&&n.clientX-t<-20&&(i.ArrowLeft=!0,a.input(i,!0),r=!1),!i.ArrowUp&&n.clientY-s>20&&(i.ArrowUp=!0,a.input(i,!0),r=!1),!i.ArrowDown&&n.clientY-s<-20&&(i.ArrowDown=!0,a.input(i,!0),r=!1)}),e(document,"touchend",t=>{r&&(i.Space=!0,a.input(i,!0)),i.Space=i.ArrowRight=i.ArrowLeft=i.ArrowUp=i.ArrowDown=r=!1,a.input(i,!1)}),e(document,"keydown",t=>{i[t.code]||(i[t.code]=!0,i[0]=i.Enter||i.Space||t.shiftKey||t.ctrlKey,a.input(i,!0))}),e(document,"keyup",t=>{i[t.code]&&(i[t.code]=!1,i[0]=i[13]||i[32]||t.shiftKey||t.ctrlKey,a.input(i,!1))}),e(window,"resize",n)}(),function t(){requestAnimationFrame(()=>{t()}),a.update(),a.render(i)}()})}(Game||(Game={}));
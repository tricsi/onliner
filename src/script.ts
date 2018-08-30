namespace Game {

    export function $(query: string, element?: NodeSelector): Element {
        return (element || document).querySelector(query);
    }

    export function on(element: any, event: string, callback: EventListenerOrEventListenerObject) {
        element.addEventListener(event, callback, false);
    }

    export function fullscreen() {
        if (!document.webkitFullscreenElement) {
            document.documentElement.webkitRequestFullscreen();
            canvas.requestPointerLock();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            document.exitPointerLock();
        }
    }

    export class Rand {

        static seed: number = Math.random();

        static get(max: number = 1, min: number = 0, round: boolean = true): number {
            if (max <= min) {
                return max;
            }
            Rand.seed = (Rand.seed * 9301 + 49297) % 233280;
            let value = min + (Rand.seed / 233280) * (max - min);
            return round ? Math.round(value) : value;
        }

    }
    
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>$('#game'),
        menu: Menu = new Menu(),
        time: number = new Date().getTime(),
        gl: WebGLRenderingContext = canvas.getContext('webgl'),
        light: T3D.Vec3 = new T3D.Vec3(5, 15, 7),
        camera: T3D.Camera = new T3D.Camera(canvas.width / canvas.height),
        shader: T3D.Shader = new T3D.Shader(gl,
            'precision mediump float;' +
            'attribute vec3 aPos, aNorm;' +
            'uniform mat4 uWorld, uProj;' +
            'uniform mat3 uInverse;' +
            'uniform float uStroke;' +
            'varying vec4 vPos;' +
            'varying vec3 vNorm;' +
            'void main(void) {' +
                'vec3 pos = aPos + (aNorm * uStroke);' +
                'vPos = uWorld * vec4(pos, 1.0);' +
                'vNorm = uInverse * aNorm;' +
                'gl_Position = uProj * vPos;' +
            '}',

            'precision mediump float;' +
            'uniform mat4 uWorld;' +
            'uniform vec4 uColor;' +
            'uniform vec3 uLight;' +
            'uniform float uLevels;' +
            'varying vec4 vPos;' +
            'varying vec3 vNorm;' +
            'vec3 uAmbient = vec3(.2, .2, .2);' +
            'vec3 uDiffuse = vec3(.8, .8, .8);' +
            'vec3 uSpecular = vec3(.8, .8, .8);' +
            'void main(void) {' +
                'vec3 lightDir = normalize(uLight - vPos.xyz);' +
                'vec3 normal = normalize(vNorm);' +
                'vec3 eyeDir = normalize(-vPos.xyz);' +
                'vec3 reflectionDir = reflect(-lightDir, normal);' +
                'float specularWeight = 0.0;' +
                'if (uColor.w > 0.0) { specularWeight = pow(max(dot(reflectionDir, eyeDir), 0.0), uColor.w); }' +
                'float diffuseWeight = max(dot(normal, lightDir), 0.0);' +
                'vec3 weight = uAmbient + uSpecular * specularWeight  + uDiffuse * diffuseWeight;' +
                'vec3 color = uColor.xyz * weight;' +
                'if (uLevels > 1.0) { color = floor(color * uLevels) * (1.0 / uLevels); }' +
                'gl_FragColor = vec4(color, 1);' +
            '}'
        ),
        mesh = {
            hero: new T3D.Mesh(gl, 10),
            block: new T3D.Mesh(gl, 4, [.55, .5, .65, .4, .65, -.4, .55, -.5]),
            fence: new T3D.Mesh(gl, 12, [.4, .5, .5, .4, .5, -.4, .4, -.5], 30),
            token: new T3D.Mesh(gl, 9, [.45, .3, .45, .5, .5, .5, .5, -.5, .45, -.5, .45, -.3], 30),
            enemy: new T3D.Mesh(gl, 4),
        },
        color = {
            white: [.9, .9, .9, 10],
            purple: [1, .3, 1, 30],
            blue: [.3, .3, 1, 30],
            yellow: [1, 1, .3, 30],
            red: [1, .3, .3, 0]
        },
        hero: Hero = new Hero(mesh.hero, color.white),
        scene: Scene = new Scene(hero, () => {
            let platform = new Platform(),
                    block = new T3D.Item(mesh.block, color.blue, [,,,,45]),
                    enemy = new Enemy(mesh.enemy, color.purple, [,1,,,,,.7,.7,.7]),
                    token = new Token(mesh.token, color.yellow, [,1,,90,,,.5,.1,.5]),
                    fence = new T3D.Item(mesh.fence, color.red, [,1.4,,,,,.8,1,.8]);
                block.collider = new T3D.Box(block.transform);
                enemy.collider = new T3D.Sphere(enemy.transform);
                token.collider = new T3D.Sphere(token.transform);
                fence.collider = new T3D.Box(fence.transform);
                platform.block = block;
                platform.token = token;
                platform.fence = fence;
                platform.enemy = enemy;
                return platform.add(block).add(token).add(fence).add(enemy);
        }, '4111|211125052111|301521513510|205120052051|311119973111|511111d1|3111|5713|551111dd');

    function resize() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        camera.aspect = canvas.width / canvas.height;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function bind(): void {
        let x: number = 0,
            y: number = 0,
            min: number = 20,
            keys: boolean[] = [],
            drag = false;
        on(document, 'touchstart', (e: TouchEvent) => {
            let touch = e.touches[0];
            x = touch.clientX;
            y = touch.clientY;
            drag = true;
        });
        on(document, 'touchmove', (e: TouchEvent) => {
            if (!drag) {
                return;
            }
            let touch = e.touches[0];
            if (!keys[39] && touch.clientX - x > min) {
                keys[39] = true;
                scene.input(39);
                drag = false;
            } else if (!keys[37] && touch.clientX - x < -min) {
                keys[37] = true;
                scene.input(37);
                drag = false;
            } else if (!keys[40] && touch.clientY - y > min) {
                keys[40] = true;
                scene.input(40);
                drag = false;
            } else if (!keys[38] && touch.clientY - y < -min) {
                keys[38] = true;
                scene.input(38);
                drag = false;
            }
        });
        on(document, 'touchend', (e: TouchEvent) => {
            if (drag) {
                keys[32] = true;
                scene.input(32);
            }
            keys[32] =
            keys[37] =
            keys[38] =
            keys[39] =
            keys[40] =
            drag = false;
        });
        on(document, 'keydown', (e: KeyboardEvent) => {
            if (menu.active) {
                if (e.keyCode == 32) {
                    menu.hide();
                    scene.init();
                } else {
                    menu.input(e.keyCode);
                }
                return;
            }
            scene.input(e.keyCode);
        });
        on($('#play'), 'click', () => {
            menu.hide();
            scene.init();
        });
        on(window, 'resize', resize);
    }

    function render(item: T3D.Item, stroke: number = 0) {
        item.childs.forEach(child => {
            render(child, stroke);
        });
        let scale = item.transform.scale;
        if (!item.active || !item.mesh) {
            return;
        }
        let invert = item.transform.matrix().invert();
        if (!invert) {
            return;
        }
        gl.cullFace(stroke > 0 ? gl.FRONT : gl.BACK);
        gl.useProgram(shader.program);
        shader.attrib("aPos", item.mesh.verts, 3)
            .attrib("aNorm", item.mesh.normals, 3)
            .uniform("uWorld", camera.transform(item.transform).data)
            .uniform("uProj", camera.perspective().data)
            .uniform("uInverse", invert.transpose().data)
            .uniform("uColor", stroke ? [0, 0, 0, 1] : item.color)
            .uniform("uLight", light.clone().sub(camera.position).toArray())
            .uniform("uStroke", stroke + item.stroke)
            .uniform("uLevels", stroke ? 0 : 5);
        gl.drawArrays(gl.TRIANGLES, 0, item.mesh.length);
    }

    function update() {
        requestAnimationFrame(update);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (menu.active) {
            return;
        }
        let now = new Date().getTime();
        if (now - time > 30) {
            scene.update();
        }
        time = now;
        scene.update();
        render(scene);
        render(scene, .02);
        if (scene.ended()) {
            menu.score(scene.score());
            menu.show();
        }
    }

    on(window, 'load', () => {
        camera.position.set(0, .5, 5);
        camera.rotate.x = -.8;
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        resize();
        bind();
        update();
    });
}
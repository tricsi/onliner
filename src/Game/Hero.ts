/// <reference path="../t3d.ts"/>

namespace Game {

    export class Hero extends T3D.Item {

        x: number;
        rad: number;
        acc: number;
        speed: T3D.Vec3;
        speedTime: number;
        scale: number;
        scaleTime: number;
        magnet: T3D.Vec3;
        magnetTime: number;
        tokens: number;
        distance: number;
        tokenCollider: T3D.Sphere;
        collide: T3D.Vec3;
        explode: number;

        init() {
            const transform = this.transform; 
            transform.translate.set(0, 3, 2);
            transform.rotate.set(0, 0, 0);
            this.color = COLOR.WHITE;
            this.active = true;
            this.transform = transform;
            this.collider = new T3D.Sphere(transform);
            this.tokenCollider = new T3D.Sphere(transform);
            this.x = 0;
            this.rad = .4;
            this.acc = -.02;
            this.speed = new T3D.Vec3(0, 0, .1);
            this.speedTime = 0;
            this.scale = .8;
            this.scaleTime = 0;
            this.magnet = new T3D.Vec3(5, 5, 5);
            this.magnetTime = 0;
            this.tokens = 0;
            this.distance = 0;
            this.explode = 0;
            this.stroke = 0;
        }

        left() {
            if (this.x >= 0) {
                this.x--;
                SFX.play('move');
            }
        }

        right() {
            if (this.x <= 0) {
                this.x++;
                SFX.play('move');
            }
        }

        jump() {
            if (this.collide) {
                this.acc = .03;
                SFX.play('jump');
            }
        }

        boost() {
            this.speedTime = 75;
            SFX.play('move');
        }

        magnetize() {
            this.tokens += 5;
            this.magnetTime = 450;
            SFX.play('power');
        }

        dash() {
            this.scaleTime = 40;
            SFX.play('move');
        }

        coin() {
            this.tokens += 1;
            SFX.play('coin');
        }

        cancel() {
            if (this.collide) {
                this.x = Math.round(this.transform.translate.x);
            }
        }

        update() {
            let pos = this.transform.translate,
                scale = this.scale,
                rotate = this.transform.rotate,
                speed = (this.speedTime ? .12 : .08) + Math.min(this.distance / 50000, .04);
            this.speed.z += ((this.active ? speed : 0) - this.speed.z) / 20;
            this.speedTime -= this.speedTime > 0 ? 1 : 0;
            this.color = this.speedTime ? COLOR.GREY : COLOR.WHITE;
            this.color = this.magnetTime > 100 || this.magnetTime % 20 > 10
                ? (this.speedTime ? COLOR.PINK : COLOR.PURPLE)
                : (this.speedTime ? COLOR.WHITE : COLOR.GREY);
            this.scale += ((this.scaleTime ? .4 : .7) - this.scale) / 5;
            this.scaleTime -= this.scaleTime > 0 ? 1 : 0;
            this.magnetTime -= this.magnetTime > 0 ? 1 : 0;
            this.tokenCollider.scale = this.magnetTime ? this.magnet : this.transform.scale;
            this.stroke += (this.explode - this.stroke) / 25;
            this.active = pos.y > -10 && this.stroke < 6;
            if (!this.active || this.stroke) {
                return;
            }
            this.acc -= this.acc > -.02 ? .003 : 0;
            rotate.z = 90 + (pos.x - this.x) * 25;
            rotate.y = (rotate.y + this.speed.z * 100) % 360;
            this.speed.y += this.acc;
            pos.x += (this.x - pos.x) / 7;
            pos.y += this.speed.y;
            pos.z -= pos.z / 30;
            this.transform.scale.set(scale, scale, scale);
        }

    }
    
}
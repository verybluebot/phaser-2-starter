import { Game } from '../Stores';
import { masterScale } from '../utils';

const PARTICLES_SCALE = 1.4;

class Emitter {
    static flow (x, y, btnNum, particlesNum) {
        const emitter = Game.getGame().add.emitter(x, y, particlesNum);
        emitter.makeParticles('start-screen-top', 'crystal_blue.png', particlesNum);
        emitter.gravity.setTo(-100 - btnNum * 20, -200);
        emitter.minParticleSpeed.setToPolar(-120, 1500, true);

        emitter.minParticleScale = masterScale(PARTICLES_SCALE);
        emitter.maxParticleScale = masterScale(PARTICLES_SCALE);

        emitter.start(false, 3000, 20, particlesNum);

        return emitter;
    }

    static fountain (x, y, btnNum, particlesNum) {
        const emitter = Game.getGame().add.emitter(x, y, particlesNum);
        emitter.makeParticles('start-screen-top', 'crystal_blue.png', particlesNum);
        emitter.gravity.setTo(0, 2000);

        emitter.minParticleSpeed.setTo(-200, -2000);
        emitter.maxParticleSpeed.setTo(200, -1800);

        emitter.minParticleScale = masterScale(PARTICLES_SCALE);
        emitter.maxParticleScale = masterScale(PARTICLES_SCALE);

        emitter.start(false, 6000, 30, particlesNum);

        return emitter;
    }

    static explode (x, y, btnNum, particlesNum) {
        const emitter = Game.getGame().add.emitter(x, y, particlesNum);
        emitter.makeParticles('start-screen-top', 'crystal_blue.png', particlesNum);
        emitter.gravity.setTo(0, 400);

        emitter.minParticleSpeed.setTo(-300, -900);
        emitter.maxParticleSpeed.setTo(300, -500);

        emitter.minParticleScale = masterScale(PARTICLES_SCALE);
        emitter.maxParticleScale = masterScale(PARTICLES_SCALE);

        emitter.start(true, 6000, -1, particlesNum);

        return emitter;
    }

    static dualFlow (particlesNum, isBurst = false) {
        const emitterLeft = Game.getGame().add.emitter(-10, 100, particlesNum / 2);
        emitterLeft.makeParticles('start-screen-top', 'crystal_blue.png', particlesNum / 2);
        emitterLeft.gravity.setTo(0, 400);

        emitterLeft.minParticleSpeed.setTo(300, 0);
        emitterLeft.maxParticleSpeed.setTo(800, 500);

        emitterLeft.minParticleScale = masterScale(PARTICLES_SCALE);
        emitterLeft.maxParticleScale = masterScale(PARTICLES_SCALE);

        const emitterRight = Game.getGame().add.emitter(Game.getGame().world.width + 10, 100, particlesNum / 2);
        emitterRight.makeParticles('start-screen-top', 'crystal_blue.png', particlesNum / 2);
        emitterRight.gravity.setTo(0, 400);

        emitterRight.minParticleSpeed.setTo(-300, 0);
        emitterRight.maxParticleSpeed.setTo(-800, 500);

        emitterRight.minParticleScale = masterScale(PARTICLES_SCALE);
        emitterRight.maxParticleScale = masterScale(PARTICLES_SCALE);

        const ttl = particlesNum > 600 ? 3000 : 4000;

        emitterLeft.start(isBurst, ttl, -1, particlesNum / 2);
        emitterRight.start(isBurst, ttl, -1, particlesNum / 2);
    }

    static topDual (particlesNum, topX) {
        const emitterTopLeft = Game.getGame().add.emitter(topX - 150, -10, particlesNum / 2);
        emitterTopLeft.makeParticles('start-screen-top', 'crystal_blue.png', particlesNum / 2);
        emitterTopLeft.gravity.setTo(0, 400);

        emitterTopLeft.minParticleSpeed.setTo(-150, 0);
        emitterTopLeft.maxParticleSpeed.setTo(150, 500);

        emitterTopLeft.minParticleScale = masterScale(PARTICLES_SCALE);
        emitterTopLeft.maxParticleScale = masterScale(PARTICLES_SCALE);

        const emitterTopRight = Game.getGame().add.emitter(topX + 150, -10, particlesNum / 2);
        emitterTopRight.makeParticles('start-screen-top', 'crystal_blue.png', particlesNum / 2);
        emitterTopRight.gravity.setTo(0, 400);

        emitterTopRight.minParticleSpeed.setTo(-150, 0);
        emitterTopRight.maxParticleSpeed.setTo(150, 500);

        emitterTopRight.minParticleScale = masterScale(PARTICLES_SCALE);
        emitterTopRight.maxParticleScale = masterScale(PARTICLES_SCALE);

        const ttl = particlesNum > 600 ? 3000 : 4000;

        emitterTopLeft.start(false, ttl, -1, particlesNum / 2);
        emitterTopRight.start(false, ttl, -1, particlesNum / 2);
    }

    static topFountain (x, y, particlesNum, frame, key) {
        const emitter = Game.getGame().add.emitter(x, y, particlesNum);
        emitter.makeParticles(frame || 'start-screen-top', key || 'crystal_blue.png', particlesNum);
        emitter.gravity.setTo(0, 4000);

        emitter.minParticleSpeed.setTo(-200, -800);
        emitter.maxParticleSpeed.setTo(200, -700);

        emitter.minParticleScale = masterScale(PARTICLES_SCALE);
        emitter.maxParticleScale = masterScale(PARTICLES_SCALE);

        emitter.start(false, 6000, 100, particlesNum);

        return emitter;
    }

}

export default Emitter;

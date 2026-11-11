import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// ============ ИНИЦИАЛИЗАЦИЯ ============
const canvas = document.getElementById('game-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030303);
scene.fog = new THREE.FogExp2(0x030303, 0.045);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 1.7, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ============ ОСВЕЩЕНИЕ ============
const ambient = new THREE.AmbientLight(0x0a0a0a);
scene.add(ambient);

const flashlight = new THREE.SpotLight(
    0xffeecc, 0, 25, Math.PI / 4, 0.7, 1.0
);
flashlight.castShadow = true;
flashlight.shadow.mapSize.set(1024, 1024);
scene.add(flashlight);
scene.add(flashlight.target);

function addEmergencyLight(x, z) {
    const l = new THREE.PointLight(0x441111, 0.6, 8);
    l.position.set(x, 2.8, z);
    scene.add(l);
}

// ============ МИР ============
const WORLD = 60;
const WALL_H = 3.5;

const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.95 });
const floorMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 1 });
const ceilMat = new THREE.MeshStandardMaterial({ color: 0x0f0f0f, roughness: 1 });
const doorMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 });
const fuseMat = new THREE.MeshStandardMaterial({ color: 0xddaa22, emissive: 0x554400, emissiveIntensity: 0.6 });
const lockerMat = new THREE.MeshStandardMaterial({ color: 0x2a3540, roughness: 0.7, metalness: 0.3 });
const dresserMat = new THREE.MeshStandardMaterial({ color: 0x3a2a18, roughness: 0.85 });
const tableMat = new THREE.MeshStandardMaterial({ color: 0x3d2f1c, roughness: 0.9 });
const batteryMat = new THREE.MeshStandardMaterial({ color: 0x2a6a2a, emissive: 0x113311, emissiveIntensity: 0.5 });
const noteMat = new THREE.MeshStandardMaterial({ color: 0xd8cba8, emissive: 0x221a0a, emissiveIntensity: 0.15 });

const colliders = [];
function addBox(x, y, z, w, h, d, mat) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
}

function addWall(x, z, w, d) {
    addBox(x, WALL_H / 2, z, w, WALL_H, d, wallMat);
    colliders.push({ minX: x - w/2, maxX: x + w/2, minZ: z - d/2, maxZ: z + d/2 });
}

function addFurnitureCollider(x, z, w, d) {
    colliders.push({ minX: x - w/2, maxX: x + w/2, minZ: z - d/2, maxZ: z + d/2 });
}

addBox(0, -0.05, 0, WORLD, 0.1, WORLD, floorMat);
addBox(0, WALL_H, 0, WORLD, 0.1, WORLD, ceilMat);

addWall(0, -WORLD/2, WORLD, 0.5);
addWall(0, WORLD/2, WORLD, 0.5);
addWall(-WORLD/2, 0, 0.5, WORLD);
addWall(WORLD/2, 0, 0.5, WORLD);

addWall(-15, -15, 0.5, 20);
addWall(-15, 5, 25, 0.5);
addWall(0, -20, 20, 0.5);
addWall(10, -5, 0.5, 20);
addWall(10, 12, 20, 0.5);
addWall(-5, 15, 0.5, 20);
addWall(20, 5, 0.5, 15);
addWall(-20, -5, 20, 0.5);

addEmergencyLight(-10, -10);
addEmergencyLight(15, -15);
addEmergencyLight(-20, 10);
addEmergencyLight(20, 20);
addEmergencyLight(0, 0);

// ============ МЕБЕЛЬ: ШКАФЫ, КОМОДЫ, СТОЛЫ ============
function addLocker(x, z, rotY = 0) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.7), lockerMat);
    body.position.y = 1.1;
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);
    const doorPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 2.0, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x1f2a33, roughness: 0.6, metalness: 0.4 })
    );
    doorPanel.position.set(0, 1.1, 0.37);
    g.add(doorPanel);
    const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.3, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })
    );
    handle.position.set(0.4, 1.1, 0.4);
    g.add(handle);
    g.position.set(x, 0, z);
    g.rotation.y = rotY;
    scene.add(g);

    const backOffX = -Math.sin(rotY) * 0.35;
    const backOffZ = -Math.cos(rotY) * 0.35;
    addFurnitureCollider(x + backOffX, z + backOffZ, 1.2, 0.2);

    const enterX = x + Math.sin(rotY) * 0.9;
    const enterZ = z + Math.cos(rotY) * 0.9;

    return {
        mesh: g,
        enterPos: new THREE.Vector3(enterX, 0, enterZ),
        insidePos: new THREE.Vector3(x, 0, z),
        rotY
    };
}

const lockers = [];
lockers.push(addLocker(-8, -12, 0));
lockers.push(addLocker(8, -12, 0));
lockers.push(addLocker(-8, 18, Math.PI));
lockers.push(addLocker(18, 15, Math.PI));
lockers.push(addLocker(-22, -2, Math.PI / 2));
lockers.push(addLocker(22, -18, -Math.PI / 2));

function addDresser(x, z, rotY = 0) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 0.6), dresserMat);
    body.position.y = 0.5;
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);
    for (let i = 0; i < 3; i++) {
        const drawer = new THREE.Mesh(
            new THREE.BoxGeometry(1.25, 0.26, 0.05),
            new THREE.MeshStandardMaterial({ color: 0x4a3820, roughness: 0.85 })
        );
        drawer.position.set(0, 0.2 + i * 0.32, 0.31);
        g.add(drawer);
        const knob = new THREE.Mesh(
            new THREE.SphereGeometry(0.04),
            new THREE.MeshStandardMaterial({ color: 0xaa8833, metalness: 0.7, roughness: 0.3 })
        );
        knob.position.set(0, 0.2 + i * 0.32, 0.35);
        g.add(knob);
    }
    g.position.set(x, 0, z);
    g.rotation.y = rotY;
    scene.add(g);

    const offX = -Math.sin(rotY) * 0.3;
    const offZ = -Math.cos(rotY) * 0.3;
    addFurnitureCollider(x + offX, z + offZ, 1.4, 0.6);

    return { mesh: g, pos: new THREE.Vector3(x, 0.8, z), looted: false };
}

function addTable(x, z, rotY = 0) {
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.9), tableMat);
    top.position.y = 0.9;
    top.castShadow = true;
    top.receiveShadow = true;
    g.add(top);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x2a1f10, roughness: 0.9 });
    for (const [lx, lz] of [[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, 0.08), legMat);
        leg.position.set(lx, 0.45, lz);
        leg.castShadow = true;
        g.add(leg);
    }
    g.position.set(x, 0, z);
    g.rotation.y = rotY;
    scene.add(g);

    const offX = -Math.sin(rotY) * 0.45;
    const offZ = -Math.cos(rotY) * 0.45;
    addFurnitureCollider(x + offX, z + offZ, 1.6, 0.9);

    return { mesh: g, pos: new THREE.Vector3(x, 1.0, z), looted: false };
}

const dressers = [
    addDresser(-12, -8, 0),
    addDresser(5, -17, 0),
    addDresser(-18, 8, Math.PI / 2),
    addDresser(15, 8, -Math.PI / 2),
    addDresser(-3, 12, Math.PI),
    addDresser(18, -8, -Math.PI / 2),
    addDresser(-8, 22, 0),
    addDresser(8, 20, Math.PI),
];

const tables = [
    addTable(-10, 0, 0),
    addTable(5, -8, Math.PI / 2),
    addTable(0, 18, 0),
    addTable(-18, -18, 0),
    addTable(22, 8, Math.PI / 2),
    addTable(-10, 18, Math.PI),
];

// ============ ЛУТ (ПРЕДОХРАНИТЕЛИ / БАТАРЕЙКИ / ЗАПИСКИ) ============
const TOTAL_FUSES = 8;
const fuseItems = [];
const batteryItems = [];
const noteItems = [];

const containers = [...dressers, ...tables];

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
const shuffledContainers = shuffle([...containers]);

const NOTE_TEXTS = [
    {
        title: "ЗАПИСКА #1 — Пациент 47",
        text: "Они говорят, что я болен. Но я вижу то, чего не видят они. В коридорах ночью ходит Тот-Кто-Не-Спит. У него нет лица. Только глаза. Он смотрит."
    },
    {
        title: "ЗАПИСКА #2 — Обход медсестры",
        text: "14 ноября. Свет снова мигнул. Генератор барахлит — нужны предохранители. Их раскидали по всей клинике. Если найдёте — вставьте в главный щиток у выхода. И молитесь, чтобы Тот не нашёл вас первым."
    },
    {
        title: "ЗАПИСКА #3 — Из журнала охраны",
        text: "Он не бегает быстро. Но он никогда не останавливается. Если он потерял вас из виду — он идёт туда, где видел в последний раз. И ждёт. Прячьтесь в шкафах. Он не умеет их открывать."
    },
    {
        title: "ЗАПИСКА #4 — Кто-то нацарапал на стене",
        text: "8. Восемь. Восемь щелчков — и двери откроются. Не считайте вслух. Он слышит счёт."
    }
];

for (const container of shuffledContainers) {
    if (fuseItems.length < TOTAL_FUSES) {
        const fuseMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.25, 10), fuseMat
        );
        fuseMesh.position.copy(container.pos);
        fuseMesh.position.y = container.pos.y + 0.15;
        fuseMesh.castShadow = true;
        scene.add(fuseMesh);
        const glow = new THREE.PointLight(0xffcc33, 0.5, 1.8);
        glow.position.copy(fuseMesh.position);
        scene.add(glow);
        fuseItems.push({
            mesh: fuseMesh, glow, collected: false,
            pos: fuseMesh.position.clone(), host: container
        });
        continue;
    }
    if (noteItems.length < NOTE_TEXTS.length) {
        const noteMesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.22), noteMat);
        noteMesh.position.copy(container.pos);
        noteMesh.position.y = container.pos.y + 0.14;
        scene.add(noteMesh);
        noteItems.push({
            mesh: noteMesh, collected: false,
            pos: noteMesh.position.clone(),
            data: NOTE_TEXTS[noteItems.length],
            host: container
        });
        continue;
    }
    if (batteryItems.length < 4) {
        const batMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8), batteryMat);
        batMesh.position.copy(container.pos);
        batMesh.position.y = container.pos.y + 0.14;
        scene.add(batMesh);
        const glow = new THREE.PointLight(0x33ff33, 0.3, 1.2);
        glow.position.copy(batMesh.position);
        scene.add(glow);
        batteryItems.push({
            mesh: batMesh, glow, collected: false,
            pos: batMesh.position.clone(), host: container
        });
    }
}

// ============ ВЫХОД ============
const exitPos = new THREE.Vector3(25, 0, 25);
const exitMesh = addBox(exitPos.x, 1.5, exitPos.z, 3, 3, 0.3, doorMat);
const exitLight = new THREE.PointLight(0x33ff66, 0.8, 6);
exitLight.position.set(exitPos.x, 2.5, exitPos.z);
scene.add(exitLight);
let exitActive = false;

// ============ ВРАГ ============
const enemy = new THREE.Group();
const enemyBody = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.4, 1.2, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
);
enemyBody.position.y = 1.0;
enemyBody.castShadow = true;
enemy.add(enemyBody);

const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });
const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.06), eyeMat);
eyeL.position.set(-0.15, 1.5, -0.35);
const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.06), eyeMat);
eyeR.position.set(0.15, 1.5, -0.35);
enemy.add(eyeL, eyeR);

const enemyAura = new THREE.PointLight(0xff2200, 0.5, 4);
enemy.add(enemyAura);

enemy.position.set(15, 0, 15);
scene.add(enemy);

const patrolPoints = [
    new THREE.Vector3(15, 0, 15),
    new THREE.Vector3(15, 0, -15),
    new THREE.Vector3(-15, 0, -15),
    new THREE.Vector3(-15, 0, 10),
    new THREE.Vector3(0, 0, 10),
    new THREE.Vector3(0, 0, -10),
    new THREE.Vector3(18, 0, 22),
    new THREE.Vector3(-22, 0, 22),
    new THREE.Vector3(-22, 0, -22)
];
let patrolIndex = 0;

const STATE = { PATROL: 'patrol', INVESTIGATE: 'investigate', CHASE: 'chase' };
let enemyState = STATE.PATROL;
let investigateTarget = null;
let lastKnownPlayerPos = new THREE.Vector3();

let chaseMemory = 0;
const CHASE_MEMORY_TIME = 6;
let investigateWaitUntil = 0;
const INVESTIGATE_WAIT = 2;

// Детектор застревания
let stuckTimer = 0;
let lastEnemyPos = new THREE.Vector3().copy(enemy.position);

// ============ ИГРОК ============
const controls = new PointerLockControls(camera, renderer.domElement);
const player = {
    speed: 4.5,
    runSpeed: 7.5,
    crouchSpeed: 2,
    stamina: 100,
    maxStamina: 100,
    isCrouching: false,
    isRunning: false,
    battery: 100,
    flashlightOn: false,
    fusesCollected: 0,
    radius: 0.4,
    hidden: false,
    activeLocker: null,
    readingNote: false
};

const keys = {};
document.addEventListener('keydown', e => {
    if (player.readingNote) {
        if (e.code === 'KeyE') closeNote();
        return;
    }
    keys[e.code] = true;
    if (e.code === 'KeyF') toggleFlashlight();
    if (e.code === 'KeyE') tryInteract();
    if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
        if (!player.hidden) player.isCrouching = true;
    }
});
document.addEventListener('keyup', e => {
    keys[e.code] = false;
    if (e.code === 'ControlLeft' || e.code === 'ControlRight') player.isCrouching = false;
});

function toggleFlashlight() {
    if (player.battery <= 0) return;
    player.flashlightOn = !player.flashlightOn;
    flashlight.intensity = player.flashlightOn ? 8 : 0;
}

// ============ UI ============
const batteryEl = document.getElementById('battery');
const hintEl = document.getElementById('hint');
const objectiveEl = document.getElementById('objective');
const staminaBar = document.getElementById('stamina-bar');
const hiddenIndicator = document.getElementById('hidden-indicator');
const noteScreen = document.getElementById('note-screen');
const noteTitle = document.getElementById('note-title');
const noteText = document.getElementById('note-text');

function showHint(text, duration = 2000) {
    hintEl.textContent = text;
    hintEl.style.opacity = 1;
    clearTimeout(hintEl._t);
    hintEl._t = setTimeout(() => hintEl.style.opacity = 0, duration);
}

function updateBatteryUI() {
    batteryEl.textContent = `🔋 ${Math.floor(player.battery)}%`;
    batteryEl.classList.toggle('low', player.battery < 25);
}

function updateStaminaUI() {
    const pct = (player.stamina / player.maxStamina) * 100;
    staminaBar.style.width = pct + '%';
    staminaBar.classList.toggle('low', pct < 50 && pct >= 25);
    staminaBar.classList.toggle('crit', pct < 25);
}

function updateObjective() {
    if (player.fusesCollected < TOTAL_FUSES) {
        objectiveEl.textContent = `🎯 Предохранители: ${player.fusesCollected}/${TOTAL_FUSES}`;
    } else if (!exitActive) {
        objectiveEl.textContent = `🎯 Найдите выход`;
    } else {
        objectiveEl.textContent = `🎯 Бегите к зелёной двери!`;
    }
}

function openNote(data) {
    player.readingNote = true;
    noteTitle.textContent = data.title;
    noteText.textContent = data.text;
    noteScreen.style.display = 'flex';
    controls.unlock();
}

function closeNote() {
    player.readingNote = false;
    noteScreen.style.display = 'none';
    controls.lock();
}

// ============ ВЗАИМОДЕЙСТВИЕ ============
function tryInteract() {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    const interactPos = camera.position.clone().add(forward.clone().multiplyScalar(2.2));

    if (player.hidden) {
        exitLocker();
        return;
    }

    for (const f of fuseItems) {
        if (f.collected) continue;
        if (f.pos.distanceTo(interactPos) < 1.6) {
            f.collected = true;
            f.mesh.visible = false;
            f.glow.visible = false;
            player.fusesCollected++;
            showHint(`Предохранитель найден (${player.fusesCollected}/${TOTAL_FUSES})`);
            updateObjective();
            if (player.fusesCollected >= TOTAL_FUSES && !exitActive) {
                exitActive = true;
                showHint('Питание восстановлено! Найдите зелёную дверь', 4000);
            }
            return;
        }
    }

    for (const b of batteryItems) {
        if (b.collected) continue;
        if (b.pos.distanceTo(interactPos) < 1.6) {
            b.collected = true;
            b.mesh.visible = false;
            b.glow.visible = false;
            player.battery = Math.min(100, player.battery + 40);
            updateBatteryUI();
            showHint('Батарейка +40%');
            return;
        }
    }

    for (const n of noteItems) {
        if (n.collected) continue;
        if (n.pos.distanceTo(interactPos) < 1.6) {
            n.collected = true;
            n.mesh.visible = false;
            openNote(n.data);
            return;
        }
    }

    for (const locker of lockers) {
        if (locker.enterPos.distanceTo(camera.position) < 1.6) {
            enterLocker(locker);
            return;
        }
    }

    if (exitActive && exitPos.distanceTo(interactPos) < 3) {
        win();
    }
}

// ============ ШКАФ ============
function enterLocker(locker) {
    player.hidden = true;
    player.activeLocker = locker;
    camera.position.x = locker.insidePos.x;
    camera.position.z = locker.insidePos.z;
    camera.position.y = 1.7;
    const lookX = Math.sin(locker.rotY);
    const lookZ = Math.cos(locker.rotY);
    camera.lookAt(
        camera.position.x + lookX * 5,
        1.7,
        camera.position.z + lookZ * 5
    );
    hiddenIndicator.style.display = 'block';
    showHint('Вы спрятались. Нажмите E, чтобы выйти');
}

function exitLocker() {
    if (!player.activeLocker) return;
    const locker = player.activeLocker;
    camera.position.x = locker.enterPos.x;
    camera.position.z = locker.enterPos.z;
    camera.position.y = 1.7;
    player.hidden = false;
    player.activeLocker = null;
    hiddenIndicator.style.display = 'none';
    showHint('Вы вышли из шкафа');
}

// ============ КОЛЛИЗИИ ============
function resolveCollisions(pos, radius) {
    for (const c of colliders) {
        const closestX = Math.max(c.minX, Math.min(pos.x, c.maxX));
        const closestZ = Math.max(c.minZ, Math.min(pos.z, c.maxZ));
        const dx = pos.x - closestX;
        const dz = pos.z - closestZ;
        const dist = Math.sqrt(dx*dx + dz*dz);
        if (dist < radius) {
            if (dist === 0) {
                const toLeft = pos.x - c.minX, toRight = c.maxX - pos.x;
                const toNear = pos.z - c.minZ, toFar = c.maxZ - pos.z;
                const m = Math.min(toLeft, toRight, toNear, toFar);
                if (m === toLeft) pos.x = c.minX - radius;
                else if (m === toRight) pos.x = c.maxX + radius;
                else if (m === toNear) pos.z = c.minZ - radius;
                else pos.z = c.maxZ + radius;
            } else {
                const push = (radius - dist) / dist;
                pos.x += dx * push;
                pos.z += dz * push;
            }
        }
    }
    const half = WORLD / 2 - 0.6;
    pos.x = Math.max(-half, Math.min(half, pos.x));
    pos.z = Math.max(-half, Math.min(half, pos.z));
}

// ============ ИИ ВРАГА ============
const ENEMY_SPEED = 2.8;
const ENEMY_CHASE_SPEED = 5.2;
const ENEMY_SIGHT = 14;
const ENEMY_FOV = Math.cos(Math.PI / 4);
const ENEMY_HEAR = 10;

function canSeePlayer() {
    if (player.hidden) return false;

    const toPlayer = camera.position.clone().sub(enemy.position);
    const dist = toPlayer.length();
    if (dist > ENEMY_SIGHT) return false;

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(enemy.quaternion);
    toPlayer.y = 0; forward.y = 0;
    toPlayer.normalize(); forward.normalize();
    if (forward.dot(toPlayer) < ENEMY_FOV) return false;

    const ray = new THREE.Raycaster(
        new THREE.Vector3(enemy.position.x, 1, enemy.position.z), toPlayer
    );
    for (const c of colliders) {
        const hit = rayAABB(ray.ray, c);
        if (hit && hit < dist) return false;
    }
    return true;
}

function rayAABB(ray, box) {
    let tmin = -Infinity, tmax = Infinity;
    const o = ray.origin, d = ray.direction;
    for (const axis of ['x', 'z']) {
        const min = axis === 'x' ? box.minX : box.minZ;
        const max = axis === 'x' ? box.maxX : box.maxZ;
        if (Math.abs(d[axis]) < 1e-8) {
            if (o[axis] < min || o[axis] > max) return null;
        } else {
            let t1 = (min - o[axis]) / d[axis];
            let t2 = (max - o[axis]) / d[axis];
            if (t1 > t2) [t1, t2] = [t2, t1];
            tmin = Math.max(tmin, t1);
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return null;
        }
    }
    return tmin > 0 ? tmin : null;
}

function updateEnemy(dt, time) {
    const distToPlayer = enemy.position.distanceTo(camera.position);
    const sees = canSeePlayer();
    const hears = !player.hidden && player.isRunning && distToPlayer < ENEMY_HEAR;

    // ---- Принятие решения ----
    if (sees) {
        enemyState = STATE.CHASE;
        lastKnownPlayerPos.copy(camera.position);
        chaseMemory = CHASE_MEMORY_TIME;
    } else if (hears && enemyState !== STATE.CHASE) {
        enemyState = STATE.INVESTIGATE;
        investigateTarget = camera.position.clone();
        investigateWaitUntil = 0;
    }

    let target = null;
    let speed = ENEMY_SPEED;

    if (enemyState === STATE.CHASE) {
        if (sees) {
            target = camera.position.clone();
            lastKnownPlayerPos.copy(camera.position);
            chaseMemory = CHASE_MEMORY_TIME;
        } else {
            chaseMemory -= dt;
            target = lastKnownPlayerPos.clone();
            if (chaseMemory <= 0) {
                enemyState = STATE.INVESTIGATE;
                investigateTarget = lastKnownPlayerPos.clone();
                investigateWaitUntil = 0;
            }
        }
        speed = ENEMY_CHASE_SPEED;
    } else if (enemyState === STATE.INVESTIGATE) {
        target = investigateTarget ? investigateTarget.clone() : null;
        speed = ENEMY_SPEED * 1.3;
        if (!target || enemy.position.distanceTo(target) < 1) {
            if (investigateWaitUntil === 0) {
                investigateWaitUntil = time + INVESTIGATE_WAIT;
            } else if (time >= investigateWaitUntil) {
                enemyState = STATE.PATROL;
                investigateTarget = null;
                investigateWaitUntil = 0;
            }
            target = null;
        }
    } else {
        target = patrolPoints[patrolIndex].clone();
        if (enemy.position.distanceTo(target) < 1.2) {
            patrolIndex = (patrolIndex + 1) % patrolPoints.length;
            target = patrolPoints[patrolIndex].clone();
        }
    }

    // ---- Движение ----
    if (target) {
        const dir = target.clone().sub(enemy.position);
        dir.y = 0;
        const len = dir.length();

        if (len > 0.15) {
            dir.normalize();

            const stopDist = (enemyState === STATE.CHASE && sees) ? 0.9 : 0.1;
            if (len > stopDist) {
                enemy.position.addScaledVector(dir, speed * dt);
            }

            const targetAngle = Math.atan2(dir.x, dir.z) + Math.PI;
            let diff = targetAngle - enemy.rotation.y;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            enemy.rotation.y += diff * Math.min(1, 10 * dt);
        }
    }

    // ---- Коллизии ----
    for (const c of colliders) {
        const cx = Math.max(c.minX, Math.min(enemy.position.x, c.maxX));
        const cz = Math.max(c.minZ, Math.min(enemy.position.z, c.maxZ));
        const dx = enemy.position.x - cx;
        const dz = enemy.position.z - cz;
        const d = Math.sqrt(dx*dx + dz*dz);
        if (d < 0.5) {
            if (d === 0) {
                enemy.position.x += 0.6;
            } else {
                enemy.position.x += (dx / d) * (0.5 - d);
                enemy.position.z += (dz / d) * (0.5 - d);
            }
        }
    }

    // ---- Детектор застревания ----
    const movedSq = enemy.position.distanceToSquared(lastEnemyPos);
    if (target && movedSq < 0.0004) {
        stuckTimer += dt;
    } else {
        stuckTimer = 0;
    }
    lastEnemyPos.copy(enemy.position);

    if (stuckTimer > 0.7) {
        stuckTimer = 0;
        if (enemyState === STATE.PATROL) {
            patrolIndex = (patrolIndex + 1) % patrolPoints.length;
        } else if (enemyState === STATE.INVESTIGATE) {
            enemyState = STATE.PATROL;
            investigateTarget = null;
            investigateWaitUntil = 0;
        } else if (enemyState === STATE.CHASE) {
            const ang = Math.random() * Math.PI * 2;
            enemy.position.x += Math.cos(ang) * 0.5;
            enemy.position.z += Math.sin(ang) * 0.5;
        }
    }

    enemyAura.intensity = enemyState === STATE.CHASE ? 1.5 : 0.5;

    if (!player.hidden && distToPlayer < 1.2) die();
}

// ============ СМЕРТЬ / ПОБЕДА ============
let gameOver = false;
function die() {
    if (gameOver) return;
    gameOver = true;
    controls.unlock();
    document.getElementById('death-screen').style.display = 'flex';
}

function win() {
    if (gameOver) return;
    gameOver = true;
    controls.unlock();
    document.getElementById('win-screen').style.display = 'flex';
}

// ============ ИГРОВОЙ ЦИКЛ ============
const clock = new THREE.Clock();
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    time += dt;

    if (!gameOver && controls.isLocked && !player.readingNote) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0; forward.normalize();
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0,1,0)).normalize();

        const move = new THREE.Vector3();
        if (keys['KeyW']) move.add(forward);
        if (keys['KeyS']) move.sub(forward);
        if (keys['KeyD']) move.add(right);
        if (keys['KeyA']) move.sub(right);

        if (player.hidden) move.set(0, 0, 0);

        player.isRunning = keys['ShiftLeft'] && player.stamina > 0 && !player.isCrouching && move.length() > 0 && !player.hidden;

        let speed = player.isCrouching ? player.crouchSpeed : (player.isRunning ? player.runSpeed : player.speed);
        if (move.length() > 0) move.normalize();

        if (player.isRunning) {
            player.stamina = Math.max(0, player.stamina - 25 * dt);
        } else {
            player.stamina = Math.min(player.maxStamina, player.stamina + 12 * dt);
        }
        updateStaminaUI();

        const newPos = camera.position.clone().addScaledVector(move, speed * dt);
        newPos.y = 0;
        resolveCollisions(newPos, player.radius);
        camera.position.x = newPos.x;
        camera.position.z = newPos.z;

        const targetY = player.isCrouching ? 1.0 : 1.7;
        camera.position.y += (targetY - camera.position.y) * 10 * dt;

        flashlight.position.copy(camera.position);
        const camDirection = new THREE.Vector3();
        camera.getWorldDirection(camDirection);
        flashlight.target.position.copy(camera.position).addScaledVector(camDirection, 10);
        flashlight.target.updateMatrixWorld();

        if (player.flashlightOn) {
            player.battery = Math.max(0, player.battery - 0.5 * dt);
            if (player.battery <= 0) {
                player.flashlightOn = false;
                flashlight.intensity = 0;
            }
            updateBatteryUI();
        }

        if (player.flashlightOn) {
            flashlight.intensity = 8 + Math.sin(time * 20) * 0.2;
        }

        updateEnemy(dt, time);

        fuseItems.forEach(f => {
            if (!f.collected) f.mesh.rotation.y += dt * 1.5;
        });
        batteryItems.forEach(b => {
            if (!b.collected) b.mesh.rotation.y += dt * 1.2;
        });

        if (exitActive) {
            exitLight.intensity = 0.8 + Math.sin(time * 4) * 0.4;
            exitMesh.material.emissive = new THREE.Color(0x33ff66);
            exitMesh.material.emissiveIntensity = 0.3 + Math.sin(time * 4) * 0.2;
        }
    }

    renderer.render(scene, camera);
}

// ============ СТАРТ ============
const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    controls.lock();
});

controls.addEventListener('lock', () => {
    startScreen.style.display = 'none';
});

controls.addEventListener('unlock', () => {
    if (!gameOver && !player.readingNote) startScreen.style.display = 'flex';
});

renderer.domElement.addEventListener('click', () => {
    if (!gameOver && !controls.isLocked && !player.readingNote) controls.lock();
});

addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

updateBatteryUI();
updateStaminaUI();
updateObjective();
animate();
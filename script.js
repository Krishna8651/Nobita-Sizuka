import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// ---------- ROMANTIC STORY DIALOGUE ----------
const storyDialogue = [
    { speaker: "Nobita", text: "Shizuka... can we talk? There's something I've been wanting to tell you for so long.", progress: 0 },
    { speaker: "Shizuka", text: "Of course, Nobita. You look so serious today. What is it?", progress: 10 },
    { speaker: "Nobita", text: "I know I'm not the smartest, or the strongest, or the most talented guy...", progress: 20 },
    { speaker: "Shizuka", text: "Nobita, that's not true. You have the biggest heart of anyone I know.", progress: 30 },
    { speaker: "Nobita", text: "But when I'm with you, I feel like I can do anything. You make me want to be better.", progress: 40 },
    { speaker: "Shizuka", text: "You already make me smile every day with your kindness and determination.", progress: 50 },
    { speaker: "Nobita", text: "Shizuka, I've loved you since we were kids. Every moment with you is precious to me.", progress: 60 },
    { speaker: "Shizuka", text: "Nobita... (blushes deeply)", progress: 70 },
    { speaker: "Nobita", text: "I promise to always protect you, to make you laugh, to be by your side forever.", progress: 80 },
    { speaker: "Nobita", text: "Shizuka, will you marry me?", progress: 90, isProposal: true },
    { speaker: "Shizuka", text: "Yes! Yes, Nobita! A thousand times yes! I love you too!", progress: 95, isAcceptance: true },
    { speaker: "Both", text: "❤️ Together Forever ❤️", progress: 100, isFinal: true }
];

let currentDialogueIndex = 0;
let autoPlay = true;
let autoPlayTimeout;

// ---------- SCENE SETUP ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue
scene.fog = new THREE.Fog(0x87CEEB, 10, 30);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 2.5, 6);
camera.lookAt(0, 1.2, 0);

// Renderers
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.bias = 0.0001;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 2;
controls.maxDistance = 12;
controls.target.set(0, 1.2, 0);
controls.update();

// ---------- LIGHTS ----------
// Ambient light
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

// Main directional light (sun)
const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
sunLight.position.set(5, 10, 7);
sunLight.castShadow = true;
sunLight.receiveShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
const d = 8;
sunLight.shadow.camera.left = -d;
sunLight.shadow.camera.right = d;
sunLight.shadow.camera.top = d;
sunLight.shadow.camera.bottom = -d;
sunLight.shadow.camera.near = 2;
sunLight.shadow.camera.far = 20;
scene.add(sunLight);

// Fill light
const fillLight = new THREE.PointLight(0x4466ff, 0.4);
fillLight.position.set(-3, 2, 4);
scene.add(fillLight);

// Romantic pink light
const pinkLight = new THREE.PointLight(0xff69b4, 0.6);
pinkLight.position.set(2, 1.5, 3);
scene.add(pinkLight);

// Back light
const backLight = new THREE.PointLight(0xffaa88, 0.3);
backLight.position.set(0, 2, -5);
scene.add(backLight);

// ---------- GROUND AND ENVIRONMENT ----------
// Ground with texture effect
const groundGeometry = new THREE.CircleGeometry(12, 32);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x6b8e23,
    roughness: 0.7,
    emissive: 0x224400,
    emissiveIntensity: 0.1
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Decorative grass patches
for (let i = 0; i < 300; i++) {
    const grassGeo = new THREE.ConeGeometry(0.04, Math.random() * 0.2 + 0.1, 4);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x3d8c40 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 8;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    grass.position.set(x, 0.02, z);
    grass.castShadow = true;
    grass.receiveShadow = true;
    grass.rotation.y = Math.random() * Math.PI;
    scene.add(grass);
}

// Cherry blossom trees
function createCherryTree(x, z) {
    const group = new THREE.Group();
    
    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 1.2);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.6;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);
    
    // Pink blossoms (clusters)
    const blossomMat = new THREE.MeshStandardMaterial({ color: 0xFFB7C5 });
    
    for (let i = 0; i < 5; i++) {
        const blossom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 5), blossomMat);
        blossom.position.set(
            Math.sin(i * 1.2) * 0.3,
            1.0 + Math.cos(i * 1.5) * 0.2,
            Math.cos(i * 1.2) * 0.3
        );
        blossom.castShadow = true;
        blossom.receiveShadow = true;
        group.add(blossom);
    }
    
    group.position.set(x, 0, z);
    return group;
}

// Add cherry trees around
for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const radius = 4.5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    scene.add(createCherryTree(x, z));
}

// Romantic flowers
function createFlower(x, z, color) {
    const group = new THREE.Group();
    
    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.01, 0.02, 0.2);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x32CD32 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.1;
    stem.castShadow = true;
    group.add(stem);
    
    // Flower head
    const headGeo = new THREE.SphereGeometry(0.06, 6);
    const headMat = new THREE.MeshStandardMaterial({ color: color });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.2;
    head.castShadow = true;
    group.add(head);
    
    group.position.set(x, 0, z);
    return group;
}

// Add a path of flowers
const flowerColors = [0xFF69B4, 0xFF1493, 0xFFB6C1, 0xFFA07A];
for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 2.5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const color = flowerColors[i % flowerColors.length];
    scene.add(createFlower(x, z, color));
}

// ---------- CREATE NOBITA ----------
function createNobita() {
    const group = new THREE.Group();
    
    // Body (blue shirt)
    const bodyGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4169E1, emissive: 0x001133, emissiveIntensity: 0.1 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.4;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // Head
    const headGeo = new THREE.SphereGeometry(0.22, 24);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xFFE4B5 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.95;
    head.castShadow = true;
    head.receiveShadow = true;
    group.add(head);
    
    // Hair (black)
    const hairGeo = new THREE.SphereGeometry(0.18, 8);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.1, 0.05);
    hair.scale.set(1.1, 0.4, 0.8);
    hair.castShadow = true;
    group.add(hair);
    
    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.05, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.08, 1.0, 0.15);
    leftEye.castShadow = true;
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.08, 1.0, 0.15);
    rightEye.castShadow = true;
    group.add(rightEye);
    
    // Glasses (white circles)
    const glassGeo = new THREE.TorusGeometry(0.07, 0.02, 8, 16);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    
    const leftGlass = new THREE.Mesh(glassGeo, glassMat);
    leftGlass.position.set(-0.08, 1.0, 0.17);
    leftGlass.rotation.y = 0.1;
    leftGlass.castShadow = true;
    group.add(leftGlass);
    
    const rightGlass = new THREE.Mesh(glassGeo, glassMat);
    rightGlass.position.set(0.08, 1.0, 0.17);
    rightGlass.rotation.y = -0.1;
    rightGlass.castShadow = true;
    group.add(rightGlass);
    
    // Nose
    const noseGeo = new THREE.ConeGeometry(0.03, 0.06, 6);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xFFA07A });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.95, 0.2);
    nose.rotation.x = 0.3;
    nose.castShadow = true;
    group.add(nose);
    
    // Mouth (happy or neutral)
    const mouthGeo = new THREE.TorusGeometry(0.04, 0.01, 4, 8, Math.PI);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xFF69B4 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 0.88, 0.18);
    mouth.rotation.x = 0.1;
    mouth.rotation.z = 0.1;
    mouth.castShadow = true;
    group.add(mouth);
    
    // Arms
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
    
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.3, 0.7, 0);
    leftArm.rotation.z = 0.3;
    leftArm.rotation.x = 0.2;
    leftArm.castShadow = true;
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.3, 0.7, 0);
    rightArm.rotation.z = -0.3;
    rightArm.rotation.x = -0.2;
    rightArm.castShadow = true;
    group.add(rightArm);
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.5);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.12, 0.15, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.12, 0.15, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);
    
    return group;
}

// ---------- CREATE SHIZUKA ----------
function createShizuka() {
    const group = new THREE.Group();
    
    // Body (pink dress)
    const bodyGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xFF69B4, emissive: 0x330011, emissiveIntensity: 0.1 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.4;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // Head
    const headGeo = new THREE.SphereGeometry(0.2, 24);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xFFE4B5 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.95;
    head.castShadow = true;
    head.receiveShadow = true;
    group.add(head);
    
    // Hair (black, longer style)
    const hairGeo = new THREE.SphereGeometry(0.18, 8);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.08, 0.02);
    hair.scale.set(1.1, 0.4, 0.9);
    hair.castShadow = true;
    group.add(hair);
    
    // Hair sides
    const hairSideGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
    const hairSideMat = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    
    const leftHair = new THREE.Mesh(hairSideGeo, hairSideMat);
    leftHair.position.set(-0.15, 1.0, 0);
    leftHair.rotation.z = 0.2;
    leftHair.castShadow = true;
    group.add(leftHair);
    
    const rightHair = new THREE.Mesh(hairSideGeo, hairSideMat);
    rightHair.position.set(0.15, 1.0, 0);
    rightHair.rotation.z = -0.2;
    rightHair.castShadow = true;
    group.add(rightHair);
    
    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.05, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.07, 1.0, 0.15);
    leftEye.castShadow = true;
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.07, 1.0, 0.15);
    rightEye.castShadow = true;
    group.add(rightEye);
    
    // Blush
    const blushGeo = new THREE.SphereGeometry(0.03, 4);
    const blushMat = new THREE.MeshStandardMaterial({ color: 0xFF69B4 });
    
    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.12, 0.95, 0.14);
    leftBlush.castShadow = true;
    group.add(leftBlush);
    
    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.12, 0.95, 0.14);
    rightBlush.castShadow = true;
    group.add(rightBlush);
    
    // Mouth (small smile)
    const mouthGeo = new THREE.TorusGeometry(0.03, 0.008, 4, 6, Math.PI);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xFF1493 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 0.88, 0.16);
    mouth.rotation.x = 0.1;
    mouth.rotation.z = 0;
    mouth.castShadow = true;
    group.add(mouth);
    
    // Arms
    const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xFFB6C1 });
    
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.25, 0.7, 0);
    leftArm.rotation.z = 0.2;
    leftArm.rotation.x = 0.1;
    leftArm.castShadow = true;
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.25, 0.7, 0);
    rightArm.rotation.z = -0.2;
    rightArm.rotation.x = -0.1;
    rightArm.castShadow = true;
    group.add(rightArm);
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.1, 0.175, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.1, 0.175, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);
    
    return group;
}

// Position characters
const nobita = createNobita();
nobita.position.set(-1.2, 0, 0);
nobita.rotation.y = 0.2;
scene.add(nobita);

const shizuka = createShizuka();
shizuka.position.set(1.2, 0, 0);
shizuka.rotation.y = -0.2;
scene.add(shizuka);

// ---------- ROMANTIC ELEMENTS ----------
// Floating hearts
const heartGroup = new THREE.Group();
for (let i = 0; i < 8; i++) {
    const heartGeo = new THREE.SphereGeometry(0.1, 8);
    const heartMat = new THREE.MeshStandardMaterial({ 
        color: 0xFF1493,
        emissive: 0x330011,
        emissiveIntensity: 0.5
    });
    const heart = new THREE.Mesh(heartGeo, heartMat);
    
    const angle = (i / 8) * Math.PI * 2;
    const radius = 0.8;
    heart.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius + 1.5,
        0.5
    );
    heart.castShadow = true;
    heartGroup.add(heart);
}
scene.add(heartGroup);

// Ring (proposal ring)
const ringGroup = new THREE.Group();
const ringGeo = new THREE.TorusGeometry(0.1, 0.02, 8, 16);
const ringMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0x442200 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 2;
ring.castShadow = true;
ringGroup.add(ring);

// Diamond
const diamondGeo = new THREE.ConeGeometry(0.04, 0.08, 4);
const diamondMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xAAAAAA });
const diamond = new THREE.Mesh(diamondGeo, diamondMat);
diamond.position.y = 0.06;
diamond.castShadow = true;
ringGroup.add(diamond);

ringGroup.position.set(0, 1.8, 1);
scene.add(ringGroup);

// ---------- UI ELEMENTS ----------
function createLabel(text, color = 'white', bgColor = 'rgba(0,0,0,0.7)') {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = color;
    div.style.fontFamily = 'Arial, sans-serif';
    div.style.fontSize = '20px';
    div.style.fontWeight = 'bold';
    div.style.textShadow = '2px 2px 4px black';
    div.style.background = bgColor;
    div.style.padding = '10px 20px';
    div.style.borderRadius = '30px';
    div.style.border = '2px solid gold';
    div.style.boxShadow = '0 0 20px rgba(255,215,0,0.5)';
    div.style.whiteSpace = 'nowrap';
    return new CSS2DObject(div);
}

// Add name labels above characters
const nobitaLabel = createLabel('Nobita', '#4169E1', 'rgba(0,0,0,0.6)');
nobitaLabel.position.set(-1.2, 2.2, 0);
scene.add(nobitaLabel);

const shizukaLabel = createLabel('Shizuka', '#FF69B4', 'rgba(0,0,0,0.6)');
shizukaLabel.position.set(1.2, 2.2, 0);
scene.add(shizukaLabel);

// ---------- ANIMATION VARIABLES ----------
let time = 0;
let mixer; // For future animations if needed

// ---------- DIALOGUE UPDATE FUNCTION ----------
function updateDialogue() {
    const dialogue = storyDialogue[currentDialogueIndex];
    const dialogueText = document.getElementById('dialogue-text');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    // Format text with speaker
    let displayText = `${dialogue.speaker}: ${dialogue.text}`;
    if (dialogue.isProposal) {
        displayText = '💍 ' + displayText + ' 💍';
    } else if (dialogue.isAcceptance) {
        displayText = '✨✨ ' + displayText + ' ✨✨';
    } else if (dialogue.isFinal) {
        displayText = '❤️❤️❤️ ' + dialogue.text + ' ❤️❤️❤️';
    }
    
    dialogueText.textContent = displayText;
    progressBar.style.width = dialogue.progress + '%';
    progressText.textContent = `Chapter ${Math.floor(dialogue.progress/10) + 1}: ${dialogue.speaker}'s Moment`;
    
    // Change message box color for special moments
    const messageBox = document.getElementById('message-box');
    if (dialogue.isProposal) {
        messageBox.style.background = 'linear-gradient(135deg, rgba(255,215,0,0.95), rgba(255,105,180,0.95))';
        createFloatingHearts(10);
    } else if (dialogue.isAcceptance) {
        messageBox.style.background = 'linear-gradient(135deg, rgba(255,105,180,0.95), rgba(255,215,0,0.95))';
        createFloatingHearts(20);
        // Make characters hug (rotate towards each other)
        nobita.rotation.y = 0.4;
        shizuka.rotation.y = -0.4;
    } else if (dialogue.isFinal) {
        messageBox.style.background = 'linear-gradient(135deg, rgba(255,0,100,0.95), rgba(255,215,0,0.95))';
        createFloatingHearts(30);
    } else {
        messageBox.style.background = 'linear-gradient(135deg, rgba(255,182,193,0.95), rgba(255,105,180,0.95))';
    }
    
    // Animate characters based on dialogue
    if (dialogue.speaker === 'Nobita') {
        nobita.position.y = 0.1;
        setTimeout(() => { nobita.position.y = 0; }, 200);
    } else if (dialogue.speaker === 'Shizuka') {
        shizuka.position.y = 0.1;
        setTimeout(() => { shizuka.position.y = 0; }, 200);
    }
}

// Floating hearts effect
function createFloatingHearts(count = 5) {
    const container = document.getElementById('floating-hearts');
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-float';
        heart.innerHTML = ['❤️', '💖', '💗', '💓', '💕'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        container.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 4000);
    }
}

// Next dialogue function
function nextDialogue() {
    if (currentDialogueIndex < storyDialogue.length - 1) {
        currentDialogueIndex++;
        updateDialogue();
        
        // Special effects for proposal
        if (storyDialogue[currentDialogueIndex].isProposal) {
            // Make ring sparkle and move
            ringGroup.position.y = 2.0;
            setTimeout(() => {
                ringGroup.position.y = 1.8;
            }, 500);
        }
    } else {
        // Loop back to beginning for continuous play
        currentDialogueIndex = 0;
        updateDialogue();
    }
}

// Auto-play function
function startAutoPlay() {
    if (autoPlay) {
        autoPlayTimeout = setTimeout(() => {
            nextDialogue();
            startAutoPlay();
        }, 5000); // Change dialogue every 5 seconds
    }
}

// Stop auto-play
function stopAutoPlay() {
    clearTimeout(autoPlayTimeout);
}

// Toggle auto-play
function toggleAutoPlay() {
    autoPlay = !autoPlay;
    const statusEl = document.getElementById('auto-play-status');
    if (autoPlay) {
        statusEl.textContent = 'Auto-Play: ON';
        statusEl.style.color = '#90EE90';
        startAutoPlay();
    } else {
        statusEl.textContent = 'Auto-Play: OFF';
        statusEl.style.color = '#FF6B6B';
        stopAutoPlay();
    }
}

// Reset camera view
function resetView() {
    camera.position.set(4, 2.5, 6);
    controls.target.set(0, 1.2, 0);
    controls.update();
}

// ---------- KEYBOARD CONTROLS ----------
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            nextDialogue();
            // Reset auto-play timer if on
            if (autoPlay) {
                stopAutoPlay();
                startAutoPlay();
            }
            break;
        case 'KeyR':
            resetView();
            break;
        case 'KeyA':
            toggleAutoPlay();
            break;
    }
});

// ---------- INITIALIZE ----------
updateDialogue();
startAutoPlay();

// Create initial floating hearts
setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance every 2 seconds
        createFloatingHearts(3);
    }
}, 2000);

// ---------- ANIMATION LOOP ----------
function animate() {
    requestAnimationFrame(animate);
    
    time += 0.01;
    
    // Animate characters (subtle movement)
    nobita.position.y = Math.sin(time * 2) * 0.03;
    shizuka.position.y = Math.cos(time * 2 + 1) * 0.03;
    
    // Animate hearts
    heartGroup.rotation.y += 0.01;
    heartGroup.position.y = 1.5 + Math.sin(time * 2) * 0.1;
    
    // Animate ring
    ringGroup.rotation.y += 0.02;
    ringGroup.rotation.x = Math.PI / 2 + Math.sin(time) * 0.1;
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

animate();

// ---------- WINDOW RESIZE HANDLER ----------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- LOADING SCREEN REMOVAL ----------
window.addEventListener('load', () => {
    // Create and remove loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loader">
            <div class="heart-loader">❤️</div>
            <h2>Loading Romantic Scene...</h2>
            <p>Nobita & Shizuka's Love Story</p>
        </div>
    `;
    document.body.appendChild(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
});

console.log('❤️ Romantic 3D Scene Loaded! Press SPACE to advance dialogue ❤️');

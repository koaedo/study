# 📚 Three.js Transform 완벽 복습 가이드

> **작성일:** 2025년 11월 28일  
> **학습 주제:** Transform (위치, 크기, 회전)  
> **예제 코드 위치:** `threejsStudy/04_transform/dev/src/`

---

## 목차
1. [Transform 개념](#1-transform-개념)
2. [3D 좌표계](#2-3d-좌표계)
3. [Position (위치)](#3-position-위치)
4. [Scale (크기)](#4-scale-크기)
5. [Rotation (회전)](#5-rotation-회전)
6. [dat.GUI 활용](#6-datgui-활용)
7. [실전 예제 및 팁](#7-실전-예제-및-팁)

---

## 1. Transform 개념

### 📌 Transform이란?

**Transform**은 3D 공간에서 객체를 변환하는 세 가지 핵심 속성입니다:

- **Position (위치)**: 객체가 3D 공간에서 어디에 있는지
- **Scale (크기)**: 객체의 크기를 얼마나 조절할지
- **Rotation (회전)**: 객체를 어떻게 회전시킬지

이 세 가지 속성을 조합하여 3D 객체를 원하는 대로 배치하고 움직일 수 있습니다.

### 💡 왜 Transform이 중요한가?

```javascript
// Transform 없이는 모든 객체가 원점(0,0,0)에 겹쳐 있음
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material);
scene.add(mesh1, mesh2); // 두 객체가 완전히 겹침!

// Transform으로 분리
mesh1.position.x = -2; // 왼쪽으로
mesh2.position.x = 2;  // 오른쪽으로
```

---

## 2. 3D 좌표계

### 🎯 오른손 좌표계

Three.js는 **오른손 좌표계(Right-handed coordinate system)**를 사용합니다.

```
       Y (위)
       |
       |
       |
       +-------- X (오른쪽)
      /
     /
    Z (앞)
```

### 📐 축의 방향

- **X축 (빨강)**: 
  - 음수(-): 왼쪽
  - 양수(+): 오른쪽

- **Y축 (초록)**: 
  - 음수(-): 아래
  - 양수(+): 위

- **Z축 (파랑)**: 
  - 음수(-): 뒤 (화면 안쪽)
  - 양수(+): 앞 (화면 밖으로)

### 💡 AxesHelper로 좌표축 시각화

```javascript
// AxesHelper 생성 (길이 3)
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

// 결과:
// - 빨간색 선: X축 (오른쪽 방향)
// - 초록색 선: Y축 (위쪽 방향)
// - 파란색 선: Z축 (앞쪽 방향)
```

**개발 팁:** 
- 처음 Three.js를 배울 때는 **항상 AxesHelper를 추가**하세요
- 객체의 위치와 방향을 이해하는 데 큰 도움이 됩니다
- 완성 후에는 제거하거나 숨길 수 있습니다

### 🎮 GridHelper로 바닥 표시

```javascript
// GridHelper 생성 (크기 10, 10개 분할)
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

// 바닥을 시각화하여 공간감 향상
```

---

## 3. Position (위치)

### 📍 기본 개념

Position은 객체의 3D 공간 상 위치를 나타냅니다. `Vector3` 객체로 저장됩니다.

### 기본 사용법

```javascript
const mesh = new THREE.Mesh(geometry, material);

// 방법 1: 개별 설정
mesh.position.x = 2;
mesh.position.y = 1;
mesh.position.z = -3;

// 방법 2: 한번에 설정 (추천)
mesh.position.set(2, 1, -3);

// 방법 3: Vector3 객체로 설정
mesh.position = new THREE.Vector3(2, 1, -3);
```

### 📏 유용한 Position 메서드

#### 1. `length()` - 원점으로부터의 거리

```javascript
// 원점 (0, 0, 0)으로부터 얼마나 떨어져 있는지
const distance = mesh.position.length();
console.log(distance); // 예: 3.7416573867739413

// 계산 방식: Math.sqrt(x² + y² + z²)
// 예: (2, 1, -3) → Math.sqrt(4 + 1 + 9) = 3.74
```

**활용 예시:**
```javascript
// 캐릭터가 중심에서 10 이상 멀어지면 경고
if (player.position.length() > 10) {
    alert('너무 멀리 갔습니다!');
}

// 거리에 따라 크기 조절 (원근감)
const distance = mesh.position.length();
mesh.scale.setScalar(1 / distance);
```

#### 2. `distanceTo()` - 다른 객체까지의 거리

```javascript
// 카메라까지의 거리
const distanceToCamera = mesh.position.distanceTo(camera.position);
console.log(distanceToCamera);

// 두 객체 사이의 거리
const player = scene.getObjectByName('player');
const enemy = scene.getObjectByName('enemy');
const distance = player.position.distanceTo(enemy.position);

// 충돌 감지 (간단한 방법)
if (distance < 1) {
    console.log('충돌!');
}
```

**활용 예시:**
```javascript
// LOD (Level of Detail): 거리에 따라 상세도 조절
const distanceToCamera = mesh.position.distanceTo(camera.position);
if (distanceToCamera < 5) {
    mesh.geometry = highDetailGeometry; // 가까우면 상세하게
} else {
    mesh.geometry = lowDetailGeometry;  // 멀면 간단하게
}

// 음향 효과: 거리에 따라 소리 크기
const volume = Math.max(0, 1 - distance / 10);
sound.setVolume(volume);
```

#### 3. `copy()` - 위치 복사

```javascript
const mesh2 = new THREE.Mesh(geometry, material);
mesh2.position.copy(mesh1.position); // mesh1의 위치를 복사
```

#### 4. `clone()` - 위치 객체 복제

```javascript
const positionCopy = mesh.position.clone();
// 원본을 변경해도 복사본은 영향 받지 않음
```

### 🎯 상대적 이동

```javascript
// 현재 위치에서 상대적으로 이동
mesh.position.x += 0.1;  // x축으로 0.1 증가
mesh.position.y -= 0.05; // y축으로 0.05 감소

// 벡터 덧셈
mesh.position.add(new THREE.Vector3(1, 0, 0)); // x축으로 1 이동
```

### 💡 Position 실전 팁

#### 1. 애니메이션에서 활용

```javascript
function draw() {
    const delta = clock.getDelta();
    
    // 시간에 따라 움직이기
    mesh.position.x += delta * 2; // 초당 2 unit 이동
    
    // 경계 체크
    if (mesh.position.x > 10) {
        mesh.position.x = -10; // 반대편으로 이동
    }
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
```

#### 2. 키보드로 객체 이동

```javascript
const speed = 0.1;

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            mesh.position.z -= speed;
            break;
        case 'ArrowDown':
            mesh.position.z += speed;
            break;
        case 'ArrowLeft':
            mesh.position.x -= speed;
            break;
        case 'ArrowRight':
            mesh.position.x += speed;
            break;
    }
});
```

#### 3. 부드러운 이동 (Lerp)

```javascript
const targetPosition = new THREE.Vector3(5, 2, -3);

function draw() {
    const delta = clock.getDelta();
    
    // 목표 위치로 부드럽게 이동 (선형 보간)
    mesh.position.x += (targetPosition.x - mesh.position.x) * delta * 2;
    mesh.position.y += (targetPosition.y - mesh.position.y) * delta * 2;
    mesh.position.z += (targetPosition.z - mesh.position.z) * delta * 2;
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
```

---

## 4. Scale (크기)

### 📏 기본 개념

Scale은 객체의 크기를 **배율**로 조절합니다. 기본값은 `1`입니다.

### 기본 사용법

```javascript
// 방법 1: 개별 축 조절
mesh.scale.x = 2;    // X축 방향으로 2배
mesh.scale.y = 0.5;  // Y축 방향으로 0.5배 (절반)
mesh.scale.z = 1.5;  // Z축 방향으로 1.5배

// 방법 2: 한번에 설정
mesh.scale.set(2, 0.5, 1.5);

// 방법 3: 모든 축을 동일하게 (비율 유지)
mesh.scale.setScalar(2); // 모든 축 2배
```

### 📊 Scale 값의 의미

| Scale 값 | 의미 | 결과 |
|---------|------|------|
| 1 | 원본 크기 | 변화 없음 |
| 2 | 2배 | 크기가 2배로 커짐 |
| 0.5 | 절반 | 크기가 절반으로 작아짐 |
| 0 | 크기 없음 | **보이지 않음** ⚠️ |
| -1 | 뒤집힘 | 객체가 반대 방향으로 뒤집힘 |

### ⚠️ Scale 주의사항

#### 1. Scale이 0이면 객체가 보이지 않습니다

```javascript
mesh.scale.x = 0; // X축 방향으로 납작해져서 보이지 않음
mesh.scale.setScalar(0); // 완전히 사라짐
```

#### 2. 음수 Scale은 객체를 뒤집습니다

```javascript
mesh.scale.x = -1; // X축 방향으로 뒤집힘 (거울 효과)
mesh.scale.y = -1; // Y축 방향으로 뒤집힘
```

#### 3. 각 축을 다르게 조절하면 비율이 왜곡됩니다

```javascript
mesh.scale.set(2, 0.5, 1); // X는 넓게, Y는 납작하게
// 원래 정육면체였어도 직육면체가 됨
```

### 💡 Scale 활용 예시

#### 1. 버튼 클릭 애니메이션

```javascript
let isAnimating = false;

button.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;
    
    // 커졌다가 작아지기
    gsap.to(mesh.scale, {
        x: 1.2, y: 1.2, z: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => isAnimating = false
    });
});
```

#### 2. 호흡 효과 (Breathing Effect)

```javascript
function draw() {
    const time = clock.getElapsedTime();
    
    // 사인파를 이용한 부드러운 크기 변화
    const scale = 1 + Math.sin(time * 2) * 0.1; // 0.9 ~ 1.1
    mesh.scale.setScalar(scale);
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
```

#### 3. 펄스 효과 (Pulse)

```javascript
let pulseScale = 1;
let pulseDirection = 1;

function draw() {
    const delta = clock.getDelta();
    
    pulseScale += pulseDirection * delta;
    
    if (pulseScale > 1.3) pulseDirection = -1;
    if (pulseScale < 1) pulseDirection = 1;
    
    mesh.scale.setScalar(pulseScale);
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
```

#### 4. 거리에 따른 크기 조절

```javascript
function draw() {
    const distance = mesh.position.distanceTo(camera.position);
    
    // 거리가 멀수록 작게 (추가 원근 효과)
    const scale = Math.max(0.5, 2 / distance);
    mesh.scale.setScalar(scale);
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
```

---

## 5. Rotation (회전)

### 🔄 기본 개념

Three.js의 회전은 **라디안(Radian)** 단위를 사용합니다!

### 📐 라디안과 각도

#### 변환 공식

```javascript
// 각도 → 라디안
const radians = degrees * (Math.PI / 180);
const radians = THREE.MathUtils.degToRad(degrees); // Three.js 헬퍼

// 라디안 → 각도
const degrees = radians * (180 / Math.PI);
const degrees = THREE.MathUtils.radToDeg(radians); // Three.js 헬퍼
```

#### 자주 사용하는 각도-라디안 대응표

| 각도 | 라디안 | 수식 | 근사값 |
|-----|--------|------|--------|
| 0° | 0 | 0 | 0 |
| 45° | π/4 | Math.PI / 4 | 0.785 |
| 90° | π/2 | Math.PI / 2 | 1.571 |
| 180° | π | Math.PI | 3.142 |
| 270° | 3π/2 | Math.PI * 1.5 | 4.712 |
| 360° | 2π | Math.PI * 2 | 6.283 |

### 기본 사용법

```javascript
// 방법 1: 라디안으로 직접 설정
mesh.rotation.x = Math.PI / 4;  // 45도
mesh.rotation.y = Math.PI;       // 180도
mesh.rotation.z = Math.PI / 2;   // 90도

// 방법 2: 각도를 라디안으로 변환 (추천)
mesh.rotation.x = THREE.MathUtils.degToRad(45);   // 45도
mesh.rotation.y = THREE.MathUtils.degToRad(90);   // 90도
mesh.rotation.z = THREE.MathUtils.degToRad(180);  // 180도

// 방법 3: set 메서드
mesh.rotation.set(
    THREE.MathUtils.degToRad(45),
    THREE.MathUtils.degToRad(90),
    0
);
```

### 🔄 회전 순서 (Rotation Order)

Three.js는 **오일러 각(Euler Angles)**을 사용하여 회전을 표현합니다. 
회전 순서에 따라 최종 결과가 달라집니다!

```javascript
// 기본 회전 순서는 'XYZ'
console.log(mesh.rotation.order); // 'XYZ'

// 회전 순서 변경
mesh.rotation.reorder('YXZ'); // Y → X → Z 순서로 회전

// 회전 값 설정 (순서가 중요!)
mesh.rotation.y = THREE.MathUtils.degToRad(45);
mesh.rotation.x = THREE.MathUtils.degToRad(20);
mesh.rotation.z = THREE.MathUtils.degToRad(10);
```

#### 회전 순서 종류

- `'XYZ'` (기본값): X축 → Y축 → Z축
- `'YXZ'`: Y축 → X축 → Z축 (캐릭터 컨트롤러에서 자주 사용)
- `'ZXY'`: Z축 → X축 → Y축
- `'ZYX'`: Z축 → Y축 → X축
- `'YZX'`: Y축 → Z축 → X축
- `'XZY'`: X축 → Z축 → Y축

**언제 변경하나?**
- 김벌 락(Gimbal Lock) 문제 해결
- 특정 회전 결과를 얻고 싶을 때
- 캐릭터 컨트롤러 구현 시

### 💡 Rotation 활용 예시

#### 1. 연속 회전 (애니메이션)

```javascript
function draw() {
    const delta = clock.getDelta();
    
    // 매 프레임마다 조금씩 회전
    mesh.rotation.y += delta; // 초당 약 57도 회전 (1 radian)
    mesh.rotation.x += delta * 0.5; // 천천히 회전
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
```

#### 2. 특정 각도로 회전

```javascript
// 45도로 회전
mesh.rotation.y = THREE.MathUtils.degToRad(45);

// 180도 뒤집기
mesh.rotation.y = Math.PI;

// 90도씩 회전
function rotateRight() {
    mesh.rotation.y += Math.PI / 2; // 90도 추가
}
```

#### 3. 부드러운 회전 (Lerp)

```javascript
let targetRotation = 0;

function draw() {
    const delta = clock.getDelta();
    
    // 목표 회전값으로 부드럽게 이동
    mesh.rotation.y += (targetRotation - mesh.rotation.y) * delta * 5;
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}

// 클릭 시 90도 회전
button.addEventListener('click', () => {
    targetRotation += Math.PI / 2;
});
```

#### 4. 특정 방향 바라보기

```javascript
// 특정 객체를 바라보도록 회전
const direction = new THREE.Vector3();
direction.subVectors(target.position, mesh.position);
direction.normalize();

const angle = Math.atan2(direction.x, direction.z);
mesh.rotation.y = angle;
```

### ⚠️ Rotation 주의사항

#### 1. 라디안과 각도 혼동 주의

```javascript
// ❌ 잘못된 예: 각도를 직접 사용
mesh.rotation.y = 90; // 90 라디안 = 5156도!

// ✅ 올바른 예: 변환 후 사용
mesh.rotation.y = THREE.MathUtils.degToRad(90); // 90도
```

#### 2. 회전 값의 누적

```javascript
// 문제: 값이 무한정 커짐
function draw() {
    mesh.rotation.y += 0.01;
    // 계속 회전하면 값이 계속 커짐 (100, 1000, 10000...)
}

// 해결: 2π를 넘으면 0으로 리셋
function draw() {
    mesh.rotation.y = (mesh.rotation.y + 0.01) % (Math.PI * 2);
}
```

#### 3. 김벌 락 (Gimbal Lock)

특정 회전 순서에서 한 축이 다른 축과 겹쳐 자유도를 잃는 현상

```javascript
// 해결 방법 1: 회전 순서 변경
mesh.rotation.reorder('YXZ');

// 해결 방법 2: Quaternion 사용 (고급)
mesh.quaternion.setFromEuler(new THREE.Euler(x, y, z, 'YXZ'));
```

---

## 6. dat.GUI 활용

### 🎛️ dat.GUI란?

**dat.GUI**는 Three.js 개발 시 필수 도구입니다. 코드를 수정하지 않고도 값을 실시간으로 조절할 수 있습니다.

### 설치 및 import

```javascript
// 설치
npm install dat.gui

// import
import dat from 'dat.gui';
```

### 기본 사용법

```javascript
const gui = new dat.GUI();

// 숫자 슬라이더 (최소값, 최대값, 스텝)
gui.add(mesh.position, 'x', -5, 5, 0.1).name('X 위치');
gui.add(mesh.position, 'y', -5, 5, 0.1).name('Y 위치');
gui.add(mesh.position, 'z', -5, 5, 0.1).name('Z 위치');

// 회전 조절
gui.add(mesh.rotation, 'x', 0, Math.PI * 2).name('X 회전');
gui.add(mesh.rotation, 'y', 0, Math.PI * 2).name('Y 회전');

// 크기 조절
gui.add(mesh.scale, 'x', 0.1, 3).name('X 크기');
```

### 폴더로 그룹화

```javascript
const gui = new dat.GUI();

// Position 폴더
const positionFolder = gui.addFolder('Position');
positionFolder.add(mesh.position, 'x', -10, 10, 0.1);
positionFolder.add(mesh.position, 'y', -10, 10, 0.1);
positionFolder.add(mesh.position, 'z', -10, 10, 0.1);
positionFolder.open(); // 기본적으로 열려있게

// Rotation 폴더
const rotationFolder = gui.addFolder('Rotation');
rotationFolder.add(mesh.rotation, 'x', 0, Math.PI * 2);
rotationFolder.add(mesh.rotation, 'y', 0, Math.PI * 2);
rotationFolder.add(mesh.rotation, 'z', 0, Math.PI * 2);

// Scale 폴더
const scaleFolder = gui.addFolder('Scale');
scaleFolder.add(mesh.scale, 'x', 0.1, 3);
scaleFolder.add(mesh.scale, 'y', 0.1, 3);
scaleFolder.add(mesh.scale, 'z', 0.1, 3);
```

### 다양한 컨트롤 타입

```javascript
// 체크박스
const options = { wireframe: false };
gui.add(options, 'wireframe').onChange((value) => {
    material.wireframe = value;
});

// 색상 선택
const colorController = { color: '#ff0000' };
gui.addColor(colorController, 'color').onChange((value) => {
    material.color.set(value);
});

// 버튼
const actions = {
    reset: () => {
        mesh.position.set(0, 0, 0);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
    },
    randomPosition: () => {
        mesh.position.set(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        );
    }
};
gui.add(actions, 'reset');
gui.add(actions, 'randomPosition').name('랜덤 위치');

// 드롭다운
const settings = { shape: 'Box' };
gui.add(settings, 'shape', ['Box', 'Sphere', 'Cylinder']).onChange((value) => {
    // 도형 변경 로직
});
```

### onChange와 onFinishChange

```javascript
// onChange: 값이 변할 때마다 호출 (드래그 중에도)
gui.add(mesh.position, 'x', -5, 5).onChange((value) => {
    console.log('X:', value);
});

// onFinishChange: 값 변경이 완료되면 호출 (드래그 끝날 때)
gui.add(mesh.position, 'x', -5, 5).onFinishChange((value) => {
    console.log('최종 X:', value);
});
```

### 💡 dat.GUI 실전 팁

#### 1. GUI 위치 변경

```javascript
const gui = new dat.GUI();
gui.domElement.style.position = 'absolute';
gui.domElement.style.top = '0px';
gui.domElement.style.right = '0px';
```

#### 2. GUI 숨기기/보이기

```javascript
const gui = new dat.GUI();

// H 키로 토글
window.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
        gui.domElement.style.display = 
            gui.domElement.style.display === 'none' ? '' : 'none';
    }
});
```

#### 3. GUI 너비 조절

```javascript
const gui = new dat.GUI({ width: 400 });
```

#### 4. GUI 닫힌 상태로 시작

```javascript
const gui = new dat.GUI({ closed: true });
```

---

## 7. 실전 예제 및 팁

### 🎯 종합 예제: 인터랙티브 큐브

```javascript
import * as THREE from 'three';
import dat from 'dat.gui';

export default function example() {
    // Renderer
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(3, 3, 5);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight('white', 1);
    directionalLight.position.set(1, 2, 3);
    scene.add(directionalLight);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 'hotpink' });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Helpers
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // dat.GUI
    const gui = new dat.GUI();

    // Position
    const posFolder = gui.addFolder('Position');
    posFolder.add(mesh.position, 'x', -5, 5, 0.1);
    posFolder.add(mesh.position, 'y', -5, 5, 0.1);
    posFolder.add(mesh.position, 'z', -5, 5, 0.1);
    posFolder.open();

    // Rotation
    const rotFolder = gui.addFolder('Rotation');
    rotFolder.add(mesh.rotation, 'x', 0, Math.PI * 2).name('X (rad)');
    rotFolder.add(mesh.rotation, 'y', 0, Math.PI * 2).name('Y (rad)');
    rotFolder.add(mesh.rotation, 'z', 0, Math.PI * 2).name('Z (rad)');

    // Scale
    const scaleFolder = gui.addFolder('Scale');
    scaleFolder.add(mesh.scale, 'x', 0.1, 3);
    scaleFolder.add(mesh.scale, 'y', 0.1, 3);
    scaleFolder.add(mesh.scale, 'z', 0.1, 3);

    // Actions
    const actions = {
        reset: () => {
            mesh.position.set(0, 0, 0);
            mesh.rotation.set(0, 0, 0);
            mesh.scale.set(1, 1, 1);
        },
        animate: () => {
            gsap.to(mesh.rotation, {
                y: Math.PI * 2,
                duration: 2,
                ease: 'power2.inOut'
            });
        }
    };
    gui.add(actions, 'reset');
    gui.add(actions, 'animate');

    // Animation
    const clock = new THREE.Clock();

    function draw() {
        const delta = clock.getDelta();

        renderer.render(scene, camera);
        requestAnimationFrame(draw);
    }

    // Resize
    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', setSize);

    draw();
}
```

### 💡 개발 팁 모음

#### 1. 키보드로 객체 조작

```javascript
const speed = 0.1;

window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w': case 'W': // 앞으로
            mesh.position.z -= speed;
            break;
        case 's': case 'S': // 뒤로
            mesh.position.z += speed;
            break;
        case 'a': case 'A': // 왼쪽
            mesh.position.x -= speed;
            break;
        case 'd': case 'D': // 오른쪽
            mesh.position.x += speed;
            break;
        case ' ': // 스페이스바: 점프
            animateJump();
            break;
    }
});
```

#### 2. 마우스로 객체 드래그

```javascript
import { DragControls } from 'three/examples/jsm/controls/DragControls';

const dragControls = new DragControls([mesh], camera, renderer.domElement);

dragControls.addEventListener('drag', () => {
    console.log('위치:', mesh.position);
});
```

#### 3. 경계 제한

```javascript
function draw() {
    // ... 이동 로직 ...

    // 경계 체크 (-5 ~ 5 범위)
    mesh.position.x = Math.max(-5, Math.min(5, mesh.position.x));
    mesh.position.y = Math.max(-5, Math.min(5, mesh.position.y));
    mesh.position.z = Math.max(-5, Math.min(5, mesh.position.z));

    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
```

### 🎓 학습 체크리스트

- [ ] 3D 좌표계 (X, Y, Z) 이해
- [ ] Position 설정 및 메서드 사용
- [ ] Scale 값의 의미 이해
- [ ] Rotation의 라디안 개념
- [ ] 각도를 라디안으로 변환
- [ ] dat.GUI로 실시간 값 조절
- [ ] AxesHelper로 좌표축 시각화
- [ ] 키보드/마우스 인터랙션 구현

### 📚 복습 문제

#### 문제 1: Position
```javascript
// mesh를 (2, 1, -3) 위치로 이동시키고,
// 카메라(0, 0, 5)까지의 거리를 구하세요.
```

<details>
<summary>정답 보기</summary>

```javascript
mesh.position.set(2, 1, -3);
const distance = mesh.position.distanceTo(new THREE.Vector3(0, 0, 5));
console.log(distance); // 약 8.25
```
</details>

#### 문제 2: Rotation
```javascript
// mesh를 Y축 기준으로 45도 회전시키세요.
// (라디안 변환 사용)
```

<details>
<summary>정답 보기</summary>

```javascript
mesh.rotation.y = THREE.MathUtils.degToRad(45);
// 또는
mesh.rotation.y = Math.PI / 4;
```
</details>

---

## 🎉 마무리

Transform은 Three.js의 가장 기본이 되는 개념입니다!

**핵심 요약:**
1. **Position**: 3D 공간에서의 위치 (x, y, z)
2. **Scale**: 객체의 크기 배율 (기본값 1)
3. **Rotation**: 회전 (라디안 단위!)

이 세 가지를 자유자재로 다룰 수 있다면, 
어떤 3D 객체든 원하는 대로 배치하고 움직일 수 있습니다! 🚀

---

**다음 학습 주제**: Scene Graph & Geometry  
**작성일**: 2025년 11월 28일  
**복습일**: 2025년 12월 5일

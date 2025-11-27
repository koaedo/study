# 📚 Three.js Scene Graph & Geometry 완벽 복습 가이드

> **작성일:** 2025년 12월 5일  
> **학습 주제:** Scene Graph (계층 구조) 및 Geometry (도형)  
> **예제 코드 위치:** `threejsStudy/04_transform/dev/src/ex04.js`, `threejsStudy/05_geometry/dev/src/`

---

## 목차
1. [Scene Graph 개념](#1-scene-graph-개념)
2. [Scene Graph 동작 원리](#2-scene-graph-동작-원리)
3. [Geometry 기본](#3-geometry-기본)
4. [세그먼트 (Segment)](#4-세그먼트-segment)
5. [Geometry 옵션](#5-geometry-옵션)
6. [Vertex (정점) 조작](#6-vertex-정점-조작)
7. [실전 예제 및 팁](#7-실전-예제-및-팁)

---

## 1. Scene Graph 개념

### 🌳 Scene Graph란?

**Scene Graph**는 3D 객체들을 **계층 구조(Tree Structure)**로 관리하는 시스템입니다.  
여러 객체를 그룹으로 묶어 부모-자식 관계를 만들고, 하나의 단위처럼 제어할 수 있습니다.

```
Scene (씬)
├─ Camera (카메라)
├─ Light (조명)
└─ Group1 (그룹1) ← 부모
    ├─ Mesh1 (메시1) ← 자식
    └─ Group2 (그룹2) ← 자식이자 부모
        ├─ Mesh2 (메시2) ← 손자
        └─ Group3 (그룹3) ← 손자이자 부모
            └─ Mesh3 (메시3) ← 증손자
```

### 💡 왜 Scene Graph를 사용하나?

#### 1. 여러 객체를 하나처럼 제어

```javascript
// 그룹을 회전하면 안의 모든 객체가 함께 회전
group.rotation.y += 0.01;
// group 안의 mesh1, mesh2, mesh3 모두 함께 회전
```

#### 2. 복잡한 구조를 체계적으로 관리

```javascript
// 태양계 예시
solarSystem (태양계 전체)
├─ sun (태양)
├─ earthOrbit (지구 궤도)
│   ├─ earth (지구)
│   └─ moonOrbit (달 궤도)
│       └─ moon (달)
└─ marsOrbit (화성 궤도)
    └─ mars (화성)
```

#### 3. 상대적 위치와 변환 관리

```javascript
// 지구는 태양을 기준으로 10 떨어진 위치
earthOrbit.position.x = 10;

// 달은 지구를 기준으로 3 떨어진 위치
moonOrbit.position.x = 3;

// 태양계 전체를 이동하면 모든 객체가 함께 이동
solarSystem.position.y = 5;
```

### 📦 Group 생성과 사용

```javascript
// Group 생성
const group1 = new THREE.Group();
const group2 = new THREE.Group();
const group3 = new THREE.Group();

// Mesh 생성
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 'hotpink' });

const box1 = new THREE.Mesh(geometry, material);
const box2 = box1.clone();
box2.scale.set(0.3, 0.3, 0.3);

const box3 = box2.clone();
box3.scale.set(0.15, 0.15, 0.15);

// 위치 설정 (부모 기준 상대 위치)
group2.position.x = 2;
group3.position.x = 0.5;

// 계층 구조 만들기
group3.add(box3);           // group3에 box3 추가
group2.add(box2, group3);   // group2에 box2와 group3 추가
group1.add(box1, group2);   // group1에 box1과 group2 추가
scene.add(group1);          // 씬에 최상위 그룹만 추가
```

---

## 2. Scene Graph 동작 원리

### 🔄 Transform 상속

부모의 transform(위치, 회전, 크기)은 **모든 자식에게 영향**을 줍니다.

#### 1. 부모 회전 → 자식도 함께 회전

```javascript
function draw() {
    const delta = clock.getDelta();
    
    // group1을 회전하면
    group1.rotation.y += delta;
    
    // 결과:
    // - box1도 회전
    // - group2도 회전 (안에 있는 box2, group3도 함께)
    // - group3도 회전 (안에 있는 box3도 함께)
}
```

#### 2. 부모 이동 → 자식도 함께 이동

```javascript
// group1을 (5, 0, 0)으로 이동
group1.position.x = 5;

// 결과: group1 안의 모든 객체가 함께 이동
// - box1의 실제 위치: (5, 0, 0)
// - group2의 실제 위치: (7, 0, 0) ← 5 + 2 (group2.position.x)
// - box2의 실제 위치: (7, 0, 0)
// - group3의 실제 위치: (7.5, 0, 0) ← 7 + 0.5 (group3.position.x)
```

#### 3. 자식의 상대적 위치

```javascript
group2.position.x = 2; // group1을 기준으로 x축 +2 위치

// group1의 위치에 따라 group2의 실제 위치가 변경됨
// group1.position.x = 0  → group2 실제 위치: (2, 0, 0)
// group1.position.x = 5  → group2 실제 위치: (7, 0, 0)
// group1.position.x = -3 → group2 실제 위치: (-1, 0, 0)
```

### 🎯 각자 회전 + 전체 회전

```javascript
function draw() {
    const delta = clock.getDelta();
    
    group1.rotation.y += delta;      // 전체가 회전
    group2.rotation.y += delta;      // group2도 자체 회전
    group3.rotation.y += delta;      // group3도 자체 회전
    
    // 결과: 태양계처럼 각자 자전하면서 전체도 공전
}
```

### 💡 Object3D vs Group

```javascript
// Object3D: 기본 3D 객체
const obj = new THREE.Object3D();

// Group: Object3D와 동일하지만 의미적으로 더 명확
const group = new THREE.Group();

// 기능은 동일! Group 사용 권장
```

---

## 3. Geometry 기본

### 🔷 Geometry란?

**Geometry**는 3D 객체의 **형태(모양)**를 정의합니다.  
점(Vertex), 선(Edge), 면(Face)으로 구성됩니다.

```
Geometry + Material = Mesh
(모양)  + (재질)   = (3D 객체)
```

### 📦 Three.js 기본 제공 Geometry

#### 1. BoxGeometry (육면체)

```javascript
// BoxGeometry(가로, 세로, 깊이, 가로분할, 세로분할, 깊이분할)
const geometry = new THREE.BoxGeometry(1, 1, 1);

// 세그먼트로 면 세분화
const detailedBox = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
```

**사용 예시:** 큐브, 건물, 상자 등

#### 2. SphereGeometry (구)

```javascript
// SphereGeometry(반지름, 가로 세그먼트, 세로 세그먼트)
const geometry = new THREE.SphereGeometry(1, 32, 32);

// 낮은 세그먼트 = 각진 구 (로우폴리)
const lowPoly = new THREE.SphereGeometry(1, 8, 8);

// 높은 세그먼트 = 부드러운 구
const highPoly = new THREE.SphereGeometry(1, 64, 64);
```

**사용 예시:** 공, 행성, 캐릭터 머리 등

#### 3. PlaneGeometry (평면)

```javascript
// PlaneGeometry(가로, 세로, 가로 세그먼트, 세로 세그먼트)
const geometry = new THREE.PlaneGeometry(5, 5);

// 지형 생성용 (세그먼트 많이)
const terrain = new THREE.PlaneGeometry(100, 100, 128, 128);
```

**사용 예시:** 바닥, 벽, 지형, 화면 등

#### 4. CylinderGeometry (원기둥)

```javascript
// CylinderGeometry(윗면 반지름, 아랫면 반지름, 높이, 둘레 세그먼트)
const cylinder = new THREE.CylinderGeometry(1, 1, 3, 32);

// 원뿔 만들기 (윗면 반지름 0)
const cone = new THREE.CylinderGeometry(0, 1, 3, 32);
```

**사용 예시:** 기둥, 나무, 원통형 객체 등

#### 5. ConeGeometry (원뿔)

```javascript
// ConeGeometry(반지름, 높이, 둘레 세그먼트)
const cone = new THREE.ConeGeometry(1, 3, 32);
```

**사용 예시:** 나무, 화살표, 원뿔 모자 등

#### 6. TorusGeometry (도넛)

```javascript
// TorusGeometry(반지름, 튜브 두께, 둘레 세그먼트, 튜브 세그먼트)
const torus = new THREE.TorusGeometry(1, 0.4, 16, 100);
```

**사용 예시:** 반지, 도넛, 타이어 등

#### 7. TorusKnotGeometry (매듭 도넛)

```javascript
// TorusKnotGeometry(반지름, 튜브 두께, 세그먼트, 튜브 세그먼트, p, q)
const knot = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
```

**사용 예시:** 장식, 복잡한 매듭 구조

### 💡 Geometry 재사용으로 최적화

```javascript
// ✅ 좋은 예: 하나의 Geometry를 여러 Mesh에서 재사용
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 'red' });

for (let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(geometry, material); // 재사용!
    mesh.position.x = i;
    scene.add(mesh);
}
// 메모리 사용량: Geometry 1개 + Material 1개

// ❌ 나쁜 예: 매번 새로 생성
for (let i = 0; i < 100; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1); // 매번 생성
    const material = new THREE.MeshStandardMaterial({ color: 'red' });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = i;
    scene.add(mesh);
}
// 메모리 사용량: Geometry 100개 + Material 100개
```

---

## 4. 세그먼트 (Segment)

### 📊 세그먼트란?

**세그먼트(Segment)**는 도형을 이루는 **면의 분할 정도**입니다.  
세그먼트가 많을수록 더 부드러운 곡면을 만들 수 있지만, 성능이 저하됩니다.

### 비교: 낮은 세그먼트 vs 높은 세그먼트

```javascript
// 낮은 세그먼트 (8)
const lowPoly = new THREE.SphereGeometry(1, 8, 8);
// 장점: 빠른 렌더링, 적은 메모리, 로우폴리 스타일
// 단점: 각져 보임, 덜 부드러움

// 중간 세그먼트 (32)
const midPoly = new THREE.SphereGeometry(1, 32, 32);
// 균형잡힌 선택: 대부분의 경우 적합

// 높은 세그먼트 (64)
const highPoly = new THREE.SphereGeometry(1, 64, 64);
// 장점: 부드러운 곡면, 사실적
// 단점: 느린 렌더링, 많은 메모리
```

### 📏 세그먼트 수 선택 가이드

| 용도 | 추천 세그먼트 | 예시 |
|-----|-------------|------|
| 배경 장식 | 4-8 | 먼 거리의 배경 객체 |
| 로우폴리 스타일 | 8-16 | 스타일리시한 게임 그래픽 |
| 일반 객체 | 16-32 | 일반적인 3D 모델 |
| 주요 객체 | 32-64 | 플레이어, 주요 캐릭터 |
| 클로즈업 | 64-128 | 카메라에 매우 가까운 객체 |

### ⚠️ 성능 고려사항

```javascript
// 정점 수 계산
const sphere = new THREE.SphereGeometry(1, 32, 32);
const vertexCount = sphere.attributes.position.count;
console.log('정점 수:', vertexCount); // 1026개

// 세그먼트를 2배로 늘리면 정점 수는 4배!
const highSphere = new THREE.SphereGeometry(1, 64, 64);
const highVertexCount = highSphere.attributes.position.count;
console.log('정점 수:', highVertexCount); // 4098개
```

**성능 팁:**
- 필요한 만큼만 세그먼트 사용
- LOD (Level of Detail) 기법 활용: 거리에 따라 세그먼트 수 조절
- 많은 객체가 필요하면 세그먼트 줄이기

---

## 5. Geometry 옵션

### 🎨 wireframe (와이어프레임)

도형을 **선**으로만 표시하여 구조를 확인할 수 있습니다.

```javascript
const material = new THREE.MeshStandardMaterial({
    color: 'hotpink',
    wireframe: true // 선으로만 표시
});

// 디버깅이나 구조 확인에 유용
// 완성 후에는 false로 변경
```

**사용 예시:**
- 개발 중 구조 확인
- 로우폴리 스타일 표현
- 디버깅

### 🔄 side (면 렌더링 방향)

```javascript
// FrontSide (기본값): 앞면만 렌더링
const material1 = new THREE.MeshStandardMaterial({
    side: THREE.FrontSide
});

// BackSide: 뒷면만 렌더링
const material2 = new THREE.MeshStandardMaterial({
    side: THREE.BackSide
});

// DoubleSide: 양면 모두 렌더링 (성능 ↓)
const material3 = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
});
```

**언제 사용하나?**

| Side | 사용 시기 | 예시 |
|------|-----------|------|
| FrontSide | 일반적인 경우 (기본값) | 대부분의 3D 객체 |
| BackSide | 내부에서 봐야 할 때 | 스카이박스 내부 |
| DoubleSide | 양면이 모두 보일 때 | 평면, 얇은 객체 (종이, 천) |

```javascript
// 예시: 평면은 양면 렌더링 필요
const plane = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 'white',
    side: THREE.DoubleSide // 앞뒤로 회전해도 보임
});
const planeMesh = new THREE.Mesh(plane, planeMaterial);
```

### 🎭 flatShading (평면 음영)

```javascript
// Smooth Shading (기본값)
const smoothMaterial = new THREE.MeshStandardMaterial({
    color: 'orangered',
    flatShading: false // 부드러운 음영
});

// Flat Shading
const flatMaterial = new THREE.MeshStandardMaterial({
    color: 'orangered',
    flatShading: true // 각진 음영 (로우폴리 느낌)
});
```

**언제 사용하나?**
- **flatShading: true** → 로우폴리(Low-poly) 스타일, 레트로 게임 느낌
- **flatShading: false** → 사실적인 렌더링, 부드러운 표면

**로우폴리 스타일 만들기:**

```javascript
// 낮은 세그먼트 + flatShading = 멋진 로우폴리 아트!
const geometry = new THREE.SphereGeometry(5, 12, 12); // 낮은 세그먼트
const material = new THREE.MeshStandardMaterial({
    color: 'orangered',
    flatShading: true // 평면 음영
});
const mesh = new THREE.Mesh(geometry, material);
```

---

## 6. Vertex (정점) 조작

### 📐 Vertex란?

**정점(Vertex)**은 3D 도형을 이루는 **점**들입니다.  
모든 3D 객체는 수많은 정점으로 구성되어 있습니다.

```
   v1 ●───────● v2
      │      /│
      │    /  │
      │  /    │
      │/      │
   v3 ●───────● v4

각 정점은 x, y, z 좌표를 가집니다.
```

### 🔍 정점 데이터 구조

```javascript
const geometry = new THREE.SphereGeometry(5, 64, 64);

// 정점 위치 배열 가져오기
const positionArray = geometry.attributes.position.array;

// positionArray는 Float32Array (1차원 배열)
// [x1, y1, z1, x2, y2, z2, x3, y3, z3, ...]
// 3개씩 묶어서 하나의 정점을 나타냄

console.log(positionArray.length); // 정점 개수 × 3
console.log(positionArray.length / 3); // 실제 정점 개수

// 예시: 첫 번째 정점
const x1 = positionArray[0];
const y1 = positionArray[1];
const z1 = positionArray[2];
```

### ✏️ 정점 조작 기본

```javascript
const geometry = new THREE.SphereGeometry(5, 64, 64);
const positionArray = geometry.attributes.position.array;

// 모든 정점을 순회하며 조작
for (let i = 0; i < positionArray.length; i += 3) {
    // i:     x 좌표 인덱스
    // i+1:   y 좌표 인덱스
    // i+2:   z 좌표 인덱스
    
    // 각 정점을 랜덤하게 이동
    positionArray[i]     += (Math.random() - 0.5) * 0.2; // x
    positionArray[i + 1] += (Math.random() - 0.5) * 0.2; // y
    positionArray[i + 2] += (Math.random() - 0.5) * 0.2; // z
}

// ⚠️ 중요: 정점을 수정했다고 Three.js에 알려야 함!
geometry.attributes.position.needsUpdate = true;
```

### 🌊 정점 애니메이션 예제

#### 예제 1: 파도 효과 (평면)

```javascript
const geometry = new THREE.PlaneGeometry(10, 10, 50, 50);
const material = new THREE.MeshStandardMaterial({
    color: 'skyblue',
    side: THREE.DoubleSide
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 정점 배열
const positionArray = geometry.attributes.position.array;

// 초기 y값 저장 (원본 위치)
const originalY = [];
for (let i = 0; i < positionArray.length; i += 3) {
    originalY.push(positionArray[i + 1]);
}

// 애니메이션
function draw() {
    const time = clock.getElapsedTime();
    
    for (let i = 0; i < positionArray.length; i += 3) {
        const index = i / 3;
        const x = positionArray[i];
        const z = positionArray[i + 2];
        
        // 사인파로 물결 효과
        const wave1 = Math.sin(x + time) * 0.5;
        const wave2 = Math.sin(z + time * 0.5) * 0.3;
        
        positionArray[i + 1] = originalY[index] + wave1 + wave2;
    }
    
    geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
```

#### 예제 2: 펄럭이는 구체

```javascript
const geometry = new THREE.SphereGeometry(5, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: 'orangered',
    flatShading: true
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const positionArray = geometry.attributes.position.array;

// 각 정점마다 랜덤 값 저장
const randomArray = [];
for (let i = 0; i < positionArray.length; i += 3) {
    randomArray[i]     = (Math.random() - 0.5) * 0.2;
    randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
}

function draw() {
    const time = clock.getElapsedTime() * 3;
    
    for (let i = 0; i < positionArray.length; i += 3) {
        // sin 함수로 부드러운 움직임
        positionArray[i]     += Math.sin(time + randomArray[i] * 100) * 0.001;
        positionArray[i + 1] += Math.sin(time + randomArray[i + 1] * 100) * 0.001;
        positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.001;
    }
    
    geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
}
```

#### 예제 3: 지형 생성 (Terrain)

```javascript
const geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
const material = new THREE.MeshStandardMaterial({
    color: 'green',
    wireframe: false
});
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2; // 수평으로 눕히기
scene.add(mesh);

const positionArray = geometry.attributes.position.array;

// 지형 생성 (간단한 산 모양)
for (let i = 0; i < positionArray.length; i += 3) {
    const x = positionArray[i];
    const y = positionArray[i + 1]; // PlaneGeometry는 y가 아닌 z를 높이로 사용
    
    // 중심에서의 거리
    const distance = Math.sqrt(x * x + y * y);
    
    // 거리에 따라 높이 설정 (중심이 높고 가장자리가 낮음)
    const height = Math.max(0, 5 - distance * 0.3);
    
    // z 좌표를 높이로 사용
    positionArray[i + 2] = height;
}

geometry.attributes.position.needsUpdate = true;
geometry.computeVertexNormals(); // 법선 벡터 재계산 (조명 효과)
```

### ⚠️ 정점 조작 주의사항

#### 1. needsUpdate는 필수!

```javascript
// ❌ 화면에 반영 안됨
positionArray[i] = newValue;

// ✅ 화면에 반영됨
positionArray[i] = newValue;
geometry.attributes.position.needsUpdate = true;
```

#### 2. 성능 고려

```javascript
// ❌ 너무 많은 정점 = 느림
const geometry = new THREE.SphereGeometry(5, 256, 256);
// 131,586개 정점! 매 프레임 조작하면 매우 느림

// ✅ 적절한 수준
const geometry = new THREE.SphereGeometry(5, 64, 64);
// 8,322개 정점
```

#### 3. 법선 벡터 재계산

```javascript
// 정점을 크게 변형했다면 법선 벡터도 재계산
geometry.computeVertexNormals();

// 법선 벡터: 각 면의 방향을 나타내는 벡터
// 조명 계산에 필요하므로 변형 후 재계산 필요
```

---

## 7. 실전 예제 및 팁

### 🎯 종합 예제 1: 태양계 시뮬레이션

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function solarSystem() {
    const canvas = document.querySelector('#three-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 15, 40);
    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Light
    const ambientLight = new THREE.AmbientLight('white', 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight('white', 2, 100);
    scene.add(pointLight);

    // 태양
    const sunGroup = new THREE.Group();
    const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.5
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sun);
    scene.add(sunGroup);

    // 지구 그룹 (궤도)
    const earthOrbit = new THREE.Group();
    earthOrbit.position.x = 15;
    sunGroup.add(earthOrbit);

    const earthGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2233ff });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthOrbit.add(earth);

    // 달 그룹 (궤도)
    const moonOrbit = new THREE.Group();
    moonOrbit.position.x = 3;
    earthOrbit.add(moonOrbit);

    const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moonOrbit.add(moon);

    // 화성 그룹 (궤도)
    const marsOrbit = new THREE.Group();
    marsOrbit.position.x = 22;
    sunGroup.add(marsOrbit);

    const marsGeometry = new THREE.SphereGeometry(1, 32, 32);
    const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    const mars = new THREE.Mesh(marsGeometry, marsMaterial);
    marsOrbit.add(mars);

    // 애니메이션
    const clock = new THREE.Clock();

    function draw() {
        const delta = clock.getDelta();

        // 태양 자전
        sun.rotation.y += delta * 0.5;

        // 지구 공전 및 자전
        earthOrbit.rotation.y += delta * 0.5;
        earth.rotation.y += delta;

        // 달 공전 및 자전
        moonOrbit.rotation.y += delta * 2;
        moon.rotation.y += delta * 0.5;

        // 화성 공전 및 자전
        marsOrbit.rotation.y += delta * 0.3;
        mars.rotation.y += delta * 0.8;

        renderer.render(scene, camera);
        requestAnimationFrame(draw);
    }

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

#### 1. Scene Graph 디버깅

```javascript
// 계층 구조 출력
function printSceneGraph(obj, indent = 0) {
    console.log('  '.repeat(indent) + obj.name || obj.type);
    obj.children.forEach(child => {
        printSceneGraph(child, indent + 1);
    });
}

printSceneGraph(scene);
```

#### 2. Geometry 정보 확인

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);

console.log('정점 수:', geometry.attributes.position.count);
console.log('면 수:', geometry.index ? geometry.index.count / 3 : 0);

// Bounding Box (경계 상자)
geometry.computeBoundingBox();
console.log('경계 상자:', geometry.boundingBox);
```

#### 3. 메모리 관리

```javascript
// Geometry와 Material을 더 이상 사용하지 않을 때
geometry.dispose();
material.dispose();

// Scene에서 제거
scene.remove(mesh);

// 텍스처도 dispose
texture.dispose();
```

### 🎓 학습 체크리스트

Scene Graph:
- [ ] Group을 사용한 계층 구조 생성
- [ ] 부모-자식 관계에서 transform 상속 이해
- [ ] 태양계 같은 복잡한 구조 구현

Geometry:
- [ ] Three.js 기본 Geometry 종류 파악
- [ ] 세그먼트 개념과 성능 영향 이해
- [ ] wireframe, side, flatShading 옵션 사용
- [ ] Geometry 재사용으로 최적화

Vertex:
- [ ] 정점 데이터 구조 이해
- [ ] positionArray로 정점 접근 및 조작
- [ ] needsUpdate로 변경 사항 반영
- [ ] 정점 애니메이션 구현 (파도, 지형 등)

---

## 🎉 마무리

Scene Graph와 Geometry를 마스터하면 복잡한 3D 장면을 효율적으로 만들 수 있습니다!

**핵심 요약:**
1. **Scene Graph**: 객체를 계층 구조로 관리하여 복잡한 구조를 체계적으로 제어
2. **Geometry**: 다양한 기본 도형과 세그먼트 조절로 원하는 형태 생성
3. **Vertex 조작**: 정점을 직접 제어하여 독특한 애니메이션과 효과 구현

이제 Transform + Scene Graph + Geometry를 모두 익혔으니,  
어떤 3D 웹 경험이든 만들 수 있습니다! 🚀

---

**다음 학습 주제**: Controls (카메라 컨트롤), Material (재질과 텍스처)  
**작성일**: 2025년 12월 5일  
**복습일**: 2025년 12월 12일


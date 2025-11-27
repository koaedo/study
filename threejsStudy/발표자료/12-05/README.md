# Three.js Scene Graph & Geometry 발표자료

## 📋 개요
Three.js의 Scene Graph(계층 구조)와 Geometry(도형)에 대한 학습 내용을 정리한 발표자료입니다.

## 📂 파일 구성

### 1. `SceneGraph_Geometry_인터랙티브_슬라이드.html` ⭐
**📊 인터랙티브 발표 슬라이드 (강력 추천!)**
- **실제 Three.js 씬이 작동하는 라이브 데모 포함**
- 버튼을 클릭하여 실시간으로 Scene Graph, Geometry, Vertex 조작
- 총 7개 슬라이드
- 키보드 화살표 또는 버튼으로 네비게이션
- 모바일 스와이프 지원

### 2. `SceneGraph_Geometry_복습자료.md`
**📚 상세 복습 자료**
- Scene Graph와 Geometry의 모든 내용을 자세히 정리
- 코드 예제와 설명 포함
- 실전 팁과 주의사항
- 복습 문제 및 체크리스트
- 개인 학습용으로 최적화

### 3. `README.md`
**📖 이 파일**
- 폴더 구성 설명
- 사용 방법 안내

## 🎯 주요 학습 내용

### 🌳 Scene Graph (계층 구조)

1. **Group을 사용한 계층 구조**
   - 여러 객체를 그룹으로 묶기
   - 부모-자식 관계 생성
   - 하나의 단위처럼 제어

2. **Transform 상속**
   - 부모가 회전하면 자식도 함께 회전
   - 부모가 이동하면 자식도 함께 이동
   - 상대적 위치 관리

3. **실전 활용**
   - 태양계 시뮬레이션
   - 로봇 팔 (관절 구조)
   - 복잡한 캐릭터 모델링

### 🔷 Geometry (도형)

1. **기본 도형 종류**
   - BoxGeometry, SphereGeometry, CylinderGeometry
   - ConeGeometry, TorusGeometry, PlaneGeometry
   - 각 도형의 매개변수와 용도

2. **세그먼트 (Segment)**
   - 면의 분할 정도
   - 많을수록 부드럽지만 무거움
   - 용도에 맞는 세그먼트 선택

3. **렌더링 옵션**
   - wireframe: 선으로만 표시
   - side: 앞면/뒷면/양면 렌더링
   - flatShading: 로우폴리 스타일

### 📐 Vertex (정점) 조작

1. **정점 데이터 구조**
   - Float32Array 배열
   - 3개씩 묶어서 하나의 정점 (x, y, z)
   - positionArray로 접근

2. **정점 애니메이션**
   - 파도 효과
   - 지형 생성
   - 변형 애니메이션
   - 펄럭이는 효과

3. **주의사항**
   - needsUpdate 필수
   - 성능 고려
   - 법선 벡터 재계산

## 🚀 사용 방법

### 인터랙티브 발표 슬라이드 (강력 추천!) ⭐

1. **파일 열기**
   - `SceneGraph_Geometry_인터랙티브_슬라이드.html` 파일을 웹 브라우저로 엽니다

2. **네비게이션**
   - **키보드**: ← → 화살표 키로 슬라이드 이동
   - **마우스**: 좌우 버튼 클릭
   - **모바일**: 화면을 좌우로 스와이프
   - **하단 점**: 특정 슬라이드로 바로 이동

3. **라이브 데모 조작**
   - **Scene Graph 슬라이드**: 각 그룹을 회전시켜 계층 구조 확인
   - **Geometry 슬라이드**: 다양한 도형 전환 및 옵션 변경
   - **세그먼트 슬라이드**: 세그먼트 수 조절하며 차이 확인
   - **Vertex 슬라이드**: 파도, 펄스, 랜덤 효과 실시간 확인

### 복습 자료

1. `SceneGraph_Geometry_복습자료.md` 파일을 Markdown 뷰어 또는 에디터로 엽니다
2. 목차를 통해 원하는 섹션으로 이동
3. 코드 예제를 직접 실습하며 복습
4. 체크리스트로 학습 진도 확인

## 💡 발표 준비 팁

### 발표 시

1. **인터랙티브 데모 활용**
   - Scene Graph: 버튼을 눌러 각 그룹이 독립적으로 회전하는 모습 시연
   - Geometry: 도형을 전환하며 다양한 종류 소개
   - 세그먼트: 4개에서 64개로 늘리며 차이 비교
   - Vertex: 파도 효과를 실시간으로 보여주며 원리 설명

2. **핵심 개념 강조**
   - **Scene Graph**: 부모가 움직이면 자식도 함께 움직인다
   - **Geometry**: 세그먼트 = 성능과 품질의 균형
   - **Vertex**: 정점을 조작하면 무한한 가능성

3. **실전 예시**
   - 태양계: 각자 회전하면서 전체도 회전
   - 로우폴리: 낮은 세그먼트 + flatShading
   - 파도: 정점 조작으로 물 표현

## 📊 슬라이드 구성

| 슬라이드 | 제목 | 데모 | 주요 내용 |
|---------|------|------|----------|
| 1 | 제목 | ❌ | 발표 개요 |
| 2 | Scene Graph 개념 | ❌ | 계층 구조 설명 |
| 3 | Scene Graph 실습 | ✅ | 그룹 회전 (부모-자식 관계) |
| 4 | Geometry 소개 | ✅ | 다양한 도형 전환 |
| 5 | 세그먼트 | ✅ | 세그먼트 수 조절 (4~64) |
| 6 | Vertex 조작 | ✅ | 파도/펄스/랜덤 효과 |
| 7 | 요약 | ❌ | 핵심 정리 |

## 🎨 인터랙티브 데모 상세

### 1. Scene Graph 데모
- **Group1 회전**: 전체가 회전 (box1, group2, group3 모두)
- **Group2 회전**: group2와 그 자식(group3, box2)만 회전
- **Group3 회전**: group3와 box3만 회전
- **자동 회전**: 모든 그룹이 각자 회전하는 모습
- **실시간 각도 표시**: 각 그룹의 현재 회전 각도

### 2. Geometry 데모
- **도형 전환**: Box, Sphere, Cylinder, Cone, Torus, Plane
- **Wireframe 토글**: 선 모드로 구조 확인
- **Flat Shading 토글**: 로우폴리 스타일 전환
- **자동 회전**: 도형이 천천히 회전하며 모든 각도 확인

### 3. 세그먼트 데모
- **세그먼트 선택**: 4, 8, 16, 32, 64
- **Wireframe 모드**: 면 분할 구조 확인
- **실시간 정점 수**: 세그먼트에 따른 정점 개수 표시
- **성능 비교**: 낮은/높은 세그먼트의 차이 체감

### 4. Vertex 애니메이션 데모
- **파도 효과**: 거리에 따라 파도치는 모습
- **펄스 효과**: 전체가 커졌다 작아지는 효과
- **랜덤 효과**: 각 정점이 무작위로 움직임
- **강도 조절**: +/- 버튼으로 효과 강도 조절
- **일시정지/재생**: 애니메이션 제어

## 📅 학습 일정

- **발표일**: 2025년 12월 5일 (목)
- **이전 발표**: 2025년 11월 28일 - Transform
- **복습 권장일**: 2025년 12월 12일 - 1주일 후
- **관련 예제 위치**: 
  - Scene Graph: `threejsStudy/04_transform/dev/src/ex04.js`
  - Geometry: `threejsStudy/05_geometry/dev/src/`

## 🔗 연관 학습 자료

### 이전 발표
- **11-21**: Basic (Scene, Camera, Renderer, Mesh 기본)
  - 위치: `threejsStudy/발표자료/11-21/`
- **11-28**: Transform (Position, Scale, Rotation)
  - 위치: `threejsStudy/발표자료/11-28/`

### 다음 학습 예정
- **Controls**: 카메라 컨트롤 (OrbitControls, TrackballControls 등)
- **Material**: 재질과 텍스처
- **Light**: 조명과 그림자

## 📚 참고 자료

- [Three.js 공식 문서](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Three.js Fundamentals](https://threejsfundamentals.org/)

## 🎓 학습 목표 달성 체크

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
- [ ] 정점 애니메이션 구현

## 💪 실습 과제

### 기초 과제
1. 3단계 계층 구조 만들기 (Group → Group → Mesh)
2. 각 세그먼트 수로 Sphere 만들어 비교
3. 간단한 정점 애니메이션 구현

### 심화 과제
1. 태양계 시뮬레이션 완성 (태양-지구-달-화성)
2. 로우폴리 스타일의 산 만들기
3. 파도치는 바다 만들기 (PlaneGeometry + Vertex 조작)

## 🌟 Transform + Scene Graph + Geometry = 완성!

이제 세 가지 핵심 개념을 모두 마스터했습니다:

1. **Transform** (11/28)
   - Position: 어디에
   - Scale: 얼마나 크게
   - Rotation: 어떻게 회전

2. **Scene Graph** (12/05)
   - 계층 구조로 관리
   - 부모-자식 관계
   - 복잡한 구조 체계화

3. **Geometry** (12/05)
   - 다양한 도형
   - 세그먼트 최적화
   - Vertex 직접 조작

이 세 가지를 결합하면 **어떤 3D 장면이든 만들 수 있습니다!** 🚀

---

**작성자**: 발표 준비 학습자  
**최종 수정일**: 2025년 12월 5일  
**버전**: 2.0 (인터랙티브 버전)

🎮 **보고 만지면서 배우는 Three.js!**


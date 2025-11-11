import * as THREE from 'three';

// ----- 주제: 기본 장면

export default function example() {
    // Renderer

    const canvas = document.querySelector('#three-canvas');
    // const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setClearColor('#00ff00');
    renderer.setClearAlpha(0.5);

    // Scene
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color('dodgerblue');

    // Camera
    // Perspective Camera(원근 카메라)
    const camera = new THREE.PerspectiveCamera(
        75, // 시야각(field of view)
        window.innerWidth / window.innerHeight, // 종횡비(aspect)
        0.1, // near
        1000 // far
    );
    camera.position.x = 1;
    camera.position.y = 2;
    camera.position.z = 5;
    scene.add(camera);

    // Orthographic Camera(직교 카메라)
    // const camera = new THREE.OrthographicCamera(
    // 	-(window.innerWidth / window.innerHeight), // left
    // 	window.innerWidth / window.innerHeight, // right,
    // 	1, // top
    // 	-1, // bottom
    // 	0.1,
    // 	1000
    // );
    // camera.position.x = 1;
    // camera.position.y = 2;
    // camera.position.z = 5;
    // camera.lookAt(0, 0, 0);
    // camera.zoom = 0.5;
    // camera.updateProjectionMatrix();
    // scene.add(camera);

    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
        // color: 0xff0000
        // color: '#ff0000'
        color: 'red'
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 그리기
    renderer.render(scene, camera);

    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // 이벤트
    window.addEventListener('resize', setSize);
}
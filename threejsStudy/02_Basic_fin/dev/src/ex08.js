import * as THREE from 'three';
import gsap from 'gsap';

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
    // renderer.setClearColor('#00ff00');
    // renderer.setClearAlpha(0.5);

    // Scene
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color('dodgerblue');
    scene.fog = new THREE.Fog('black', 1, 7);

    // Camera
    // Perspective Camera(원근 카메라)
    const camera = new THREE.PerspectiveCamera(
        75, // 시야각(field of view)
        window.innerWidth / window.innerHeight, // 종횡비(aspect)
        0.1, // near
        1000 // far
    );
    // camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 5;
    scene.add(camera);

    const light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.x = 1;
    light.position.y = 3;
    light.position.z = 10;
    scene.add(light);


    // Mesh
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        // color: 0xff0000
        // color: '#ff0000'
        color: 'red'
    });
    // const meshe = [];
    // for (let i = 0; i < 10; i++) {
    //     const mesh = new THREE.Mesh(geometry, material);
    //     mesh.position.x = Math.random() * 5 - 2.5;
    //     mesh.position.z = Math.random() * 5 - 2.5;
    //     scene.add(mesh);
    //     meshes.push(mesh);
    // }
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 그리기
    function draw() {
        gsap.to(mesh.position, {
            duration: 1,
            y: 2,
            z: 3
        });
        gsap.to(mesh.rotation, {
            duration: 10,
            y: 2,
            z: 3
        });

        renderer.render(scene, camera);
        
        window.requestAnimationFrame(draw);
    }
    

    function setSize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }

    // 이벤트
    window.addEventListener('resize', setSize);

    draw();

}
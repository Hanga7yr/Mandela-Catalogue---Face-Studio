import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class ViewerHelper {

    scene;
    renderer;
    camera;
    control;
    textureLoader;
    dracoLoader;
    loader;

    objectPath = './BaseMaleHead/base_male_head.glb';

    parentElement;
    constructor(parentElement) {
        this.parentElement = parentElement;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera( 75, parentElement.clientWidth / parentElement.clientHeight, 0.1, 100);

        this.scene.add(this.camera);

        this.renderer.setSize(parentElement.clientWidth, parentElement.clientHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        parentElement.appendChild( this.renderer.domElement );

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;

        this.camera.position.set(0, 0, 0.5);

        this.light2 = new THREE.DirectionalLight(0x999999, 0.8 * Math.PI);
        this.light2.position.set(0.5, 0, 0.866); // ~60º
        this.light2.name = 'main_light';
        this.camera.add(this.light2);

        // Texture
        this.textureLoader = new THREE.TextureLoader();

        // Load the head
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath( 'js/draco/' );

        this.loader = new GLTFLoader();
        this.loader.setDRACOLoader(this.dracoLoader);
        this.loader.load(
            this.objectPath,
            this.ViewerObjectLoadComplete.bind(this),
            this.ViewerObjectLoadProgress.bind(this),
            this.ViewerObjectLoadError.bind(this),
        );
    }

    UpdateViewer() {
        var box = this.parentElement.getBoundingClientRect();
        this.renderer.setSize(box.width, box.height);

        this.camera.aspect = box.width/box.height
        this.camera.updateProjectionMatrix();
    }

    Animate() {
        requestAnimationFrame(this.Animate.bind(this));
        this.controls.update();
        this.renderer.render(this.scene,this.camera);
    }

    ViewerObjectLoadComplete(gltf) {
        const loadedScene = gltf.scene || gltf.scenes[0];


        const box = new THREE.Box3().setFromObject(loadedScene);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        loadedScene.position.x += (loadedScene.position.x - center.x);
        loadedScene.position.y += (loadedScene.position.y - center.y);
        loadedScene.position.z += (loadedScene.position.z - center.z);

        this.scene.add(loadedScene);

        const headModel = loadedScene.children[0].children[0].children[0].children[0];
        const headTexture = this.textureLoader.load('uvmapping2.png');
        headModel.children[0].material.emissiveIntensity = 0.25;
        headModel.children[0].material.map = headTexture;
    }
    ViewerObjectLoadProgress(xhr) {

    }
    ViewerObjectLoadError(error){

    }
}
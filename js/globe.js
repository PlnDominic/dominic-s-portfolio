import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfield from './src/getStarfield.js';
import { drawThreeGeo } from './src/threeGeoJSON.js';

class Globe {
    constructor() {
        this.scene = new THREE.Scene();
        this.container = document.getElementById('globe-container');
        this.canvas = document.getElementById('globe-canvas');
        
        // Define continent colors
        this.continentColors = {
            'North America': 0xFF6B6B,  // Coral Red
            'South America': 0x4ECDC4,  // Turquoise
            'Europe': 0x45B7D1,        // Sky Blue
            'Africa': 0xFFBE0B,        // Golden Yellow
            'Asia': 0x96CEB4,          // Sage Green
            'Oceania': 0xFF9F1C,       // Orange
            'Antarctica': 0xFAFAFA     // White
        };
        
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.createGlobe();
        this.setupControls();
        
        this.init();
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    async init() {
        try {
            await this.loadCountries();
            this.animate();
        } catch (error) {
            console.error('Error initializing globe:', error);
        }
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
        this.camera.position.z = 300;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(100, 100, 100);
        this.scene.add(pointLight);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.minDistance = 200;
        this.controls.maxDistance = 400;
    }

    createGlobe() {
        // Create Earth sphere
        const sphereGeometry = new THREE.SphereGeometry(100, 64, 64);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.8,
        });
        this.globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(this.globe);

        // Add wireframe
        const wireframe = new THREE.WireframeGeometry(sphereGeometry);
        const line = new THREE.LineSegments(wireframe);
        line.material.color.setHex(0x4ECDC4);
        line.material.transparent = true;
        line.material.opacity = 0.1;
        this.globe.add(line);

        // Add starfield
        const stars = getStarfield({ numStars: 5000, fog: false });
        this.scene.add(stars);
        this.stars = stars;
    }

    async loadCountries() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson');
            const data = await response.json();
            
            // Create a group for all countries
            const countriesGroup = new THREE.Group();
            
            data.features.forEach(feature => {
                if (feature.geometry) {
                    const countryMesh = drawThreeGeo({
                        json: feature,
                        radius: 100,
                        shape: 'sphere',
                        materialOptions: {
                            color: this.getColorByCoordinate(
                                feature.properties.LABEL_Y || 0,
                                feature.properties.LABEL_X || 0
                            ),
                            transparent: true,
                            opacity: 0.8,
                            side: THREE.DoubleSide,
                            wireframe: false
                        }
                    });
                    
                    if (countryMesh) {
                        if (Array.isArray(countryMesh)) {
                            countryMesh.forEach(mesh => countriesGroup.add(mesh));
                        } else {
                            countriesGroup.add(countryMesh);
                        }
                    }
                }
            });
            
            this.globe.add(countriesGroup);
            
        } catch (error) {
            console.error('Error loading countries:', error);
        }
    }

    getColorByCoordinate(lat, lon) {
        // Simplified continent determination
        if (lat > 60) return this.continentColors['North America'];
        if (lat < -60) return this.continentColors['Antarctica'];
        
        // Northern Hemisphere
        if (lat > 0) {
            if (lon < -20) return this.continentColors['North America'];
            if (lon < 65) return this.continentColors['Europe'];
            return this.continentColors['Asia'];
        }
        // Southern Hemisphere
        else {
            if (lon < -65) return this.continentColors['South America'];
            if (lon < 50) return this.continentColors['Africa'];
            return this.continentColors['Oceania'];
        }
    }

    onWindowResize() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Rotate the globe
        if (this.globe) {
            this.globe.rotation.y += 0.001;
        }
        
        // Slowly rotate starfield in opposite direction
        if (this.stars) {
            this.stars.rotation.y -= 0.0002;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the globe
new Globe();

import {PerspectiveCamera, Scene, WebGLRenderer, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points, Vector3, Color} from "three";
import createCamera from "./components/camera";
import createScene from "./components/scene";
import createRenderer from "./components/renderer";
import {Cube} from "./core/cube";
import Control, {MouseControl, TouchControl} from "./core/control";
import {Timer} from "./core/timer";

const setSize = (container: Element, camera: PerspectiveCamera, renderer: WebGLRenderer) => {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);

    // set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);
};

class Rubiks {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private cube: Cube | undefined;
    private renderer: WebGLRenderer;
    private _controls: Control[] = [];
    private particles: Points | undefined;
    private particlePositions: Float32Array | undefined;
    private particleVelocities: Vector3[] = [];
    private timer: Timer;
    private timerElement: HTMLElement | null;
    private gameStarted: boolean = false;
    private gameOver: boolean = false;
    public constructor(container: Element) {
        this.camera = createCamera();
        this.scene = createScene("#ffffff");
        this.createParticles();
        this.renderer = createRenderer();
        container.appendChild(this.renderer.domElement);

        // Initialize timer (5 minutes = 300 seconds)
        this.timer = new Timer(300);
        this.timerElement = document.getElementById("timer");

        // auto resize
        window.addEventListener("resize", () => {
            setSize(container, this.camera, this.renderer);
            this.render();
        });
        setSize(container, this.camera, this.renderer);
        this.setOrder(3);

        this.startAnimation();
    }

    public setOrder(order: number) {
        this.scene.remove(...this.scene.children);
        if (this._controls.length > 0) {
            this._controls.forEach((control) => control.dispose());
        }

        const cube = new Cube(order);
        this.scene.add(cube);
        this.cube = cube;
        this.render();

        const winW = this.renderer.domElement.clientWidth;
        const winH = this.renderer.domElement.clientHeight;
        const coarseSize = cube.getCoarseCubeSize(this.camera, {w: winW, h: winH});

        const ratio = Math.max(2.2 / (winW / coarseSize), 2.2 / (winH / coarseSize));
        this.camera.position.z *= ratio;
        this._controls.push(
            new MouseControl(this.camera, this.scene, this.renderer, cube),
            new TouchControl(this.camera, this.scene, this.renderer, cube)
        );

        // Reset game state when changing order
        this.resetGame();
        this.render();
    }

    /**
     * Scramble
     */
    public disorder() {
        if (this.cube) {

        }
    }

    /**
     * Restore
     */
    public restore() {
        if (this.cube) {
            this.cube.restore();
            this.resetGame();
            this.render();
        } else {
            console.error("RESTORE_ERROR: this.cube is undefined.");
        }
    }

    private resetGame() {
        this.timer.reset();
        this.gameStarted = false;
        this.gameOver = false;
        this.updateTimerDisplay();
        this.updateStartButton();
        if (this.timerElement) {
            this.timerElement.classList.remove('warning', 'danger');
        }
    }

    public startGame() {
        if (!this.gameStarted && !this.gameOver) {
            this.gameStarted = true;
            this.timer.start(
                (remainingTime) => this.updateTimerDisplay(),
                () => this.handleGameOver(false)
            );
            this.updateStartButton();
        }
    }

    private updateStartButton() {
        const startButton = document.getElementById("start") as HTMLButtonElement;
        if (startButton) {
            startButton.disabled = this.gameStarted || this.gameOver;
            startButton.textContent = this.gameStarted ? "Running..." : "Start";
        }
    }

    private updateTimerDisplay() {
        if (this.timerElement) {
            this.timerElement.textContent = this.timer.getFormattedTime();
            
            // Add warning/danger classes based on remaining time
            const remainingTime = this.timer.getRemainingTime();
            this.timerElement.classList.remove('warning', 'danger');
            
            if (remainingTime <= 30) {
                this.timerElement.classList.add('danger');
            } else if (remainingTime <= 60) {
                this.timerElement.classList.add('warning');
            }
        }
    }

    private handleGameOver(won: boolean) {
        this.gameOver = true;
        this.timer.stop();
        this.updateStartButton();
        
        const finishElement = document.getElementById("finish");
        if (finishElement) {
            if (won) {
                finishElement.textContent = "🎉 You Win!";
                finishElement.style.color = "#28a745";
            } else {
                finishElement.textContent = "😢 Time's Up!";
                finishElement.style.color = "#dc3545";
            }
        }
    }

    private checkWinCondition() {
        if (this.cube && this.gameStarted && !this.gameOver) {
            if (this.cube.finish) {
                this.handleGameOver(true);
            }
        }
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
    }

    private createParticles() {
        const particleCount = 200;
        const geometry = new BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        this.particlePositions = positions;
        
        for (let i = 0; i < particleCount; i++) {
            // Random positions in a large sphere around the cube
            const radius = 15 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Random velocities for floating animation
            this.particleVelocities.push(new Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ));
            
            // Random colors (subtle blues and purples)
            const color = new Color();
            color.setHSL(0.6 + Math.random() * 0.2, 0.7, 0.6);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
        
        const material = new PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        
        this.particles = new Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    private animateParticles(time: number) {
        if (!this.particles || !this.particlePositions) return;
        
        const positions = this.particles.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < this.particleVelocities.length; i++) {
            // Update positions based on velocity
            positions[i * 3] += this.particleVelocities[i].x;
            positions[i * 3 + 1] += this.particleVelocities[i].y;
            positions[i * 3 + 2] += this.particleVelocities[i].z;
            
            // Add subtle wave motion
            positions[i * 3 + 1] += Math.sin(time * 0.001 + i * 0.1) * 0.005;
            
            // Boundary check - wrap around if too far
            const dist = Math.sqrt(
                positions[i * 3] ** 2 + 
                positions[i * 3 + 1] ** 2 + 
                positions[i * 3 + 2] ** 2
            );
            
            if (dist > 40) {
                // Reset particle to closer position
                const scale = 15 / dist;
                positions[i * 3] *= scale;
                positions[i * 3 + 1] *= scale;
                positions[i * 3 + 2] *= scale;
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Slowly rotate the entire particle system
        this.particles.rotation.y = time * 0.0001;
        this.particles.rotation.x = Math.sin(time * 0.0002) * 0.1;
    }

    private startAnimation() {
        const animation = (time: number) => {
            time /= 1000; // convert to seconds
            if (this.cube) {
                if (time < 2) {
                    this.cube.position.z = (-1 + time / 2) * 100;
                } else {
                    this.cube.position.z = 0;
                }
                const dis = time;
                this.cube.position.y = Math.sin(dis) * 0.3;
                
                // Check win condition periodically
                if (time > 2 && time % 0.5 < 0.02) {
                    this.checkWinCondition();
                }
            }
            
            // Animate particles
            this.animateParticles(time);

            this.render();
            requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }
}

export default Rubiks;

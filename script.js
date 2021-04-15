import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { FontLoader } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matCapTexture = textureLoader.load('/textures/matcaps/3.png')
const matCapMaterial = new THREE.MeshMatcapMaterial( {matcap: matCapTexture})
console.log(matCapMaterial)
/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new THREE.TextGeometry(
            'TONZARI',
            {
                font: font,
                size: 0.5,
                height: 0.01,
                curveSegments: 2,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 2
            }
        )
        textGeometry.center()
        const text = new THREE.Mesh(textGeometry, matCapMaterial)
        scene.add(text)
    }
)


/**
 * Object
 */

const donutGeometry = new THREE.TorusGeometry(1,.5,10,10)
const donutArray = []

for (let index = 0; index <300; index++) {
    const donut = new THREE.Mesh(donutGeometry, matCapMaterial)

    donut.position.x = (Math.random() - 0.5) * 100
    donut.position.y = (Math.random() - 0.5) * 100
    donut.position.z = (Math.random() - 0.5) * 100

    donut.rotation.x = (Math.random() * Math.PI)
    donut.rotation.y = (Math.random() * Math.PI)
    
    donutArray.push(donut)
    scene.add(donut)
}


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const rotationSpeed = elapsedTime * 0.5

    donutArray.forEach(donut => {
        donut.rotation.z = elapsedTime
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
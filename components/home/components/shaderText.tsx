"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {};

function ShaderText({}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  let easeFactor = 0.02;
  let scene: THREE.Scene,
    camera: THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer,
    planeMesh: THREE.Mesh;
  let mousePosition = { x: 0.5, y: 0.5 };
  let targetMousePosition = { x: 0.5, y: 0.5 };
  let prevPosition = { x: 0.5, y: 0.5 };

  const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;

    void main() {
        vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
        vec2 centerOfPixel = gridUV + vec2(1.0 / 40.0, 1.0 / 40.0);

        vec2 mouseDirection = u_mouse - u_prevMouse;
        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;

        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

        vec2 uvOffset = strength * -mouseDirection * 0.3;
        vec2 uv = vUv - uvOffset;

        vec4 color = texture2D(u_texture, uv);
        if (color.a == 0.0) {
            color = vec4(1.0, 1.0, 1.0, 1.0); // fallback white color if no texture is found
        }
        gl_FragColor = color;
    }
  `;

  const createTextTexture = (
    text: string,
    font: string,
    size: number | null,
    color: string,
    fontWeight = "100"
  ) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const canvasWidth = window.innerWidth * 2;
    const canvasHeight = window.innerHeight * 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (!ctx) return null;

    // Fill background for debugging
    ctx.fillStyle = "#ffffff"; // Background color for the canvas
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const fontSize = size || Math.floor(canvasWidth * 0.2); // Font size relative to canvas width
    ctx.fillStyle = color || "#000000"; // Text color
    ctx.font = `${fontWeight} ${fontSize}px "${font || "Arial"}"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw text in the center of the canvas
    ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

    return new THREE.CanvasTexture(canvas);
  };

  const initializeScene = (texture: THREE.CanvasTexture) => {
    scene = new THREE.Scene();

    // Correct orthographic camera setup
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(
      -1,
      1,
      1 / aspectRatio,
      -1 / aspectRatio,
      0.1,
      1000
    );
    camera.position.z = 1;

    // Shader uniforms
    const shaderUniform = {
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_prevMouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_texture: { value: texture },
    };

    // Plane geometry with shader material
    planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: shaderUniform,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      })
    );

    scene.add(planeMesh);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1); // Set background color to white
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Append renderer to DOM
    if (ref.current) {
      ref.current.appendChild(renderer.domElement);
    }
  };

  const reloadTexture = () => {
    const newTexture = createTextTexture(
      "Mousetri",
      "Arial",
      null,
      "#000000",
      "100"
    );
    (planeMesh.material as THREE.ShaderMaterial).uniforms.u_texture.value = newTexture;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create the initial text texture
      const texture = createTextTexture("Mousetri", "Arial", null, "#000000", "100");

      if (texture) {
        initializeScene(texture);

        const animateScene = () => {
          requestAnimationFrame(animateScene);

          // Smooth mouse movement
          mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
          mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

          (planeMesh.material as THREE.ShaderMaterial).uniforms.u_mouse.value.set(
            mousePosition.x,
            1.0 - mousePosition.y
          );
          (planeMesh.material as THREE.ShaderMaterial).uniforms.u_prevMouse.value.set(
            prevPosition.x,
            1.0 - prevPosition.y
          );

          renderer.render(scene, camera);
        };

        animateScene();

        return () => {
          // Cleanup renderer and scene
          renderer.dispose();
          scene.remove(planeMesh);
          ref.current?.removeChild(renderer.domElement);
        };
      }
    }

    const handleResize = () => {
      const aspectRatio = window.innerWidth / window.innerHeight;

      camera.left = -1;
      camera.right = 1;
      camera.top = 1 / aspectRatio;
      camera.bottom = -1 / aspectRatio;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      reloadTexture();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      easeFactor = 0.04;
      if (!ref.current) return;
      let rect = ref.current.getBoundingClientRect();
      prevPosition = { ...targetMousePosition };

      targetMousePosition.x = (event.clientX - rect.left) / rect.width;
      targetMousePosition.y = (event.clientY - rect.top) / rect.height;
    };

    const handleMouseEnter = (event: MouseEvent) => {
      easeFactor = 0.02;
      if (!ref.current) return;
      let rect = ref.current.getBoundingClientRect();

      mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width;
      mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height;
    };

    const handleMouseLeave = (event: MouseEvent) => {
      easeFactor = 0.04;
      targetMousePosition = { ...prevPosition };
    };

    if (ref.current) {
      ref.current.addEventListener("mouseenter", handleMouseEnter);
      ref.current.addEventListener("mousemove", handleMouseMove);
      ref.current.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener("mouseenter", handleMouseEnter);
        ref.current.removeEventListener("mousemove", handleMouseMove);
        ref.current.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={ref} className="absolute w-full h-full overflow-hidden">
      {/* This is the container for the WebGL canvas */}
    </div>
  );
}

export default ShaderText;

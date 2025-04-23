import { GLView } from 'expo-gl';
import { useRef, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Import THREE carefully to prevent browser dependencies
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Color
} from 'three';

export default function FRScreen() {
  const [isReady, setIsReady] = useState(false);
  const sceneRef = useRef(new Scene());
  const cameraRef = useRef(new PerspectiveCamera(75, 1, 0.1, 1000));
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize basic scene
  useEffect(() => {
    // Create test cube
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: new Color(0x00ff00) });
    const cube = new Mesh(geometry, material);
    sceneRef.current.add(cube);
    cameraRef.current.position.z = 3;

    return () => {
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const handleContextCreate = async (gl) => {
    try {
      // Initialize renderer with Expo GL context
      rendererRef.current = new WebGLRenderer({
        antialias: true,
        context: gl,
        powerPreference: 'high-performance'
      });
      rendererRef.current.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        if (rendererRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
          gl.endFrameEXP();
        }
      };

      animate();
      setIsReady(true);
    } catch (error) {
      console.error('Three.js initialization failed:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!isReady && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          size="large"
        />
      )}
      <GLView
        style={{ flex: 1 }}
        onContextCreate={handleContextCreate}
      />
    </View>
  );
}
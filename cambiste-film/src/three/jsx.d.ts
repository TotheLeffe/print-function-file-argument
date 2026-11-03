/* React Three Fiber v9 n'augmente plus JSX globalement : on le declare ici,
   une fois, pour que <mesh> et consorts soient types dans tout le projet. */
import type {ThreeElements} from '@react-three/fiber';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

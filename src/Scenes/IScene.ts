import SceneManager from "./SceneManager";
import { Container } from "pixi.js";

export default interface IScene extends Container {
  update(elapsedMS: number): void;
  onKeyDown(ev: KeyboardEvent): void;
  onKeyUp(ev: KeyboardEvent): void;
  onInit(): void;
  onEnter(params: any): void;
  onLeave(): void;
}

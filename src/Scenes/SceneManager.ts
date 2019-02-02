import { IScene } from "./";

export default class SceneManager {
  public currentScene: IScene;

  private scenes: { [name: string]: IScene } = {};

  initScenes() {
    Object.keys(this.scenes).forEach(key => {
      this.scenes[key].onInit();
    });
  }

  addScene(name: string, scene: IScene) {
    if (!this.scenes[name]) {
      this.scenes[name] = scene;
    } else {
      throw new Error(`Scene '${name}' already exists`);
    }
  }

  changeScene(sceneName: string, params: any = null) {
    if (this.scenes[sceneName]) {
      if (this.currentScene) {
        this.currentScene.onLeave();
      }
      this.currentScene = this.scenes[sceneName];
      this.currentScene.onEnter(params);
    } else {
      throw new Error(`No such scene: ${sceneName}`);
    }
  }
}

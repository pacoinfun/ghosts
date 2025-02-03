export interface GameObject {
  id: string;
  type: 'ghost' | 'bomb' | 'net';
  x: number;
  y: number;
  speed: number;
  size: number;
  isClicked: boolean;
  isFrozen: boolean;
}

export class GameLogic {
  private items: GameObject[] = [];
  private readonly gameWidth: number;
  private readonly gameHeight: number;
  private spawnRate: number = 600;
  private readonly spawnChances = {
    ghost: 0.75,
    bomb: 0.15,
    net: 0.1
  };
  private lastSpawnTime: number = 0;
  private multiSpawnCount: number = 1;

  constructor(gameWidth: number, gameHeight: number) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.lastSpawnTime = performance.now();
  }

  spawnItem() {
    const currentTime = performance.now();
    if (currentTime - this.lastSpawnTime < this.spawnRate) {
      return null;
    }
    this.lastSpawnTime = currentTime;

    for (let i = 0; i < this.multiSpawnCount; i++) {
      const random = Math.random();
      let type: 'ghost' | 'bomb' | 'net';
      
      if (random < this.spawnChances.ghost) {
        type = 'ghost';
      } else if (random < this.spawnChances.ghost + this.spawnChances.bomb) {
        type = 'bomb';
      } else {
        type = 'net';
      }

      const size = type === 'ghost' ? 40 : 35;
      const section = Math.floor(Math.random() * 5);
      const sectionWidth = this.gameWidth / 5;
      const x = (section * sectionWidth) + (Math.random() * (sectionWidth - size));
      
      const baseSpeed = type === 'ghost' ? 3 : 2.5;
      const randomSpeed = Math.random() * 1.5;
      
      const item: GameObject = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        x,
        y: -size,
        speed: baseSpeed + randomSpeed,
        size,
        isClicked: false,
        isFrozen: false
      };

      if (this.items.length < 25) {
        this.items.push(item);
      }
    }

    return this.items[this.items.length - 1];
  }

  updatePositions(deltaTime: number) {
    const secondsElapsed = deltaTime / 1000;
    
    this.items = this.items.filter(item => {
      if (!item.isClicked && !item.isFrozen) {
        item.y += item.speed * 60 * secondsElapsed;
      }
      return item.y < this.gameHeight && !item.isClicked;
    });
  }

  handleClick(clickX: number, clickY: number): GameObject | null {
    for (const item of this.items) {
      if (item.isClicked) continue;
      
      const dx = item.x + item.size/2 - clickX;
      const dy = item.y + item.size/2 - clickY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < item.size/2) {
        item.isClicked = true;
        return item;
      }
    }
    return null;
  }

  freezeAllItems() {
    this.items.forEach(item => {
      item.isFrozen = true;
    });
  }

  unfreezeAllItems() {
    this.items.forEach(item => {
      item.isFrozen = false;
    });
  }

  increaseSpeed() {
    this.spawnRate = Math.max(300, this.spawnRate - 40);
    
    if (this.multiSpawnCount < 3) {
      this.multiSpawnCount++;
    }
    
    this.items.forEach(item => {
      item.speed *= 1.05;
    });
    
    this.spawnChances.ghost = Math.min(0.85, this.spawnChances.ghost + 0.03);
    this.spawnChances.bomb = (1 - this.spawnChances.ghost) * 0.6;
    this.spawnChances.net = (1 - this.spawnChances.ghost) * 0.4;
  }

  getSpawnRate() {
    return this.spawnRate;
  }

  getItems() {
    return this.items;
  }

  clear() {
    this.items = [];
    this.spawnRate = 600;
    this.lastSpawnTime = performance.now();
    this.multiSpawnCount = 1;
    this.spawnChances.ghost = 0.75;
    this.spawnChances.bomb = 0.15;
    this.spawnChances.net = 0.1;
  }
} 
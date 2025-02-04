export type GameObjectType = 'ghost' | 'bomb' | 'net';

export interface GameObject {
  id: string;
  type: GameObjectType;
  x: number;
  y: number;
  speed: number;
  size: number;
  isClicked: boolean;
  isFrozen: boolean;
}

interface SpawnChances {
  ghost: number;
  bomb: number;
  net: number;
}

export class GameLogic {
  private items: GameObject[] = [];
  private readonly gameWidth: number;
  private readonly gameHeight: number;
  private spawnRate: number = 600;
  private readonly spawnChances: SpawnChances = {
    ghost: 0.75,
    bomb: 0.15,
    net: 0.1
  };
  private lastSpawnTime: number = 0;
  private multiSpawnCount: number = 1;
  private readonly MAX_ITEMS = 25;
  private readonly BASE_SPEEDS = {
    ghost: 3,
    bomb: 2.5,
    net: 2.5
  } as const;

  constructor(gameWidth: number, gameHeight: number) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.lastSpawnTime = performance.now();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }

  private getRandomPosition(size: number): number {
    const section = Math.floor(Math.random() * 5);
    const sectionWidth = this.gameWidth / 5;
    return (section * sectionWidth) + (Math.random() * (sectionWidth - size));
  }

  private calculateItemSize(type: GameObjectType): number {
    return type === 'ghost' ? 40 : 35;
  }

  private calculateSpeed(type: GameObjectType): number {
    const baseSpeed = this.BASE_SPEEDS[type];
    const randomSpeed = Math.random() * 1.5;
    return baseSpeed + randomSpeed;
  }

  private determineType(): GameObjectType {
    const random = Math.random();
    if (random < this.spawnChances.ghost) return 'ghost';
    if (random < this.spawnChances.ghost + this.spawnChances.bomb) return 'bomb';
    return 'net';
  }

  spawnItem(): GameObject | null {
    const currentTime = performance.now();
    if (currentTime - this.lastSpawnTime < this.spawnRate) {
      return null;
    }
    this.lastSpawnTime = currentTime;

    if (this.items.length >= this.MAX_ITEMS) {
      return null;
    }

    for (let i = 0; i < this.multiSpawnCount; i++) {
      const type = this.determineType();
      const size = this.calculateItemSize(type);
      
      const item: GameObject = {
        id: this.generateId(),
        type,
        x: this.getRandomPosition(size),
        y: -size,
        speed: this.calculateSpeed(type),
        size,
        isClicked: false,
        isFrozen: false
      };

      this.items.push(item);
    }

    return this.items[this.items.length - 1];
  }

  updatePositions(deltaTime: number): void {
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

  freezeAllItems(): void {
    this.items.forEach(item => {
      item.isFrozen = true;
    });
  }

  unfreezeAllItems(): void {
    this.items.forEach(item => {
      item.isFrozen = false;
    });
  }

  increaseSpeed(): void {
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

  getSpawnRate(): number {
    return this.spawnRate;
  }

  getItems(): GameObject[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
    this.spawnRate = 600;
    this.lastSpawnTime = performance.now();
    this.multiSpawnCount = 1;
    this.spawnChances.ghost = 0.75;
    this.spawnChances.bomb = 0.15;
    this.spawnChances.net = 0.1;
  }
} 
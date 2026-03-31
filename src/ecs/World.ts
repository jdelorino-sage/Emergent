import type { EntityId, ComponentType } from "./types";

export type SystemFn = (world: World, dt: number) => void;

export class World {
  private nextId: EntityId = 1;
  private entities = new Set<EntityId>();
  private stores = new Map<ComponentType, Map<EntityId, unknown>>();
  private systems: SystemFn[] = [];

  createEntity(): EntityId {
    const id = this.nextId++;
    this.entities.add(id);
    return id;
  }

  destroyEntity(id: EntityId): void {
    this.entities.delete(id);
    for (const store of this.stores.values()) {
      store.delete(id);
    }
  }

  addComponent<T>(entity: EntityId, type: ComponentType, data: T): void {
    let store = this.stores.get(type);
    if (!store) {
      store = new Map();
      this.stores.set(type, store);
    }
    store.set(entity, data);
  }

  getComponent<T>(entity: EntityId, type: ComponentType): T | undefined {
    return this.stores.get(type)?.get(entity) as T | undefined;
  }

  removeComponent(entity: EntityId, type: ComponentType): void {
    this.stores.get(type)?.delete(entity);
  }

  /** Get all entities that have the given component */
  query(type: ComponentType): EntityId[] {
    const store = this.stores.get(type);
    if (!store) return [];
    return Array.from(store.keys());
  }

  /** Get all entities that have ALL of the given components */
  queryAll(...types: ComponentType[]): EntityId[] {
    if (types.length === 0) return [];
    const first = this.query(types[0]!);
    return first.filter((id) =>
      types.every((t) => this.stores.get(t)?.has(id)),
    );
  }

  registerSystem(system: SystemFn): void {
    this.systems.push(system);
  }

  update(dt: number): void {
    for (const system of this.systems) {
      system(this, dt);
    }
  }
}

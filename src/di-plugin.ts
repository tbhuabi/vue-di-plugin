import { App, inject, InjectionKey, provide } from 'vue'
import { Injector, NullInjector, Provider, ReflectiveInjector, Scope } from '@tanbo/di'

const DIInjectKey = Symbol('DIInjectKey') as InjectionKey<Injector>
let replacedContextInjector: ReflectiveInjector = null;

function createReplacedInjector(providers: Provider[] = []) {
  replacedContextInjector.parentInjector = new ReflectiveInjector(new NullInjector(), providers);
  provide(DIInjectKey, replacedContextInjector)
  const injector = replacedContextInjector;
  replacedContextInjector = null;
  return injector;
}

export function reflectiveInjectorPlugin(app: App, providers: Provider[] | Injector, scope: Scope = null) {
  app.provide(DIInjectKey, Array.isArray(providers) ? new ReflectiveInjector(new NullInjector(), providers, scope) : providers)
}

export function useRootReflectiveInjector(providers: Provider[] = [], scope: Scope = null) {
  if (replacedContextInjector) {
    return createReplacedInjector(providers)
  }
  const contextInjector = new ReflectiveInjector(new NullInjector(), providers, scope);
  provide(DIInjectKey, contextInjector)
  return contextInjector
}

export function useReflectiveInjector(providers: Provider[] = [], scope: Scope = null) {
  if (replacedContextInjector) {
    return createReplacedInjector(providers)
  }
  const parentInjector = inject(DIInjectKey)
  const contextInjector = new ReflectiveInjector(parentInjector! || new NullInjector(), providers, scope);
  provide(DIInjectKey, contextInjector)
  return contextInjector
}

export class TestBed {
  static useReflectiveInjector(providers: Provider[]) {
    replacedContextInjector = new ReflectiveInjector(null, providers)
    return replacedContextInjector;
  }
}

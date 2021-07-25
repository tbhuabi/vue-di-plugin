import { App, inject, InjectionKey, provide } from 'vue'
import { Injector, NullInjector, Provider, ReflectiveInjector } from '@tanbo/di'

const DIInjectKey = Symbol('DIInjectKey') as InjectionKey<Injector>
let replacedContextInjector: ReflectiveInjector = null;

function createReplacedInjector(providers: Provider[] = []) {
  replacedContextInjector.parentInjector = new ReflectiveInjector(new NullInjector(), providers);
  provide(DIInjectKey, replacedContextInjector)
  const injector = replacedContextInjector;
  replacedContextInjector = null;
  return injector;
}

export function reflectiveInjectorPlugin(app: App, providers: Provider[] | Injector) {
  app.provide(DIInjectKey, Array.isArray(providers) ? new ReflectiveInjector(new NullInjector(), providers) : providers)
}

export function useReflectiveInjector(providers: Provider[] = []) {
  if (replacedContextInjector) {
    return createReplacedInjector(providers)
  }
  const parentInjector = inject(DIInjectKey)
  const contextInjector = new ReflectiveInjector(parentInjector! || new NullInjector(), providers);
  provide(DIInjectKey, contextInjector)
  return contextInjector
}

export class TestBed {
  static useReflectiveInjector(providers: Provider[]) {
    replacedContextInjector = new ReflectiveInjector(null, providers)
    return replacedContextInjector;
  }
}

import { App, inject, InjectionKey, provide } from 'vue'
import { Injector, NullInjector, Provider, ReflectiveInjector } from '@tanbo/di'

const DIInjectKey = Symbol('DIInjectKey') as InjectionKey<Injector>

export function reflectiveInjectorPlugin(app: App, providers: Provider[]) {
  app.provide(DIInjectKey, new ReflectiveInjector(new NullInjector(), providers))
}

export function useReflectiveInjector(providers: Provider[] = []) {
  const parentInjector = inject(DIInjectKey)
  const contextInjector = new ReflectiveInjector(parentInjector! || new NullInjector(), providers);
  provide(DIInjectKey, contextInjector)
  return contextInjector
}

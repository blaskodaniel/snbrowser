import { Injector } from '@furystack/inject/dist/Injector'

import React from 'react'
import '../utils/injector-extension'

export const snInjector = new Injector()
snInjector.options.owner = 'SnApp'

export const InjectorContext = React.createContext(snInjector)

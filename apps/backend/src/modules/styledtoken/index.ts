import { Module } from '@medusajs/framework/utils'

import StyledTokenModuleService from './service'

export const STYLEDTOKEN_MODULE = 'styledtoken'

export default Module(STYLEDTOKEN_MODULE, {
  service: StyledTokenModuleService
})
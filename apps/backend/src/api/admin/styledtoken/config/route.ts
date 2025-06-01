import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from '@medusajs/framework/http'
import { STYLEDTOKEN_MODULE } from '../../../../modules/styledtoken'
import StyledTokenModuleService from '../../../../modules/styledtoken/service'

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const styledTokenService: StyledTokenModuleService = req.scope.resolve(STYLEDTOKEN_MODULE)
  
  try {
    const configs = await styledTokenService.getTokenConfigs()
    res.json({ configs })
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch token configurations',
      error: error.message 
    })
  }
}

export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const styledTokenService: StyledTokenModuleService = req.scope.resolve(STYLEDTOKEN_MODULE)
  
  try {
    const { config_type, ...configData } = req.body as { config_type: string; [key: string]: any }
    
    const config = await styledTokenService.updateTokenConfig(config_type, configData)
    
    res.json({ config })
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update token configuration',
      error: error.message 
    })
  }
}
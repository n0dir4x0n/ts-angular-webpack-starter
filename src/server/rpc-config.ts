import { registerMethodDefinitionMap } from './rpc'

import { accessTokenApi } from './access-tokens/access-token-api'
import { sessionApi } from './sessions/session-api'
import { userApi } from './users/user-api'

registerMethodDefinitionMap(accessTokenApi)
registerMethodDefinitionMap(sessionApi)
registerMethodDefinitionMap(userApi)

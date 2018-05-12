import * as express from 'express'
import { rpcInfoHandler, rpcProcessHandler } from './rpc'
import './rpc-config'

export const app = express()

app.use(express.static('public'))

app.get('/rpc', rpcInfoHandler)
app.post('/rpc', rpcProcessHandler)

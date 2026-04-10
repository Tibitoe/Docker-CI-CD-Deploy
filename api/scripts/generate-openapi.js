import { swaggerSpec } from '../swagger.js'
import { writeFileSync } from 'fs'

const output = 'openapi.json'
writeFileSync(output, JSON.stringify(swaggerSpec, null, 2))
console.log(`[INFO] ${output} generated successfully`)

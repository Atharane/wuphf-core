import express from "express"
const router = express.Router()
import { exec } from "child_process"

exec("ls", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`)
    return
  }
  console.log(`stdout: ${stdout}`)
  console.error(`stderr: ${stderr}`)
})

export default router

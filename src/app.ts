import express from "express"
import { Request, Response } from "express"
import cors from "cors"
import pdf from "html-pdf"
import { exec } from "child_process"
import htmlRenderer from "./documents/index.js"

const app = express()
const port = 8080

// app.use(
//   express.json({
//     // Save raw body buffer before JSON parsing
//     verify: (req: Request) => {
//       req.rawBody = buf
//     },
//   })
// )

app.use(cors())
app.use(express.json({ limit: "50mb" }))

// Receive HTTP POST requests
app.post("/api", (req: Request, res: Response) => {
  const payload = req.body
  console.log(`app.post ~ payload:`, JSON.stringify(payload, null, 2))
  // const { action, data, type, createdAt } = payload

  const view = htmlRenderer(
    "NEW LINEAR TICKET ASSIGNED",
    JSON.stringify(payload)
  )
  pdf.create(view, {}).toFile("result.pdf", (err: Error, res) => {
    if (err) return console.log(err)
    console.log(res)

    exec(`lpr ${res.filename}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      console.error(`stderr: ${stderr}`)
    })
  })

  // Verify signature
  

  // Do something neat with the data received!

  // Finally, respond with a HTTP 200 to signal all good
  console.log("Received webhook payload", JSON.stringify(payload, null, 2))
  res.sendStatus(200)
})

app.listen(port, () =>
  console.log(`My webhook consumer listening on port ${port}!`)
)

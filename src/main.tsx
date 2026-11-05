import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MotionConfig } from "motion/react"
import { SkulletProvider } from "skullet/react"

import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <SkulletProvider reveal="smart">
        <App />
      </SkulletProvider>
    </MotionConfig>
  </StrictMode>
)

import React from 'react'
import { Leaf } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t bg-accent/5 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          
          <p className="text-sm text-muted-foreground max-w-2xl">
            Calculations based on research from{" "}
            <a 
              href="https://anuragsridharan.substack.com/p/we-can-use-tokens-to-track-ais-carbon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Anurag Sridharan's analysis
            </a>
            {" "}of AI carbon emissions (~0.09g CO₂ per token).
          </p>
          
          <p className="text-xs text-muted-foreground">
            Built with awareness for a sustainable future
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

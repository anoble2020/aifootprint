import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { ExternalLink, TreePine } from 'lucide-react'

const charities = [
  {
    name: 'One Tree Planted',
    description: 'Global reforestation nonprofit planting trees in countries around the world',
    url: 'https://onetreeplanted.org/',
    impact: '$1 = 1 tree planted',
  },
  {
    name: 'Trees for the Future',
    description: 'Ending hunger and poverty by training farmers to regenerate their land',
    url: 'https://trees.org/',
    impact: 'Planting over 250 million trees since 1989',
  },
  {
    name: 'Eden Reforestation Projects',
    description: 'Employing local communities to restore forests on a massive scale',
    url: 'https://www.edenprojects.org/',
    impact: '900+ million trees planted',
  },
]

const CallToAction = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
            <TreePine className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Take Action Today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Offset your AI's carbon footprint by supporting verified tree-planting organizations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {charities.map((charity) => (
            <Card key={charity.name} className="border-none shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-all duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{charity.name}</CardTitle>
                <CardDescription className="text-sm">
                  {charity.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-sm font-semibold text-primary mb-4">
                  {charity.impact}
                </p>
                <Button 
                  asChild 
                  className="w-full transition-all hover:scale-[1.02]"
                >
                  <a 
                    href={charity.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Visit {charity.name}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]">
          <CardContent className="pt-8 pb-8 text-center">
            <h3 className="text-2xl font-bold mb-3">Every Action Counts</h3>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-6">
              While AI powers incredible innovation, we must remain conscious of its environmental cost. 
              By tracking our usage and taking action, we can ensure technology and nature thrive together.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                <span>Plant Trees</span>
              </div>
              <div className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                <span>Reduce Usage</span>
              </div>
              <div className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                <span>Spread Awareness</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default CallToAction

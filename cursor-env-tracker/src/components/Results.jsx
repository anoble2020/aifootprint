import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Cloud, TreePine, Leaf } from 'lucide-react'

const Results = ({ tokens }) => {
  const co2Grams = tokens * 0.09
  const co2Kg = co2Grams / 1000
  const treesPerYear = co2Kg / 21.77
  const treesPerMonth = treesPerYear / 12
  const treesPerDay = treesPerYear / 365

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Your Environmental Impact</h2>
          <p className="text-lg text-muted-foreground">
            Based on {tokens.toLocaleString()} tokens consumed
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="border-none transition-all duration-300" style={{ boxShadow: 'var(--shadow-soft)' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <Cloud className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-lg">CO₂ Emissions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{co2Kg.toFixed(2)} kg</p>
                <p className="text-sm text-muted-foreground">{co2Grams.toFixed(0)} grams</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none transition-all duration-300" style={{ boxShadow: 'var(--shadow-soft)' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TreePine className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Trees Needed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{treesPerYear.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">for one year of offset</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none transition-all duration-300" style={{ boxShadow: 'var(--shadow-soft)' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
                  <Leaf className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-lg">Daily Impact</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold">{treesPerDay.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground">trees per day</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-accent/5" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <TreePine className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">What This Means</h3>
                <p className="text-muted-foreground mb-4">
                  Your AI usage generated {co2Kg.toFixed(2)} kg of CO₂. To offset this impact for one year, 
                  you would need approximately {treesPerYear.toFixed(2)} tree{treesPerYear > 1 ? 's' : ''} 
                  actively absorbing carbon. That's roughly {treesPerMonth.toFixed(2)} tree{treesPerMonth > 1 ? 's' : ''} per month 
                  or {treesPerDay.toFixed(3)} tree{treesPerDay > 1 ? 's' : ''} per day.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Calculation based on research showing ~0.09g CO₂ per token for GPT-4 class models, 
                  and trees absorbing ~21.77kg CO₂ annually.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Results

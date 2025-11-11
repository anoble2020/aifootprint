import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { HelpCircle } from 'lucide-react';

const FAQModal = ({ currentView = 'calculator' }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className={`h-8 w-8 ${
          currentView === 'calculator' 
            ? 'text-white hover:text-white dark:text-white dark:hover:text-white' 
            : 'text-foreground hover:text-foreground'
        }`}>
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">FAQ</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white" style={{ zIndex: 10001 }}>
        <DialogHeader>
          <DialogTitle>About AI Footprint Tracker</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2">What is this tool?</h3>
            <p className="text-gray-600">
              AI Footprint Tracker helps you understand the environmental impact of your AI usage, 
              specifically with Cursor. By analyzing your token consumption, we calculate the CO₂ 
              emissions and visualize how many trees would be needed to offset your carbon footprint.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">How do we calculate emissions?</h3>
            <p className="text-gray-600 mb-2">
              Our calculations are based on research from Anurag Sridharan and other researchers, who have 
              quantified emissions from machine learning operations. We use a token-based approach 
              that considers:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Model complexity and computational requirements</li>
              <li>Hardware efficiency (GPU/CPU usage)</li>
              <li>Data center power usage effectiveness (PUE)</li>
              <li>Regional energy grid carbon intensity</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Our assumptions</h3>
            <p className="text-gray-600 mb-2">
              Based on current research, we estimate that each token consumes approximately 
              1.5-9.5 grams of CO₂, depending on the model and infrastructure. For Cursor usage, 
              we use conservative estimates that account for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>Average model complexity for code generation</li>
              <li>Typical data center efficiency (PUE ~1.8)</li>
              <li>Global average carbon intensity of electricity grids</li>
              <li>Inference vs. training energy consumption ratios</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tree offset calculations</h3>
            <p className="text-gray-600">
              We use the standard estimate that a mature tree can absorb approximately 22 kg of CO₂ 
              per year. The forest visualization shows the number of trees needed to offset your 
              annual AI usage emissions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Research references</h3>
            <p className="text-gray-600 mb-2">
              Our methodology is based on peer-reviewed research and industry standards:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
              <li>
                <a 
                  href="https://anuragsridharan.substack.com/p/we-can-use-tokens-to-track-ais-carbon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Sridharan, A. (2024). Token-based carbon tracking methodology
                </a>
              </li>
              <li>
                <a
                href="https://arxiv.org/pdf/1910.09700"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                >
                Lacoste, A., Luccioni, A., Schmidt, V., & Dandres, T. (2019). Quantifying the carbon emissions of machine learning
                </a>
              </li>
              <li>International Energy Agency (IEA) carbon intensity data</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Limitations</h3>
            <p className="text-gray-600">
              These calculations are estimates based on current research. Actual emissions may vary 
              based on specific model implementations, data center locations, and usage patterns. 
              This tool is designed to raise awareness and encourage more sustainable AI practices.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FAQModal;

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Calculator as CalcIcon } from 'lucide-react'

const PLATFORMS = {
  cursor: {
    label: 'Cursor',
    steps: [
      'Login to Cursor and navigate to "Dashboard"',
      'Click on Usage',
      'Select a date range above the "All Events" table, and then click on the "Export CSV" button',
      'Paste the generated URL below',
    ],
  },
  openai: {
    label: 'OpenAI',
    steps: [
      'Login to OpenAI and go to Usage',
      'Select a date range and export usage as CSV',
      'Paste the generated URL below',
    ],
  },
  claude: {
    label: 'Claude',
    steps: [
      'Login to Anthropic Console and go to Usage',
      'Export usage as CSV for a date range',
      'Paste the generated URL below',
    ],
  },
  gemini: {
    label: 'Gemini',
    steps: [
      'Login to Google AI Studio or Billing Reports',
      'Export usage as CSV for a date range',
      'Paste the generated URL below',
    ],
  },
}

function parseCsvForTokens(csvText) {
  // naive parser: sum a tokens column if present, otherwise try input_tokens+output_tokens
  let total = 0
  const lines = csvText.split(/\r?\n/)
  if (lines.length === 0) return 0
  const header = lines[0].split(',').map(h => h.trim().toLowerCase())
  const tokensIdx = header.indexOf('tokens')
  const inputIdx = header.indexOf('input_tokens')
  const outputIdx = header.indexOf('output_tokens')
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i]
    if (!row) continue
    const cols = row.split(',')
    const tokens = tokensIdx >= 0 ? Number(cols[tokensIdx] || 0) : 0
    const inputT = inputIdx >= 0 ? Number(cols[inputIdx] || 0) : 0
    const outputT = outputIdx >= 0 ? Number(cols[outputIdx] || 0) : 0
    total += tokensIdx >= 0 ? tokens : (inputT + outputT)
  }
  return isNaN(total) ? 0 : total
}

const Calculator = ({ onCalculate }) => {
  const [tokens, setTokens] = useState('')
  const [platform, setPlatform] = useState('cursor')
  const [csvUrl, setCsvUrl] = useState('')
  const [csvError, setCsvError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCsvError('')

    // Prefer CSV if provided
    if (csvUrl) {
      try {
        const res = await fetch(csvUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        const text = await res.text()
        const totalTokens = parseCsvForTokens(text)
        if (totalTokens > 0) {
          onCalculate(totalTokens)
          return
        }
        setCsvError('Could not detect token columns in CSV. Please check the file format.')
      } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('CORS')) {
          setCsvError('CORS error: Please download the CSV file and upload it instead, or copy the token count manually.')
        } else {
          setCsvError(`Unable to fetch CSV: ${err.message}. Try downloading and uploading the file instead.`)
        }
      }
    }

    const tokenNum = parseFloat(tokens)
    if (!isNaN(tokenNum) && tokenNum > 0) {
      onCalculate(tokenNum)
    }
  }

  const onFileUpload = async (e) => {
    setCsvError('')
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const totalTokens = parseCsvForTokens(text)
      if (totalTokens > 0) {
        onCalculate(totalTokens)
      } else {
        setCsvError('Could not detect token columns in CSV. Please check the file.')
      }
    } catch (_) {
      setCsvError('Failed to read the uploaded CSV file.')
    }
  }

  const steps = PLATFORMS[platform].steps

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-none" style={{ boxShadow: 'var(--shadow-elevated)' }}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CalcIcon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Calculate Your Impact</CardTitle>
            <CardDescription className="text-base">
              Enter tokens or import a usage CSV to estimate emissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="h-12 rounded-md border border-input bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Object.entries(PLATFORMS).map(([key, v]) => (
                    <option key={key} value={key}>{v.label}</option>
                  ))}
                </select>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                  {steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <label htmlFor="tokens" className="text-sm font-medium">Token Count</label>
                <Input
                  id="tokens"
                  type="number"
                  placeholder="e.g., 1000000"
                  value={tokens}
                  onChange={(e) => setTokens(e.target.value)}
                  className="h-12 text-lg"
                  min="1"
                  step="1"
                />
                <p className="text-xs text-muted-foreground">Or paste/upload a CSV to auto-calculate</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="csvurl" className="text-sm font-medium">CSV Export URL (or upload file)</label>
                <Input
                  id="csvurl"
                  type="url"
                  placeholder="https://...export-usage-events-csv?..."
                  value={csvUrl}
                  onChange={(e) => setCsvUrl(e.target.value)}
                />
                <div className="text-xs text-muted-foreground mb-2">
                  Note: If URL doesn't work due to CORS, download the CSV and upload it below
                </div>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={onFileUpload} 
                  className="text-sm block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" 
                />
                {csvError && <p className="text-xs text-destructive mt-1">{csvError}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02] calculate-button"
                size="lg"
              >
                Calculate Environmental Impact
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Calculator

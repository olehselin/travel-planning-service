import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { freeEmailService } from '@/services/freeEmailService'
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export const EmailTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTestEmail = async () => {
    if (!testEmail) return

    setIsLoading(true)
    setResult(null)

    try {
      const result = await freeEmailService.sendInviteEmail({
        to: testEmail,
        tripTitle: 'Test Trip',
        inviteUrl: 'https://example.com/accept-invite/test-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })

      setResult(result)
    } catch (error) {
      setResult({
        success: false,
        message: 'Error testing email: ' + (error as Error).message
      })
    }

    setIsLoading(false)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Test Email Service
        </CardTitle>
        <CardDescription>
          Протестуйте налаштування email сервісу
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-email">Test Email</Label>
          <Input
            id="test-email"
            type="email"
            placeholder="test@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleTestEmail} 
          disabled={!testEmail || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Test Email
            </>
          )}
        </Button>

        {result && (
          <div className={`p-3 rounded-md flex items-center gap-2 ${
            result.success 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <span className="text-sm">{result.message}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Якщо email не налаштовано, URL з'явиться в консолі</p>
          <p>• Відкрийте консоль браузера (F12) для перегляду</p>
        </div>
      </CardContent>
    </Card>
  )
}

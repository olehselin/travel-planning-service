import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, ExternalLink, Mail, Settings } from 'lucide-react'

interface EmailSetupProps {
  onSetupComplete?: () => void
}

export const EmailSetup: React.FC<EmailSetupProps> = ({ onSetupComplete }) => {
  const [emailjsConfig, setEmailjsConfig] = useState({
    serviceId: '',
    templateId: '',
    publicKey: ''
  })
  const [resendConfig, setResendConfig] = useState({
    apiKey: ''
  })
  const [activeService, setActiveService] = useState<'emailjs' | 'resend' | 'none'>('none')

  const handleEmailjsSetup = () => {
    // Тут можна зберегти конфігурацію в localStorage або відправити на сервер
    localStorage.setItem('emailjs_config', JSON.stringify(emailjsConfig))
    setActiveService('emailjs')
    onSetupComplete?.()
  }

  const handleResendSetup = () => {
    localStorage.setItem('resend_config', JSON.stringify(resendConfig))
    setActiveService('resend')
    onSetupComplete?.()
  }

  const handleSkipSetup = () => {
    setActiveService('none')
    onSetupComplete?.()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Email Setup</h1>
        <p className="text-muted-foreground">
          Налаштуйте безкоштовний email сервіс для відправки запрошень
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EmailJS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              EmailJS
            </CardTitle>
            <CardDescription>
              Безкоштовно до 200 email/місяць. Найпростіший варіант.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailjs-service">Service ID</Label>
              <Input
                id="emailjs-service"
                placeholder="service_xxxxxxx"
                value={emailjsConfig.serviceId}
                onChange={(e) => setEmailjsConfig(prev => ({ ...prev, serviceId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailjs-template">Template ID</Label>
              <Input
                id="emailjs-template"
                placeholder="template_xxxxxxx"
                value={emailjsConfig.templateId}
                onChange={(e) => setEmailjsConfig(prev => ({ ...prev, templateId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailjs-key">Public Key</Label>
              <Input
                id="emailjs-key"
                placeholder="xxxxxxxxxxxxxxx"
                value={emailjsConfig.publicKey}
                onChange={(e) => setEmailjsConfig(prev => ({ ...prev, publicKey: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEmailjsSetup} className="flex-1">
                Налаштувати EmailJS
              </Button>
              <Button variant="outline" asChild>
                <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Resend API
            </CardTitle>
            <CardDescription>
              Безкоштовно до 3000 email/місяць. Більше можливостей.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resend-key">API Key</Label>
              <Input
                id="resend-key"
                placeholder="re_xxxxxxxxxxxxxxx"
                value={resendConfig.apiKey}
                onChange={(e) => setResendConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleResendSetup} className="flex-1">
                Налаштувати Resend
              </Button>
              <Button variant="outline" asChild>
                <a href="https://resend.com/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skip Option */}
      <Card>
        <CardHeader>
          <CardTitle>Пропустити налаштування</CardTitle>
          <CardDescription>
            Ви можете пропустити налаштування email. URL запрошень будуть показуватися в консолі браузера.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSkipSetup}>
            Пропустити (Fallback режим)
          </Button>
        </CardContent>
      </Card>

      {/* Status */}
      {activeService !== 'none' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Email сервіс налаштовано: {activeService === 'emailjs' ? 'EmailJS' : 'Resend'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

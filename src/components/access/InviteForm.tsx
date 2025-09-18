import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus } from 'lucide-react'

interface InviteFormProps {
  onInvite: (email: string) => Promise<boolean>
  isLoading: boolean
  error: string
  success: string
}

export const InviteForm: React.FC<InviteFormProps> = ({
  onInvite,
  isLoading,
  error,
  success
}) => {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await onInvite(email)
    if (success) {
      setEmail('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          Invite Collaborator
        </CardTitle>
        <CardDescription>
          Send an invitation to collaborate on this trip
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
              {success}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

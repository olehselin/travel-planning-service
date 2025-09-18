import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Mail, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle 
} from 'lucide-react'
import { format } from 'date-fns'
import { TripAccess } from '@/types'

interface AccessListProps {
  tripAccess: TripAccess[]
  onReinvite: (email: string) => Promise<boolean>
  onRevokeAccess: (accessId: string) => Promise<boolean>
  isLoading: boolean
}

export const AccessList: React.FC<AccessListProps> = ({
  tripAccess,
  onReinvite,
  onRevokeAccess,
  isLoading
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted'
      case 'pending':
        return 'Pending'
      case 'declined':
        return 'Declined'
      default:
        return 'Unknown'
    }
  }

  const handleReinvite = async (email: string) => {
    if (confirm('Are you sure you want to resend the invitation?')) {
      await onReinvite(email)
    }
  }

  const handleRevokeAccess = async (accessId: string) => {
    if (confirm('Are you sure you want to revoke access for this user?')) {
      await onRevokeAccess(accessId)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Trip Collaborators ({tripAccess.length})
        </CardTitle>
        <CardDescription>
          People who have access to this trip
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tripAccess.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collaborators yet</h3>
            <p className="text-muted-foreground">
              Invite people to collaborate on your trip
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tripAccess.map((access) => (
              <div key={access.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{access.email}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {getStatusIcon(access.status)}
                      <span>{getStatusText(access.status)}</span>
                      <span>•</span>
                      <span>Invited {format(new Date(access.invitedAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                    {access.role}
                  </span>
                  {access.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReinvite(access.email)}
                      disabled={isLoading}
                    >
                      Resend
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeAccess(access.id)}
                    disabled={isLoading}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

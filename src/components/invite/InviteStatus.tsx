import React from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { InviteStatus as InviteStatusType } from '@/hooks/useInviteAcceptance'

interface InviteStatusProps {
  status: InviteStatusType
}

export const InviteStatus: React.FC<InviteStatusProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'expired':
        return <Clock className="h-8 w-8 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      default:
        return <XCircle className="h-8 w-8 text-red-500" />
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'valid':
        return 'Valid Invitation'
      case 'expired':
        return 'Expired Invitation'
      case 'accepted':
        return 'Invitation Accepted'
      default:
        return 'Invalid Invitation'
    }
  }

  const getStatusDescription = () => {
    switch (status) {
      case 'valid':
        return 'You have been invited to collaborate on a trip'
      case 'expired':
        return 'This invitation is no longer valid'
      case 'accepted':
        return 'Welcome to the trip!'
      case 'invalid':
        return 'This invitation link is not valid'
      default:
        return ''
    }
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-4">
        {getStatusIcon()}
      </div>
      <h1 className="text-2xl font-bold mb-2">{getStatusMessage()}</h1>
      <p className="text-muted-foreground">{getStatusDescription()}</p>
    </div>
  )
}

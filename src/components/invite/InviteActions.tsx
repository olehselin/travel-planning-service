import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { InviteStatus as InviteStatusType } from '@/hooks/useInviteAcceptance'
import { Invite } from '@/types'

interface InviteActionsProps {
  status: InviteStatusType
  invite: Invite | null
  isAccepting: boolean
  onAcceptInvite: () => Promise<boolean>
}

export const InviteActions: React.FC<InviteActionsProps> = ({
  status,
  invite,
  isAccepting,
  onAcceptInvite
}) => {
  if (status === 'valid') {
    return (
      <div className="space-y-3">
        <Button 
          onClick={onAcceptInvite} 
          disabled={isAccepting}
          className="w-full"
        >
          {isAccepting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Accepting...
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              Accept Invitation
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>• As a collaborator, you can add, edit, and delete places in this trip</p>
          <p>• You cannot delete the trip or invite other collaborators</p>
          <p>• This invitation expires in 24 hours</p>
        </div>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div className="text-center space-y-3">
        <p className="text-muted-foreground">
          This invitation has expired. Please contact the trip owner for a new invitation.
        </p>
        <Button variant="outline" asChild>
          <Link to="/trips">Go to My Trips</Link>
        </Button>
      </div>
    )
  }

  if (status === 'accepted') {
    return (
      <div className="text-center space-y-3">
        <p className="text-muted-foreground">
          You will be redirected to the trip in a moment...
        </p>
        <Button asChild>
          <Link to={`/trips/${invite?.tripId}`}>View Trip Now</Link>
        </Button>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div className="text-center space-y-3">
        <p className="text-muted-foreground">
          This invitation link is not valid or has been used already.
        </p>
        <Button variant="outline" asChild>
          <Link to="/trips">Go to My Trips</Link>
        </Button>
      </div>
    )
  }

  return null
}

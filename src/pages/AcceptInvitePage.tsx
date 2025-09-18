import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useInviteAcceptance } from '@/hooks/useInviteAcceptance'
import { InviteStatus } from '@/components/invite/InviteStatus'
import { TripInviteInfo } from '@/components/invite/TripInviteInfo'
import { InviteActions } from '@/components/invite/InviteActions'
import { LoginRequired } from '@/components/invite/LoginRequired'
import { InviteLoading } from '@/components/invite/InviteLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const AcceptInvitePage: React.FC = () => {
  const { user } = useAuth()
  const {
    invite,
    trip,
    isLoading,
    isAccepting,
    error,
    success,
    status,
    loadInviteDetails,
    handleAcceptInvite
  } = useInviteAcceptance()

  useEffect(() => {
    loadInviteDetails()
  }, [loadInviteDetails])

  if (isLoading) {
    return <InviteLoading />
  }

  if (!user) {
    return <LoginRequired />
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <InviteStatus status={status} />
        </CardHeader>
        <CardContent className="space-y-6">
          {trip && invite && (
            <TripInviteInfo trip={trip} invite={invite} />
          )}

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

          <InviteActions
            status={status}
            invite={invite}
            isAccepting={isAccepting}
            onAcceptInvite={handleAcceptInvite}
          />
        </CardContent>
      </Card>
    </div>
  )
}

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTripAccess } from '@/hooks/useTripAccess'
import { AccessPageHeader } from '@/components/access/AccessPageHeader'
import { InviteForm } from '@/components/access/InviteForm'
import { AccessList } from '@/components/access/AccessList'
import { CollaborationInfo } from '@/components/access/CollaborationInfo'
import { AccessDenied } from '@/components/access/AccessDenied'

export const TripAccessPage: React.FC = () => {
  const { user } = useAuth()
  const {
    tripId,
    currentTrip,
    tripAccess,
    isLoading,
    error,
    success,
    loadTripAndAccess,
    handleInviteUser,
    handleReinvite,
    handleRevokeAccess
  } = useTripAccess()

  useEffect(() => {
    if (tripId) {
      loadTripAndAccess()
    }
  }, [tripId, loadTripAndAccess])

  if (isLoading || !currentTrip) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading trip access...</p>
        </div>
      </div>
    )
  }

  const isOwner = currentTrip.ownerId === user?.uid

  if (!isOwner) {
    return <AccessDenied tripId={tripId!} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AccessPageHeader trip={currentTrip} tripId={tripId!} />

      {/* Invite Form */}
      <InviteForm
        onInvite={handleInviteUser}
        isLoading={isLoading}
        error={error}
        success={success}
      />

      {/* Access List */}
      <AccessList
        tripAccess={tripAccess}
        onReinvite={handleReinvite}
        onRevokeAccess={handleRevokeAccess}
        isLoading={isLoading}
      />

      {/* Info Card */}
      <CollaborationInfo />
    </div>
  )
}

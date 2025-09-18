import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useTripsStore } from '@/stores/tripsStore'
import { tripsService } from '@/services/tripsService'
import { 
  ArrowLeft, 
  Mail, 
  UserPlus, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle 
} from 'lucide-react'
import { format } from 'date-fns'

export const TripAccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { currentTrip, tripAccess, setCurrentTrip, setTripAccess } = useTripsStore()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (id) {
      loadTripAndAccess()
    }
  }, [id])

  const loadTripAndAccess = async () => {
    if (!id) return
    
    setIsLoading(true)
    const trip = await tripsService.getTrip(id, user?.email, user?.uid)
    if (trip) {
      setCurrentTrip(trip)
      const access = await tripsService.getTripAccess(id)
      setTripAccess(access)
    }
    setIsLoading(false)
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !user || !currentTrip) return

    // Check if user is owner
    if (currentTrip.ownerId !== user.uid) {
      setError('Only trip owners can invite collaborators')
      return
    }

    // Check if inviting self
    if (email === user.email) {
      setError('You cannot invite yourself')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await tripsService.sendInvite(id, email, user.uid)
      
      if (result.success) {
        setEmail('')
        setSuccess(result.message)
        // Reload trip access to show the new invitation
        await loadTripAndAccess()
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('Error sending invite:', error)
      setError('Failed to send invitation. Please try again.')
    }

    setIsLoading(false)
  }

  const handleReinvite = async (email: string) => {
    if (!id || !user || !currentTrip) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await tripsService.sendInvite(id, email, user.uid)
      
      if (result.success) {
        setSuccess(result.message)
        // Reload trip access to show the updated invitation
        await loadTripAndAccess()
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('Error resending invite:', error)
      setError('Failed to resend invitation. Please try again.')
    }

    setIsLoading(false)
  }

  const handleRevokeAccess = async (accessId: string) => {
    if (!user || !currentTrip) return
    
    if (currentTrip.ownerId !== user.uid) {
      setError('Only trip owners can revoke access')
      return
    }

    if (confirm('Are you sure you want to revoke access for this user?')) {
      setIsLoading(true)
      setError('')
      setSuccess('')

      try {
        // Find the access record to get the email
        const accessRecord = tripAccess.find(access => access.id === accessId)
        if (!accessRecord) {
          setError('Access record not found')
          setIsLoading(false)
          return
        }

        // Delete from database
        const success = await tripsService.deleteTripAccess(accessId)
        
        if (success) {
          // Update local state
          setTripAccess(tripAccess.filter(access => access.id !== accessId))
          setSuccess('Access revoked successfully')
        } else {
          setError('Failed to revoke access')
        }
      } catch (error) {
        console.error('Error revoking access:', error)
        setError('Failed to revoke access')
      }

      setIsLoading(false)
    }
  }

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

  if (!currentTrip) {
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
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-4">
          Only trip owners can manage access to this trip.
        </p>
        <Button asChild>
          <Link to={`/trips/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trip
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/trips/${id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Trip
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Manage Access</h1>
            <p className="text-muted-foreground">{currentTrip.title}</p>
          </div>
        </div>
      </div>

      {/* Invite Form */}
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
          <form onSubmit={handleInviteUser} className="space-y-4">
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

      {/* Access List */}
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
                      >
                        Resend
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeAccess(access.id)}
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

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Collaboration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Collaborators can add, edit, and delete places in this trip</p>
          <p>• Only trip owners can invite new collaborators or delete the trip</p>
          <p>• Invitations are sent via email with a secure link</p>
          <p>• You can revoke access at any time</p>
          <p>• <strong>Note:</strong> Emails are sent via Firebase Cloud Functions</p>
        </CardContent>
      </Card>
    </div>
  )
}

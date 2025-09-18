import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { tripsService } from '@/services/tripsService'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Calendar,
  UserPlus
} from 'lucide-react'
import { format } from 'date-fns'
import { Trip, Invite } from '@/types'

export const AcceptInvitePage: React.FC = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [invite, setInvite] = useState<Invite | null>(null)
  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [status, setStatus] = useState<'loading' | 'valid' | 'expired' | 'invalid' | 'accepted'>('loading')

  useEffect(() => {
    if (token) {
      loadInviteDetails()
    }
  }, [token])

  const loadInviteDetails = async () => {
    if (!token) return

    setIsLoading(true)
    setError('')

    try {
      const inviteData = await tripsService.getInviteByToken(token)
      
      if (!inviteData) {
        setStatus('invalid')
        setError('Invalid invitation link')
        setIsLoading(false)
        return
      }

      setInvite(inviteData)

      // Check if invite is expired
      if (new Date() > new Date(inviteData.expiresAt)) {
        setStatus('expired')
        setError('This invitation has expired')
        setIsLoading(false)
        return
      }

      // Load trip details
      const tripData = await tripsService.getTrip(inviteData.tripId)
      if (!tripData) {
        setStatus('invalid')
        setError('Trip not found')
        setIsLoading(false)
        return
      }

      setTrip(tripData)
      setStatus('valid')
    } catch (error) {
      console.error('Error loading invite details:', error)
      setStatus('invalid')
      setError('Failed to load invitation details')
    }

    setIsLoading(false)
  }

  const handleAcceptInvite = async () => {
    if (!token || !user || !invite) return

    setIsAccepting(true)
    setError('')

    try {
      const success = await tripsService.acceptInvite(token, user.uid)
      
      if (success) {
        setStatus('accepted')
        setSuccess('You have successfully joined this trip!')
        
        // Redirect to trip details after 2 seconds
        setTimeout(() => {
          navigate(`/trips/${invite.tripId}`)
        }, 2000)
      } else {
        setError('Failed to accept invitation. Please try again.')
      }
    } catch (error) {
      console.error('Error accepting invite:', error)
      setError('Failed to accept invitation. Please try again.')
    }

    setIsAccepting(false)
  }

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Login Required</CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to accept this invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button asChild className="flex-1">
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-center">{getStatusMessage()}</CardTitle>
          <CardDescription className="text-center">
            {status === 'valid' && 'You have been invited to collaborate on a trip'}
            {status === 'expired' && 'This invitation is no longer valid'}
            {status === 'accepted' && 'Welcome to the trip!'}
            {status === 'invalid' && 'This invitation link is not valid'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {trip && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                {trip.description && (
                  <p className="text-muted-foreground">{trip.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trip.startDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(trip.startDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                {trip.endDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {invite && (
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Invited as</p>
                    <p className="text-sm text-muted-foreground">
                      {invite.email} (Collaborator)
                    </p>
                  </div>
                </div>
              )}
            </div>
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

          <div className="space-y-4">
            {status === 'valid' && (
              <div className="space-y-3">
                <Button 
                  onClick={handleAcceptInvite} 
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
            )}

            {status === 'expired' && (
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">
                  This invitation has expired. Please contact the trip owner for a new invitation.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/trips">Go to My Trips</Link>
                </Button>
              </div>
            )}

            {status === 'accepted' && (
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">
                  You will be redirected to the trip in a moment...
                </p>
                <Button asChild>
                  <Link to={`/trips/${invite?.tripId}`}>View Trip Now</Link>
                </Button>
              </div>
            )}

            {status === 'invalid' && (
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">
                  This invitation link is not valid or has been used already.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/trips">Go to My Trips</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

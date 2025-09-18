import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const LoginRequired: React.FC = () => {
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

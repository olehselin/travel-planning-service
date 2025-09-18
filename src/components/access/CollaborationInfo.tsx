import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const CollaborationInfo: React.FC = () => {
  return (
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
  )
}

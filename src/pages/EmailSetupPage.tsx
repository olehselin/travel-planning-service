import React from 'react'
import { EmailSetup } from '@/components/EmailSetup'
import { EmailTest } from '@/components/EmailTest'

export const EmailSetupPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <EmailSetup />
      <div className="mt-8">
        <EmailTest />
      </div>
    </div>
  )
}

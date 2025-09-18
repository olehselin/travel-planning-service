import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trip } from '@/types'
import { TripFormData, FormErrors } from '@/types/forms'
import { validateRequired, validateTripTitle, validateDateRange } from '@/lib/utils/formUtils'
import { VALIDATION_MESSAGES, FORM_LABELS, FORM_PLACEHOLDERS } from '@/constants/validation'

interface EditTripFormProps {
  trip: Trip
  onClose: () => void
  onSuccess: () => void
}

const FormField: React.FC<{
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  multiline?: boolean
}> = ({ label, type = 'text', value, onChange, placeholder, required, error, multiline }) => {
  const InputComponent = multiline ? 'textarea' : 'input'
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label} {required && '*'}</label>
      <InputComponent
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={multiline ? "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" : undefined}
      />
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}

const FormActions: React.FC<{
  onCancel: () => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  submitText: string
  isValid: boolean
}> = ({ onCancel, onSubmit, isLoading, submitText, isValid }) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading || !isValid} onClick={onSubmit}>
        {isLoading ? 'Updating...' : submitText}
      </Button>
    </div>
  )
}

export const EditTripForm: React.FC<EditTripFormProps> = ({ trip, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<TripFormData>({
    title: trip.title,
    description: trip.description || '',
    startDate: trip.startDate || '',
    endDate: trip.endDate || ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!validateRequired(formData.title)) {
      newErrors.title = VALIDATION_MESSAGES.REQUIRED
    } else if (!validateTripTitle(formData.title)) {
      newErrors.title = VALIDATION_MESSAGES.TRIP_TITLE_TOO_SHORT
    }
    
    if (formData.startDate && formData.endDate && !validateDateRange(formData.startDate, formData.endDate)) {
      newErrors.dates = VALIDATION_MESSAGES.DATE_RANGE_INVALID
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Use useMemo to calculate form validity without side effects
  const isFormValid = useMemo(() => {
    if (!validateRequired(formData.title)) return false
    if (!validateTripTitle(formData.title)) return false
    if (formData.startDate && formData.endDate && !validateDateRange(formData.startDate, formData.endDate)) return false
    return true
  }, [formData.title, formData.startDate, formData.endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Import tripsService dynamically to avoid circular dependencies
      const { tripsService } = await import('@/services/tripsService')
      
      const updates = {
        title: formData.title,
        ...(formData.description && { description: formData.description }),
        ...(formData.startDate && { startDate: formData.startDate }),
        ...(formData.endDate && { endDate: formData.endDate })
      }

      const success = await tripsService.updateTrip(trip.id, updates, '')
      
      if (success) {
        onSuccess()
      } else {
        setErrors({ submit: VALIDATION_MESSAGES.TRIP_UPDATE_FAILED })
      }
    } catch (error) {
      console.error('Error updating trip:', error)
      setErrors({ submit: VALIDATION_MESSAGES.TRIP_UPDATE_FAILED })
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: keyof TripFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Trip</CardTitle>
        <CardDescription>
          Update your trip information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label={FORM_LABELS.TITLE}
            value={formData.title}
            onChange={(value) => updateField('title', value)}
            placeholder={FORM_PLACEHOLDERS.TRIP_TITLE}
            required
            error={errors.title}
          />

          <FormField
            label={FORM_LABELS.DESCRIPTION}
            value={formData.description}
            onChange={(value) => updateField('description', value)}
            placeholder={FORM_PLACEHOLDERS.TRIP_DESCRIPTION}
            multiline
            error={errors.description}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={FORM_LABELS.START_DATE}
              type="date"
              value={formData.startDate}
              onChange={(value) => updateField('startDate', value)}
              error={errors.startDate}
            />
            <FormField
              label={FORM_LABELS.END_DATE}
              type="date"
              value={formData.endDate}
              onChange={(value) => updateField('endDate', value)}
              error={errors.endDate}
            />
          </div>

          {errors.dates && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {errors.dates}
            </div>
          )}

          {errors.submit && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {errors.submit}
            </div>
          )}

          <FormActions
            onCancel={onClose}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitText="Update Trip"
            isValid={isFormValid}
          />
        </form>
      </CardContent>
    </Card>
  )
}

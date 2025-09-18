import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Place } from '@/types'
import { PlaceFormData, FormErrors } from '@/types/forms'
import { validateRequired } from '@/lib/utils/formUtils'
import { VALIDATION_MESSAGES, FORM_LABELS, FORM_PLACEHOLDERS } from '@/constants/validation'

interface PlaceFormProps {
  tripId: string
  place?: Place // If provided, it's edit mode
  onClose: () => void
  onSuccess: () => void
}

const FormField: React.FC<{
  label: string
  type?: string
  value: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  required?: boolean
  min?: number
  error?: string
  multiline?: boolean
}> = ({ label, type = 'text', value, onChange, placeholder, required, min, error, multiline }) => {
  const InputComponent = multiline ? 'textarea' : 'input'
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label} {required && '*'}</label>
      <InputComponent
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const newValue = type === 'number' ? parseInt(e.target.value) : e.target.value
          onChange(newValue)
        }}
        placeholder={placeholder}
        required={required}
        min={min}
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
        {isLoading ? (submitText.includes('Add') ? 'Adding...' : 'Updating...') : submitText}
      </Button>
    </div>
  )
}

export const PlaceForm: React.FC<PlaceFormProps> = ({ tripId, place, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<PlaceFormData>({
    locationName: place?.locationName || '',
    notes: place?.notes || '',
    dayNumber: place?.dayNumber || 1
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!validateRequired(formData.locationName)) {
      newErrors.locationName = VALIDATION_MESSAGES.REQUIRED
    }
    
    if (formData.dayNumber < 1) {
      newErrors.dayNumber = 'Day number must be at least 1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Use useMemo to calculate form validity without side effects
  const isFormValid = useMemo(() => {
    if (!validateRequired(formData.locationName)) return false
    if (formData.dayNumber < 1) return false
    return true
  }, [formData.locationName, formData.dayNumber])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Import tripsService dynamically to avoid circular dependencies
      const { tripsService } = await import('@/services/tripsService')
      
      // This is a simplified approach - in real implementation, you'd pass user from parent
      const placeData = {
        tripId,
        locationName: formData.locationName,
        dayNumber: formData.dayNumber,
        ...(formData.notes && { notes: formData.notes })
      }

      if (place) {
        // Edit mode
        const success = await tripsService.updatePlace(place.id, placeData, '', '')
        if (!success) {
          setErrors({ submit: VALIDATION_MESSAGES.PLACE_UPDATE_FAILED })
        }
      } else {
        // Create mode
        const placeId = await tripsService.createPlace(placeData, '', '')
        if (!placeId) {
          setErrors({ submit: VALIDATION_MESSAGES.PLACE_CREATE_FAILED })
        }
      }
      
      if (Object.keys(errors).length === 0) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error saving place:', error)
      setErrors({ submit: place ? VALIDATION_MESSAGES.PLACE_UPDATE_FAILED : VALIDATION_MESSAGES.PLACE_CREATE_FAILED })
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: keyof PlaceFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const isEditMode = !!place
  const title = isEditMode ? 'Edit Place' : 'Add New Place'
  const description = isEditMode ? 'Update place information' : 'Add a location to your trip itinerary'
  const submitText = isEditMode ? 'Update Place' : 'Add Place'

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label={FORM_LABELS.LOCATION_NAME}
            value={formData.locationName}
            onChange={(value) => updateField('locationName', value)}
            placeholder={FORM_PLACEHOLDERS.LOCATION_NAME}
            required
            error={errors.locationName}
          />

          <FormField
            label={FORM_LABELS.DAY_NUMBER}
            type="number"
            value={formData.dayNumber}
            onChange={(value) => updateField('dayNumber', value)}
            min={1}
            required
            error={errors.dayNumber}
          />

          <FormField
            label={FORM_LABELS.NOTES}
            value={formData.notes}
            onChange={(value) => updateField('notes', value)}
            placeholder={FORM_PLACEHOLDERS.NOTES}
            multiline
            error={errors.notes}
          />

          {errors.submit && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {errors.submit}
            </div>
          )}

          <FormActions
            onCancel={onClose}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitText={submitText}
            isValid={isFormValid}
          />
        </form>
      </CardContent>
    </Card>
  )
}

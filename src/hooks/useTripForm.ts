import { useState, useCallback, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { tripsService } from '@/services/tripsService'
import { TripFormData, FormErrors } from '@/types/forms'
import { validateRequired, validateTripTitle, validateDateRange } from '@/lib/utils/formUtils'
import { VALIDATION_MESSAGES } from '@/constants/validation'

export const useTripForm = (onSuccess: () => void) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = useCallback(() => {
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
  }, [formData])

  // Use useMemo to calculate form validity without side effects
  const isFormValid = useMemo(() => {
    if (!validateRequired(formData.title)) return false
    if (!validateTripTitle(formData.title)) return false
    if (formData.startDate && formData.endDate && !validateDateRange(formData.startDate, formData.endDate)) return false
    return true
  }, [formData.title, formData.startDate, formData.endDate])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const tripData = {
        title: formData.title,
        ownerId: user.uid,
        ...(formData.description && { description: formData.description }),
        ...(formData.startDate && { startDate: formData.startDate }),
        ...(formData.endDate && { endDate: formData.endDate })
      }

      const tripId = await tripsService.createTrip(tripData)
      if (tripId) {
        onSuccess()
      } else {
        setErrors({ submit: VALIDATION_MESSAGES.TRIP_CREATE_FAILED })
      }
    } catch (error) {
      console.error('Error creating trip:', error)
      setErrors({ submit: VALIDATION_MESSAGES.TRIP_CREATE_FAILED })
    } finally {
      setIsLoading(false)
    }
  }, [formData, user, onSuccess])

  const updateField = useCallback((field: keyof TripFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }, [errors])

  return {
    formData,
    errors,
    isLoading,
    handleSubmit,
    updateField,
    validateForm,
    isFormValid
  }
}

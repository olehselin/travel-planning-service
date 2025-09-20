import { useState, useCallback, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTripsStore } from '@/stores/tripsStore'
import { tripsService } from '@/services/tripsService'
import { PlaceFormData, FormErrors } from '@/types/forms'
import { validateRequired } from '@/lib/utils/formUtils'
import { VALIDATION_MESSAGES } from '@/constants/validation'
import { Place } from '@/types'

export const usePlaceForm = (tripId: string, place?: Place) => {
  const { user } = useAuth()
  const { places } = useTripsStore()
  const [formData, setFormData] = useState<PlaceFormData>({
    locationName: place?.locationName || '',
    notes: place?.notes || '',
    dayNumber: place?.dayNumber || 1
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // Auto-calculate next day number for new places
  useEffect(() => {
    if (!place && places.length > 0) {
      const maxDayNumber = Math.max(...places.map(p => p.dayNumber))
      setFormData(prev => ({ ...prev, dayNumber: maxDayNumber + 1 }))
    }
  }, [places, place])

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {}
    
    if (!validateRequired(formData.locationName)) {
      newErrors.locationName = VALIDATION_MESSAGES.REQUIRED
    }
    
    if (formData.dayNumber < 1) {
      newErrors.dayNumber = 'Day number must be at least 1'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Use useMemo to calculate form validity without side effects
  const isFormValid = useMemo(() => {
    if (!validateRequired(formData.locationName)) return false
    if (formData.dayNumber < 1) return false
    return true
  }, [formData.locationName, formData.dayNumber])

  const handleSubmit = useCallback(async () => {
    if (!user || !validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const placeData = {
        tripId,
        locationName: formData.locationName,
        dayNumber: formData.dayNumber,
        ...(formData.notes && { notes: formData.notes })
      }

      if (place) {
        // Edit mode
        const success = await tripsService.updatePlace(place.id, placeData, user.uid, user.email)
        if (!success) {
          setErrors({ submit: VALIDATION_MESSAGES.PLACE_UPDATE_FAILED })
        }
        return success
      } else {
        // Create mode
        const placeId = await tripsService.createPlace(placeData, user.uid, user.email)
        if (!placeId) {
          setErrors({ submit: VALIDATION_MESSAGES.PLACE_CREATE_FAILED })
        }
        return !!placeId
      }
    } catch (error) {
      console.error('Error saving place:', error)
      setErrors({ submit: place ? VALIDATION_MESSAGES.PLACE_UPDATE_FAILED : VALIDATION_MESSAGES.PLACE_CREATE_FAILED })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [formData, user, tripId, place])

  const updateField = useCallback((field: keyof PlaceFormData, value: string | number) => {
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

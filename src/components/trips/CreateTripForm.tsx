import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTripForm } from '@/hooks/useTripForm'
import { FORM_LABELS, FORM_PLACEHOLDERS } from '@/constants/validation'

interface CreateTripFormProps {
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
  minLength?: number
  error?: string
  multiline?: boolean
}> = ({ label, type = 'text', value, onChange, placeholder, required, minLength, error, multiline }) => {
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
        minLength={minLength}
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
        {isLoading ? 'Creating...' : submitText}
      </Button>
    </div>
  )
}

export const CreateTripForm: React.FC<CreateTripFormProps> = ({ onClose, onSuccess }) => {
  const { formData, errors, isLoading, handleSubmit, updateField, isFormValid } = useTripForm(onSuccess)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Trip</CardTitle>
        <CardDescription>
          Plan your next adventure with a new trip
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
            submitText="Create Trip"
            isValid={isFormValid}
          />
        </form>
      </CardContent>
    </Card>
  )
}

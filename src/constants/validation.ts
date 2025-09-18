// Повідомлення валідації
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  DATE_RANGE_INVALID: 'Start date must be before end date',
  TRIP_TITLE_TOO_SHORT: 'Trip title must be at least 3 characters',
  TRIP_TITLE_TOO_LONG: 'Trip title must be less than 100 characters',
  TRIP_CREATE_FAILED: 'Failed to create trip',
  TRIP_UPDATE_FAILED: 'Failed to update trip',
  TRIP_DELETE_FAILED: 'Failed to delete trip',
  LOGIN_FAILED: 'Login failed',
  REGISTRATION_FAILED: 'Registration failed',
  INVITE_FAILED: 'Failed to send invitation',
  PLACE_CREATE_FAILED: 'Failed to create place',
  PLACE_UPDATE_FAILED: 'Failed to update place',
  PLACE_DELETE_FAILED: 'Failed to delete place'
} as const

// Лейбли форм
export const FORM_LABELS = {
  TITLE: 'Title',
  DESCRIPTION: 'Description',
  START_DATE: 'Start Date',
  END_DATE: 'End Date',
  EMAIL: 'Email',
  PASSWORD: 'Password',
  DISPLAY_NAME: 'Display Name',
  LOCATION_NAME: 'Location Name',
  NOTES: 'Notes',
  DAY_NUMBER: 'Day Number'
} as const

// Плейсхолдери форм
export const FORM_PLACEHOLDERS = {
  TRIP_TITLE: 'Enter trip title',
  TRIP_DESCRIPTION: 'Describe your trip',
  EMAIL: 'Enter your email',
  PASSWORD: 'Enter your password',
  DISPLAY_NAME: 'Enter your name',
  LOCATION_NAME: 'Enter location name',
  NOTES: 'Add notes about this location'
} as const

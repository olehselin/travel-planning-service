// Типи для форм
export interface TripFormData {
  title: string
  description: string
  startDate: string
  endDate: string
}

export interface AuthFormData {
  email: string
  password: string
  displayName?: string
}

export interface PlaceFormData {
  locationName: string
  notes: string
  dayNumber: number
}

export interface InviteFormData {
  email: string
}

// Типи для помилок форм
export interface FormErrors {
  [key: string]: string
}

// Типи для стану форм
export interface FormState<T> {
  data: T
  errors: FormErrors
  isLoading: boolean
  isValid: boolean
}

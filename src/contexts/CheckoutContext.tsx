'use client'

import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'
import { Address } from '@/lib/types'

export interface CheckoutData {
    shippingAddress: Address | null
    billingAddress: Address | null
    paymentMethod: string | null
    paymentId?: string
    orderId?: string
    orderNotes: string
}

export interface CheckoutState {
    currentStep: number
    data: CheckoutData
    isProcessing: boolean
    error: string | null
}

type CheckoutAction =
    | { type: 'SET_STEP'; payload: number }
    | { type: 'NEXT_STEP' }
    | { type: 'PREV_STEP' }
    | { type: 'UPDATE_DATA'; payload: Partial<CheckoutData> }
    | { type: 'SET_PROCESSING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'RESET' }

interface CheckoutContextType extends CheckoutState {
    goToStep: (step: number) => void
    nextStep: () => void
    prevStep: () => void
    updateData: (data: Partial<CheckoutData>) => void
    setProcessing: (processing: boolean) => void
    setError: (error: string | null) => void
    reset: () => void
    canProceedToNext: boolean
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

const initialState: CheckoutState = {
    currentStep: 1,
    data: {
        shippingAddress: null,
        billingAddress: null,
        paymentMethod: null,
        orderNotes: ''
    },
    isProcessing: false,
    error: null
}

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
    switch (action.type) {
        case 'SET_STEP':
            return {
                ...state,
                currentStep: Math.max(1, Math.min(3, action.payload))
            }
        case 'NEXT_STEP':
            return {
                ...state,
                currentStep: Math.min(3, state.currentStep + 1)
            }
        case 'PREV_STEP':
            return {
                ...state,
                currentStep: Math.max(1, state.currentStep - 1)
            }
        case 'UPDATE_DATA':
            return {
                ...state,
                data: { ...state.data, ...action.payload }
            }
        case 'SET_PROCESSING':
            return {
                ...state,
                isProcessing: action.payload
            }
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            }
        case 'RESET':
            return initialState
        default:
            return state
    }
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(checkoutReducer, initialState)

    const goToStep = useCallback((step: number) => {
        dispatch({ type: 'SET_STEP', payload: step })
    }, [])

    const nextStep = useCallback(() => {
        dispatch({ type: 'NEXT_STEP' })
    }, [])

    const prevStep = useCallback(() => {
        dispatch({ type: 'PREV_STEP' })
    }, [])

    const updateData = useCallback((data: Partial<CheckoutData>) => {
        dispatch({ type: 'UPDATE_DATA', payload: data })
    }, [])

    const setProcessing = useCallback((processing: boolean) => {
        dispatch({ type: 'SET_PROCESSING', payload: processing })
    }, [])

    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error })
    }, [])

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' })
    }, [])

    // Determine if user can proceed to next step
    const canProceedToNext = (() => {
        switch (state.currentStep) {
            case 1:
                return state.data.shippingAddress !== null
            case 2:
                return state.data.paymentMethod !== null
            case 3:
                return true // Review step - always allow proceeding to place order
            default:
                return false
        }
    })()

    const value: CheckoutContextType = {
        ...state,
        goToStep,
        nextStep,
        prevStep,
        updateData,
        setProcessing,
        setError,
        reset,
        canProceedToNext
    }

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    )
}

export function useCheckout() {
    const context = useContext(CheckoutContext)
    if (context === undefined) {
        throw new Error('useCheckout must be used within a CheckoutProvider')
    }
    return context
}
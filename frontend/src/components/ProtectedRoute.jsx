import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/Authenticator'
import LoadingState from './LoadingState'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingState />
  if (!user) return <Navigate to="/login" replace />
  return children
}

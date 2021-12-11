import { ApolloError } from 'apollo-server-errors'
import { GraphQLError } from 'graphql'

export enum GraphErrorSeverity {
  CRITICAL = 'CRITICAL',
  IMPORTANT = 'IMPORTANT',
  WARNING = 'WARNING'
}

export type GraphError = {
  errorCode: string
  message: string
  severity?: GraphErrorSeverity
  rootCause: string[]
}

export class BaseGraphError extends ApolloError {
  constructor(name: string, message: string, code?: string, severity?: GraphErrorSeverity) {
    super( message, 'CAUGHT_UNRECOGNISED_ERROR' );

    Object.defineProperty( this, 'name', { value: name } )
    Object.defineProperty( this, 'code', { value: code || 'CAUGHT_UNRECOGNISED_ERROR' } )
    Object.defineProperty( this, 'severity', { value: severity || GraphErrorSeverity.IMPORTANT } )
  }

  formatError(): GraphError {
    return {
      errorCode: this.code,
      message: this.message,
      severity: this.severity,
      rootCause: this.stack?.split(",") || []
    }
  }
}

export function formatError(error: GraphQLError): GraphError {
  if ( error.originalError instanceof BaseGraphError ) {
    return error.originalError.formatError()
  }

  return {
    message: error.originalError?.message || error.message,
    errorCode: error.originalError?.name || error.name,
    severity: GraphErrorSeverity.CRITICAL,
    rootCause: error.extensions.exception?.stacktrace?.concat() || []
  }
}
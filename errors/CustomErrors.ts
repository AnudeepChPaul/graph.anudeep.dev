import { BaseGraphError } from '@/errors/index'

export class UnknownQueryError extends BaseGraphError {
  constructor(message?: string) {
    super( 'UnknownQueryError', message || "No document found!", 'QUERY_RETURNED_NO_RESULT' );
  }
}

export class TwilioAPIFailure extends BaseGraphError {
  constructor(message: string) {
    super( 'TwilioAPIFailure', message )
  }
}
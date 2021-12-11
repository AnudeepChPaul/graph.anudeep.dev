import { BaseGraphError } from '@/errors/index'

export class CustomErrors extends BaseGraphError {
  constructor(message?: string) {
    super( 'CustomErrors', message || "No document found!", 'QUERY_RETURNED_NO_RESULT' );
  }
}

export class TwilioAPIFailure extends BaseGraphError {
  constructor(message: string) {
    super( 'TwilioAPIFailure', message )
  }
}
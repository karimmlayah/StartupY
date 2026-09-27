import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        # Unhandled server exception (e.g. database error, python exception)
        logger.error(f"Unhandled exception in {context.get('view')}: {exc}", exc_info=True)
        return Response({
            'detail': "Unable to complete request. Please try again.",
            'error': "Server error encountered."
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Format standard validation or authentication errors cleanly
    if isinstance(response.data, dict):
        if 'detail' not in response.data:
            # Flatten or format dictionary errors
            first_err = next(iter(response.data.values()), None)
            if isinstance(first_err, list) and len(first_err) > 0:
                response.data['message'] = str(first_err[0])
            elif isinstance(first_err, str):
                response.data['message'] = first_err

    return response
